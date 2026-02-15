import { absoluteCells, cellKey } from './placement'
import type { HouseShape, Placement } from './types'

export function occupiedKeysForPlacements(
  shapesById: Readonly<Record<string, HouseShape>>,
  placements: readonly Placement[],
): Set<string> {
  const occupied = new Set<string>()

  for (const placement of placements) {
    const shape = shapesById[placement.shapeId]
    if (!shape) continue

    for (const cell of absoluteCells(shape, placement)) occupied.add(cellKey(cell))
  }

  return occupied
}
