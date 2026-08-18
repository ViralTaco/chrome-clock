#!/usr/bin/env bash
set -e

# Extension Packager Script for Chrome Extensions (Hours & Minutes)
# Overrides any existing zip files in the workspace directory while excluding macOS metadata.

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$WORKSPACE_DIR"

echo "Packing extensions in $WORKSPACE_DIR..."

# Zip hours directory
if [ -d "hours" ]; then
  echo "Zipping hours/ -> hours.zip..."
  rm -f hours.zip
  zip -r -X hours.zip hours/ -x "*.DS_Store" -x "__MACOSX*" -x "*/.DS_Store"
fi

# Zip minutes directory
if [ -d "minutes" ]; then
  echo "Zipping minutes/ -> minutes.zip..."
  rm -f minutes.zip
  zip -r -X minutes.zip minutes/ -x "*.DS_Store" -x "__MACOSX*" -x "*/.DS_Store"
fi

echo "Successfully generated hours.zip and minutes.zip!"
