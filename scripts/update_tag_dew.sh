#!/usr/bin/env bash

# Auto-commit files and push tags
HUSKY_SKIP_HOOKS=1 git add .
HUSKY_SKIP_HOOKS=1 git commit -m "chore(release): clean up changelogs"
HUSKY_SKIP_HOOKS=1 git push origin feat/dew2.0
HUSKY_SKIP_HOOKS=1 git push --tags