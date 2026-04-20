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
PROTECTED_BRANCHES="main"

push_branch_to_github() {
  local branch="$1"
  local extra_flags="${2:-}"
  GIT_TERMINAL_PROMPT=0 \
    git \
      -c credential.helper= \
      -c "url.https://x-token-auth:${GITHUB_TOKEN}@${REPO_HOST}.insteadOf=https://${REPO_HOST}" \
      push "https://${REPO_HOST}" "${branch}:${branch}" $extra_flags 2>&1 \
    | sed "s|${GITHUB_TOKEN}|***|g"
}

is_protected() {
  local branch="$1"
  echo "$PROTECTED_BRANCHES" | tr ',' '\n' | grep -qx "$branch"
}

FAILED_BRANCHES=()

while IFS= read -r branch; do
  echo "Syncing branch '$branch' -> GitHub ..."

  if push_branch_to_github "$branch"; then
    echo "Sync complete for '$branch'."
    continue
  fi

  if is_protected "$branch"; then
    echo "ERROR: Push to GitHub failed for protected branch '$branch'. Force-push is permanently disabled."
    FAILED_BRANCHES+=("$branch")
    continue
  fi

  if [ "${GITHUB_SYNC_FORCE:-false}" = "true" ]; then
    echo "Normal push failed for '$branch' and GITHUB_SYNC_FORCE=true — retrying with --force ..."
    if push_branch_to_github "$branch" "--force"; then
      echo "Sync complete (forced) for '$branch'."
    else
      echo "ERROR: Force-push also failed for '$branch'."
      FAILED_BRANCHES+=("$branch")
    fi
  else
    echo "ERROR: Push to GitHub failed for '$branch'. Set GITHUB_SYNC_FORCE=true to allow force-push (not available for protected branches)."
    FAILED_BRANCHES+=("$branch")
  fi
done < <(git branch --format='%(refname:short)')

if [ ${#FAILED_BRANCHES[@]} -gt 0 ]; then
  echo "ERROR: The following branches failed to sync: ${FAILED_BRANCHES[*]}"
  exit 1
fi

echo "All branches synced successfully."
