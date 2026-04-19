#!/bin/bash

set -eo pipefail

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

echo "Syncing branch '$BRANCH' to GitHub..."

push_to_github() {
  local extra_flags="$1"
  GIT_TERMINAL_PROMPT=0 \
    git \
      -c credential.helper= \
      -c "url.https://x-token-auth:${GITHUB_TOKEN}@${REPO_HOST}.insteadOf=https://${REPO_HOST}" \
      push "https://${REPO_HOST}" "${BRANCH}:${BRANCH}" $extra_flags 2>&1 \
    | sed "s|${GITHUB_TOKEN}|***|g"
}

if push_to_github ""; then
  echo "Sync complete."
  exit 0
fi

echo "Normal push failed; Replit is the source of truth — retrying with force push..."
push_to_github "--force"

echo "Sync complete."
