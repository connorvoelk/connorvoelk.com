// The home page's dot grid and the page-transition squares share this layout,
// so the transition's squares always have the dots at their corners.

export const DOT_SPACING = 40

// Positions of the grid lines along one axis: as many as fit, `spacing`
// apart, centered in the available length
export function gridLines(length: number, spacing = DOT_SPACING): number[] {
  const count = Math.floor(length / spacing)
  const padding = (length - (count - 1) * spacing) / 2
  return Array.from({ length: count }, (_, i) => padding + i * spacing)
}
