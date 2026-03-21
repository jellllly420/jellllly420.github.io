#!/usr/bin/env bash
set -euo pipefail

SLIDES_DIR="slides"
OUT_DIR="public/slides"

if [ ! -d "$SLIDES_DIR" ]; then
  echo "No slides directory found, skipping."
  exit 0
fi

for deck_dir in "$SLIDES_DIR"/*/; do
  if [ ! -f "${deck_dir}slides.md" ]; then
    continue
  fi

  deck_name=$(basename "$deck_dir")
  echo "Building slide deck: $deck_name"

  npx slidev build "${deck_dir}slides.md" \
    --out "../../${OUT_DIR}/${deck_name}" \
    --base "/slides/${deck_name}/"
done

echo "All slide decks built."
