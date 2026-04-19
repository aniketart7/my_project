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
LOCAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TARGET_BRANCH="${GITHUB_SYNC_BRANCH:-main}"

if [ "$LOCAL_BRANCH" != "$TARGET_BRANCH" ]; then
  echo "Skipping GitHub sync: current branch '$LOCAL_BRANCH' is not '$TARGET_BRANCH'."
  exit 0
fi

echo "Syncing '$LOCAL_BRANCH' -> GitHub '$TARGET_BRANCH' at $GITHUB_REPO_URL ..."

push_to_github() {
  local extra_flags="$*"
  GIT_TERMINAL_PROMPT=0 \
    git \
      -c credential.helper= \
      -c "url.https://x-token-auth:${GITHUB_TOKEN}@${REPO_HOST}.insteadOf=https://${REPO_HOST}" \
      push "https://${REPO_HOST}" "${LOCAL_BRANCH}:${TARGET_BRANCH}" $extra_flags 2>&1 \
    | sed "s|${GITHUB_TOKEN}|***|g"
}

if push_to_github; then
  echo "Sync complete."
  exit 0
fi

if [ "${GITHUB_SYNC_FORCE:-false}" = "true" ]; then
  echo "Normal push failed and GITHUB_SYNC_FORCE=true — retrying with --force ..."
  push_to_github "--force"
  echo "Sync complete (forced)."
else
  echo "ERROR: Push to GitHub failed. Set GITHUB_SYNC_FORCE=true to allow force-push."
  exit 1
fi
