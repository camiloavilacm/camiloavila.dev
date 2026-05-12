#!/usr/bin/env python3
"""
build_layer.py — Build Lambda layer with .lambdaignore exclusion support.

Usage:
    python scripts/build_layer.py [--layer-dir DIR] [--requirements FILE]

This script builds a Lambda layer by:
1. Installing dependencies from requirements into a target directory
2. Applying .lambdaignore exclusions (like __pycache__, .dist-info, tests, docs)
3. Cleaning up unnecessary files to keep the layer under 250MB

The .lambdaignore file uses the same syntax as .gitignore.
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


def parse_gitignore_patterns(file_path: Path) -> list[str]:
    patterns = []
    if not file_path.exists():
        return patterns
    with open(file_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            patterns.append(line)
    return patterns


def match_path(path: Path, pattern: str) -> bool:
    path_str = str(path)
    name = path.name

    if pattern.startswith("**/"):
        remainder = pattern[3:]
        return name == remainder or path_str.endswith(remainder)
    elif pattern.startswith("**"):
        return pattern[2:] in path_str
    elif pattern.startswith("!") or pattern.startswith("#"):
        return False
    elif "/" in pattern:
        parts = pattern.split("/")
        if parts[0] == "**":
            for i, part in enumerate(path.parts):
                sub_path = Path(*path.parts[i:])
                if match_single_pattern(sub_path, parts[1:]):
                    return True
            return False
        else:
            return match_single_pattern(Path(*path.parts[:len(parts)]), parts)
    else:
        return name == pattern


def match_single_pattern(path: Path, pattern_parts: list[str]) -> bool:
    if not pattern_parts:
        return True
    if len(pattern_parts) == 1:
        return path.name == pattern_parts[0]
    if len(path.parts) < len(pattern_parts):
        return False
    for i, part in enumerate(pattern_parts[:-1]):
        if path.parts[i] != part:
            return False
    return path.parts[len(pattern_parts) - 1] == pattern_parts[-1]


def should_exclude(path: Path, patterns: list[str]) -> bool:
    for pattern in patterns:
        if pattern.startswith("!"):
            continue
        if match_path(path, pattern):
            return True
    return False


def install_package(target_dir: Path, package: str) -> None:
    cmd = [
        sys.executable, "-m", "pip", "install",
        package,
        "--target", str(target_dir),
        "--python-version", "3.13",
        "--platform", "manylinux_2_17",
        "--only-binary", ":all:",
        "--no-deps",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        fallback_cmd = [
            sys.executable, "-m", "pip", "install",
            package,
            "--target", str(target_dir),
            "--no-deps",
        ]
        result = subprocess.run(fallback_cmd, capture_output=True, text=True)
    return result.returncode == 0


def install_requirements(target_dir: Path, requirements_file: Path) -> None:
    cmd = [
        sys.executable, "-m", "pip", "install",
        "-r", str(requirements_file),
        "--target", str(target_dir),
        "--python-version", "3.13",
        "--platform", "manylinux_2_17",
        "--only-binary", ":all:",
        "--no-deps",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        fallback_cmd = [
            sys.executable, "-m", "pip", "install",
            "-r", str(requirements_file),
            "--target", str(target_dir),
            "--no-deps",
        ]
        result = subprocess.run(fallback_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Warning: pip install had issues: {result.stderr[:200]}")


def clean_directory(target_dir: Path, patterns: list[str]) -> dict:
    removed = {"dirs": 0, "files": 0, "bytes": 0}

    for root, dirs, files in os.walk(target_dir, topdown=False):
        root_path = Path(root)

        to_remove_dirs = []
        for d in dirs:
            p = root_path / d
            if should_exclude(p, patterns):
                to_remove_dirs.append(d)
                removed["dirs"] += 1

                dir_size = sum(f.stat().st_size for f in p.rglob("*") if f.is_file())
                removed["bytes"] += dir_size

        for d in to_remove_dirs:
            dirs.remove(d)

        to_remove_files = []
        for f in files:
            p = root_path / f
            if should_exclude(p, patterns):
                to_remove_files.append(f)
                removed["files"] += 1
                removed["bytes"] += p.stat().st_size

        for f in to_remove_files:
            (root_path / f).unlink()

    return removed


def main():
    parser = argparse.ArgumentParser(description="Build Lambda layer with .lambdaignore support")
    parser.add_argument(
        "--layer-dir",
        type=str,
        default="backend/.lambda_layer",
        help="Target layer directory (default: backend/.lambda_layer)",
    )
    parser.add_argument(
        "--requirements",
        type=str,
        default="backend/requirements.txt",
        help="Requirements file to install (default: backend/requirements.txt)",
    )
    parser.add_argument(
        "--stage",
        type=str,
        default="production",
        help="Stage name for reporting",
    )
    args = parser.parse_args()

    layer_dir = Path(args.layer_dir)
    requirements = Path(args.requirements)
    python_dir = layer_dir / "python" / "lib" / "python3.13" / "site-packages"
    lambdaignore = layer_dir.parent / ".lambdaignore"

    print(f"Building Lambda layer at: {layer_dir}")
    print(f"Using requirements: {requirements}")

    if not requirements.exists():
        print(f"ERROR: Requirements file not found: {requirements}")
        sys.exit(1)

    print("\nStep 1: Clean existing layer...")
    if layer_dir.exists():
        shutil.rmtree(layer_dir)
    python_dir.mkdir(parents=True, exist_ok=True)

    print("\nStep 2: Install dependencies...")
    install_requirements(python_dir, requirements)

    print("\nStep 3: Apply .lambdaignore exclusions...")
    patterns = parse_gitignore_patterns(lambdaignore)
    removed = clean_directory(python_dir, patterns)

    total_size = sum(f.stat().st_size for f in python_dir.rglob("*") if f.is_file())
    total_mb = total_size / (1024 * 1024)

    print(f"\nLayer build complete!")
    print(f"  Removed: {removed['files']} files, {removed['dirs']} dirs ({removed['bytes'] / 1024 / 1024:.1f} MB)")
    print(f"  Final size: {total_mb:.1f} MB")
    if total_mb > 250:
        print(f"  WARNING: Layer exceeds 250MB limit!")
        sys.exit(1)
    else:
        print(f"  Layer size OK (limit: 250MB)")


if __name__ == "__main__":
    main()