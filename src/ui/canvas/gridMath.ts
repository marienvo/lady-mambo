import {
  gridToIsoCenter,
  isoToGridFloat,
  isPointInDiamond,
  type IsoMetrics,
  type Point,
} from '../../domain/isometric'
import type { Cell } from '../../domain/types'

export function pointerToCellIso(
  pointer: { x: number; y: number },
  metrics: IsoMetrics,
  offsetX: number,
  offsetY: number,
): Cell {
  const local: Point = { x: pointer.x - offsetX, y: pointer.y - offsetY }
  const g = isoToGridFloat(local, metrics)

  const baseX = Math.floor(g.x)
  const baseY = Math.floor(g.y)

  let best: Cell = { x: baseX, y: baseY }
  let bestDist = Number.POSITIVE_INFINITY

  // Prefer the tile that actually contains the pointer; fall back to nearest center.
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cell = { x: baseX + dx, y: baseY + dy }
      if (!isPointInDiamond(local, cell, metrics)) continue

      const c = gridToIsoCenter(cell, metrics)
      const ddx = local.x - c.x
      const ddy = local.y - c.y
      const dist = ddx * ddx + ddy * ddy
      if (dist < bestDist) {
        bestDist = dist
        best = cell
      }
    }
  }

  if (bestDist !== Number.POSITIVE_INFINITY) return best

  // Outside any candidate diamond (e.g. edges) — pick nearest center for stability.
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cell = { x: baseX + dx, y: baseY + dy }
      const c = gridToIsoCenter(cell, metrics)
      const ddx = local.x - c.x
      const ddy = local.y - c.y
      const dist = ddx * ddx + ddy * ddy
      if (dist < bestDist) {
        bestDist = dist
        best = cell
      }
    }
  }

  return best
}

export function cellToScreenIso(cell: Cell, metrics: IsoMetrics): Point {
  return gridToIsoCenter(cell, metrics)
}
