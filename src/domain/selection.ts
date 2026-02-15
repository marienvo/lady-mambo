import { absoluteCells } from './placement'
import type { Cell, HouseShape, Placement } from './types'

export type PlacementWithId = Placement &
  Readonly<{
    id: string
  }>

/**
 * Returns the placement id whose footprint contains the given grid cell.
 *
 * Note: If multiple placements overlap (should not happen when using canPlace),
 * the first match in `placements` is returned.
 */
export function findPlacementIdAtCell(
  shapesById: Readonly<Record<string, HouseShape>>,
  placements: readonly PlacementWithId[],
  cell: Cell,
): string | null {
  for (const p of placements) {
    const shape = shapesById[p.shapeId]
    if (!shape) continue
    const abs = absoluteCells(shape, p)
    if (abs.some((c) => c.x === cell.x && c.y === cell.y)) return p.id
  }
  return null
}

