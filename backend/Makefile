# Delegate to repo-root Makefile (run `make dev` from backend/ or repo root).
ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/..)

.PHONY: help db-up db-down db-ps dev

help db-up db-down db-ps dev:
	@$(MAKE) -C "$(ROOT)" $@
