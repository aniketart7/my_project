#!/bin/bash

set -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN secret is not set. Skipping GitHub sync."
  exit 1
fi

if [ -z "$GITHUB_REPO_URL" ]; then
  echo "ERROR: GITHUB_REPO_URL secret is not set. Skipping GitHub sync."
  exit 1
fi

REPO_HOST="${GITHUB_REPO_URL#https://}"
BRANCH=$(git rev-parse --abbrev-ref HEAD)

GIT_AUTH="-c credential.helper= -c url.https://x-token-auth:${GITHUB_TOKEN}@${REPO_HOST}.insteadOf=https://${REPO_HOST}"

echo "Syncing branch '$BRANCH' to GitHub ($GITHUB_REPO_URL)..."

if git $GIT_AUTH push "https://${REPO_HOST}" "${BRANCH}:${BRANCH}" 2>&1 | grep -v "https://"; then
  echo "Sync complete (fast-forward)."
  exit 0
fi

echo "Normal push failed; Replit is the source of truth — force-pushing to GitHub..."
git $GIT_AUTH push "https://${REPO_HOST}" "${BRANCH}:${BRANCH}" --force 2>&1 | grep -v "https://"

echo "Sync complete."
