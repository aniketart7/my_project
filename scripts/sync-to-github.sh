#!/bin/bash

set -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN secret is not set."
  exit 1
fi

if [ -z "$GITHUB_REPO_URL" ]; then
  echo "ERROR: GITHUB_REPO_URL secret is not set."
  exit 1
fi

REMOTE_URL="https://${GITHUB_TOKEN}@${GITHUB_REPO_URL#https://}"

git remote remove github 2>/dev/null || true
git remote add github "$REMOTE_URL"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Syncing branch '$BRANCH' to GitHub..."

git push github "$BRANCH" --force 2>&1 | grep -v "https://"

echo "Sync complete."
