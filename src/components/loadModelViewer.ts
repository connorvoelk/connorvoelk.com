// The .glb files in /public are meshopt-compressed (scripts/optimize-models.sh),
// and <model-viewer> can only decode them if it already knows where the decoder
// lives when each element is created. Setting that config right before
// importing the library guarantees the order, which a separate <script> tag
// can't: a cached script can upgrade the server-rendered elements first.
let loaded: Promise<unknown> | undefined

export function loadModelViewer() {
  if (!loaded) {
    const w = window as typeof window & {
      ModelViewerElement?: Record<string, unknown>
    }
    w.ModelViewerElement = {
      ...w.ModelViewerElement,
      meshoptDecoderLocation: '/meshopt_decoder.js',
    }
    loaded = import('@google/model-viewer')
  }
  return loaded
}
