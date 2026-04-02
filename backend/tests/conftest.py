"""
conftest.py — Pytest Configuration for Extent-Style Reports
============================================================
Enhances pytest-html with Extent-style summary cards and visual dashboard.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

import pytest
import jinja2


def pytest_configure(config):
    """Configure custom report generation."""
    config.addinivalue_line("markers", "smoke: Smoke tests")
    config.addinivalue_line("markers", "functional: Functional tests")
    config.addinivalue_line("markers", "api: API tests")
    config.addinivalue_line("markers", "security: Security tests")


def pytest_sessionfinish(session, exitstatus):
    """Generate Extent-style summary HTML after all tests complete."""
    if hasattr(session, "config"):
        config = session.config
        if hasattr(config, "_pytest_json_reportfile"):
            generate_extent_summary(config, exitstatus)


def generate_extent_summary(config, exitstatus):
    """Generate an Extent-style quick summary HTML."""
    report_dir = Path("reports/unit")
    report_dir.mkdir(parents=True, exist_ok=True)

    # Gather test results
    test_results = {
        "total": 0,
        "passed": 0,
        "failed": 0,
        "skipped": 0,
        "duration": 0,
        "tests": [],
    }

    # Try to read JSON report if available
    json_report = report_dir / "report.json"
    if json_report.exists():
        try:
            with open(json_report) as f:
                data = json.load(f)
                if "summary" in data:
                    test_results["total"] = data["summary"].get("total", 0)
                    test_results["passed"] = data["summary"].get("passed", 0)
                    test_results["failed"] = data["summary"].get("failed", 0)
                    test_results["skipped"] = data["summary"].get("skipped", 0)
        except Exception:
            pass

    # Generate Extent-style HTML
    template = jinja2.Template(EXTENT_TEMPLATE)

    html_content = template.render(
        generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        total=test_results["total"],
        passed=test_results["passed"],
        failed=test_results["failed"],
        skipped=test_results["skipped"],
        pass_rate=round(
            (test_results["passed"] / max(test_results["total"], 1)) * 100, 1
        ),
        status="PASS" if test_results["failed"] == 0 else "FAIL",
    )

    extent_report = report_dir / "extent-summary.html"
    with open(extent_report, "w") as f:
        f.write(html_content)

    print(f"\n📊 Extent-style summary generated: {extent_report}")


EXTENT_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Summary - Extent Style</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2rem; margin-bottom: 5px; }
        .header p { opacity: 0.9; font-size: 0.9rem; }
        
        .status-banner {
            padding: 20px;
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
        }
        .status-banner.pass { background: #d4edda; color: #155724; }
        .status-banner.fail { background: #f8d7da; color: #721c24; }
        
        .cards { display: flex; justify-content: space-around; padding: 30px; gap: 20px; }
        .card {
            flex: 1;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .card.total { background: #e3f2fd; }
        .card.passed { background: #d4edda; }
        .card.failed { background: #f8d7da; }
        .card.skipped { background: #fff3cd; }
        
        .card-value { font-size: 2.5rem; font-weight: bold; }
        .card-label { font-size: 0.9rem; color: #666; margin-top: 5px; }
        .card.passed .card-value { color: #28a745; }
        .card.failed .card-value { color: #dc3545; }
        .card.skipped .card-value { color: #ffc107; }
        
        .pass-rate {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
        }
        .pass-rate-value {
            font-size: 4rem;
            font-weight: bold;
            color: #28a745;
        }
        .pass-rate-label { color: #666; }
        
        .footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            color: #666;
            font-size: 0.85rem;
        }
        
        .links {
            display: flex;
            justify-content: center;
            gap: 15px;
            padding: 20px;
            background: #f8f9fa;
        }
        .links a {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-size: 0.9rem;
            transition: transform 0.2s;
        }
        .links a:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Execution Summary</h1>
            <p>Unit Tests | Security Tests | E2E Tests | API Tests</p>
        </div>
        
        <div class="status-banner {{ 'pass' if status == 'PASS' else 'fail' }}">
            {{ '✅ ALL TESTS PASSED' if status == 'PASS' else '❌ SOME TESTS FAILED' }}
        </div>
        
        <div class="cards">
            <div class="card total">
                <div class="card-value">{{ total }}</div>
                <div class="card-label">Total Tests</div>
            </div>
            <div class="card passed">
                <div class="card-value">{{ passed }}</div>
                <div class="card-label">Passed</div>
            </div>
            <div class="card failed">
                <div class="card-value">{{ failed }}</div>
                <div class="card-label">Failed</div>
            </div>
            <div class="card skipped">
                <div class="card-value">{{ skipped }}</div>
                <div class="card-label">Skipped</div>
            </div>
        </div>
        
        <div class="pass-rate">
            <div class="pass-rate-value">{{ pass_rate }}%</div>
            <div class="pass-rate-label">Pass Rate</div>
        </div>
        
        <div class="links">
            <a href="report.html">📊 Detailed Report</a>
            <a href="coverage/index.html">📈 Coverage Report</a>
            <a href="https://camiloavilacm.github.io/camiloavila.dev/">🔍 Allure Reports</a>
        </div>
        
        <div class="footer">
            Generated: {{ generated_at }} | camiloavila.dev Test Suite
        </div>
    </div>
</body>
</html>
"""


@pytest.fixture(scope="session")
def extent_report_info(request):
    """Add extent-style metadata to test reports."""
    return {
        "project": "camiloavila.dev",
        "framework": "pytest",
        "environment": os.environ.get("TEST_ENV", "staging"),
    }
