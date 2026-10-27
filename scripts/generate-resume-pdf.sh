#!/usr/bin/env bash
# Prints the /resume page to public/connor-voelk-resume.pdf with headless
# Chrome, so the download always matches the page — and, like the page, never
# includes a phone number or address. Run it after editing resumeData.ts:
#
#   npm run resume:pdf
#
# Requires Google Chrome in /Applications.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=3123
OUT=public/connor-voelk-resume.pdf

npm run build
npx next start -p "$PORT" >/dev/null 2>&1 &
server=$!
trap 'kill "$server"' EXIT

until curl -sf "http://localhost:$PORT/resume" >/dev/null; do sleep 0.5; done

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "http://localhost:$PORT/resume" 2>/dev/null
echo "wrote $OUT"
