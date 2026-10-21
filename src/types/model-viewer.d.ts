import type { DetailedHTMLProps, HTMLAttributes } from 'react'

// <model-viewer> is a web component loaded at runtime, so React's JSX types
// don't know about it. Its attributes are passed through as-is.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
        Record<string, unknown>
    }
  }
}
