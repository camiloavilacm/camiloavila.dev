# Makefile for camiloavila.dev — Lambda layer and deployment helpers
# ============================================================================

.PHONY: help layer layer-staging layer-prod clean

help:
	@echo "Available targets:"
	@echo "  layer          — Build Lambda layer (production deps only)"
	@echo "  layer-staging — Build Lambda layer for staging deploy"
	@echo "  layer-prod    — Build Lambda layer for production deploy"
	@echo "  clean          — Remove .lambda_layer directory"

layer:
	python3 scripts/build_layer.py --layer-dir backend/.lambda_layer --requirements backend/requirements-layer.txt

layer-staging:
	python3 scripts/build_layer.py --layer-dir backend/.lambda_layer --requirements backend/requirements-layer.txt --stage staging

layer-prod:
	python3 scripts/build_layer.py --layer-dir backend/.lambda_layer --requirements backend/requirements-layer.txt --stage prod

clean:
	rm -rf backend/.lambda_layer