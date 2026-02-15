import { describe, expect, it } from 'vitest'

import { findPlacementIdAtCell } from './selection'
import type { HouseShape } from './types'

describe('findPlacementIdAtCell', () => {
  it('returns null when no placement occupies the cell', () => {
    const shape: HouseShape = { id: 's', cells: [{ x: 0, y: 0 }] }
    const shapesById = { s: shape } as const

    const placements = [{ id: 'p1', shapeId: 's', anchor: { x: 2, y: 2 }, rotation: 0 }] as const

    expect(findPlacementIdAtCell(shapesById, placements, { x: 0, y: 0 })).toBe(null)
  })

  it('finds a placement by footprint cell (with rotation)', () => {
    // L-shape around origin; rotate 90° around origin.
    const shape: HouseShape = {
      id: 's',
      cells: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
    }
    const shapesById = { s: shape } as const

    const placements = [
      { id: 'p1', shapeId: 's', anchor: { x: 10, y: 10 }, rotation: 90 as const },
    ] as const

    // Rotation 90°: (1,0)->(0,1), (0,1)->(-1,0), (0,0)->(0,0), then anchor.
    expect(findPlacementIdAtCell(shapesById, placements, { x: 10, y: 10 })).toBe('p1')
    expect(findPlacementIdAtCell(shapesById, placements, { x: 10, y: 11 })).toBe('p1')
    expect(findPlacementIdAtCell(shapesById, placements, { x: 9, y: 10 })).toBe('p1')
  })
})

