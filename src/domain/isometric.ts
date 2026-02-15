import type { Cell } from './types'

export type IsoMetrics = Readonly<{
  /**
   * Width of a single diamond tile in pixels.
   */
  tileW: number
  /**
   * Height of a single diamond tile in pixels.
   */
  tileH: number
  /**
   * Visual column height in pixels (for the “building” effect).
   */
  columnH: number
}>

export type Point = Readonly<{ x: number; y: number }>

export function gridToIsoCenter(cell: Cell, m: IsoMetrics): Point {
  const halfW = m.tileW / 2
  const halfH = m.tileH / 2

  return {
    x: (cell.x - cell.y) * halfW,
    y: (cell.x + cell.y) * halfH,
  }
}

/**
 * Inverse of `gridToIsoCenter`, but returns floats (no rounding).
 */
export function isoToGridFloat(p: Point, m: IsoMetrics): Readonly<{ x: number; y: number }> {
  const halfW = m.tileW / 2
  const halfH = m.tileH / 2

  // Guard against invalid metrics to avoid NaNs in callers.
  if (halfW === 0 || halfH === 0) return { x: 0, y: 0 }

  const a = p.x / halfW // x - y
  const b = p.y / halfH // x + y

  return {
    x: (a + b) / 2,
    y: (b - a) / 2,
  }
}

/**
 * Diamond hit test in screen space for the tile at `cell`.
 * Assumes `p` and `cell` are in the same coordinate space (offset already applied).
 */
export function isPointInDiamond(p: Point, cell: Cell, m: IsoMetrics): boolean {
  const c = gridToIsoCenter(cell, m)
  const halfW = m.tileW / 2
  const halfH = m.tileH / 2
  if (halfW === 0 || halfH === 0) return false

  const dx = Math.abs(p.x - c.x) / halfW
  const dy = Math.abs(p.y - c.y) / halfH
  return dx + dy <= 1
}

/**
 * Sort key for drawing: smaller values are “further back”.
 * Tie-breakers should be applied in the renderer for stable ordering.
 */
export function depthKeyForCell(cell: Cell): number {
  return cell.x + cell.y
}

