#!/bin/sh
# One-time setup: run scripts/stamp-assets.sh before every commit.
cd "$(git rev-parse --show-toplevel)" || exit 1
printf '#!/bin/sh\nexec scripts/stamp-assets.sh\n' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit scripts/stamp-assets.sh
echo "Installed pre-commit hook."
