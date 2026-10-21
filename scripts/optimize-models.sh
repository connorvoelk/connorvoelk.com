#!/usr/bin/env bash
# Compresses the original high-res models in assets-src/models/ into the
# web-sized copies served from public/. Originals stay in assets-src/ (which is
# gitignored) so they can be re-exported at a different quality later.
#
#   npm run optimize:models            # every model
#   npm run optimize:models -- snake   # just assets-src/models/snake.glb
#
# meshopt geometry + WebP textures at 2048px cut the models ~95% (14 MB -> 0.7 MB).
# The browser needs public/meshopt_decoder.js to read them; see
# src/components/modelViewerConfig.ts.
set -euo pipefail
cd "$(dirname "$0")/.."

names=("$@")
if [ ${#names[@]} -eq 0 ]; then
  for f in assets-src/models/*.glb; do names+=("$(basename "$f" .glb)"); done
fi

for name in "${names[@]}"; do
  echo "optimizing $name"
  npx -y @gltf-transform/cli@4.5.1 optimize "assets-src/models/$name.glb" "public/$name.glb" \
    --compress meshopt --texture-compress webp --texture-size 2048
done
