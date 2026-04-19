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

REPO_HOST="${GITHUB_REPO_URL#https://}"
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Syncing branch '$BRANCH' to GitHub..."

GIT_ASKPASS=/bin/true \
  git -c "credential.helper=" \
      -c "url.https://x-token-auth:${GITHUB_TOKEN}@${REPO_HOST}.insteadOf=https://${REPO_HOST}" \
      push "https://${REPO_HOST}" "${BRANCH}:${BRANCH}" --force \
      2>&1 | grep -v "https://"

echo "Sync complete."
