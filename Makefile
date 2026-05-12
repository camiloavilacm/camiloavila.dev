# Makefile for camiloavila.dev — Lambda layer and deployment helpers
# ============================================================================

.PHONY: help layer layer-staging layer-prod test clean

help:
	@echo "Available targets:"
	@echo "  layer          — Build Lambda layer (production deps only)"
	@echo "  layer-staging — Build Lambda layer for staging deploy"
	@echo "  layer-prod    — Build Lambda layer for production deploy"
	@echo "  test           — Run all backend unit tests locally"
	@echo "  clean          — Remove .lambda_layer directory"

layer:
	python3 scripts/build_layer.py --layer-dir backend/.lambda_layer --requirements backend/requirements-layer.txt

layer-staging:
	python3 scripts/build_layer.py --layer-dir backend/.lambda_layer --requirements backend/requirements-layer.txt --stage staging

layer-prod:
	python3 scripts/build_layer.py --layer-dir backend/.lambda_layer --requirements backend/requirements-layer.txt --stage prod

test:
	@echo "=== Running backend unit tests ==="
	cd backend && python3 -m pip install -q -r requirements.txt && python3 -m pytest tests/unit/ -v --tb=short
	@echo "=== All tests passed ==="

clean:
	rm -rf backend/.lambda_layer