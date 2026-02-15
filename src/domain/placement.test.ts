import { describe, expect, it } from 'vitest'

import { canPlace, collides, rotateCells } from './placement'
import type { Cell, Grid, HouseShape, Placement } from './types'

describe('rotateCells', () => {
  it('rotates 90 degrees clockwise around origin', () => {
    const cells: Cell[] = [{ x: 1, y: 0 }]
    expect(rotateCells(cells, 90, { x: 0, y: 0 })).toEqual([{ x: 0, y: 1 }])
  })

  it('rotates 270 degrees clockwise around origin', () => {
    const cells: Cell[] = [{ x: 1, y: 0 }]
    expect(rotateCells(cells, 270, { x: 0, y: 0 })).toEqual([{ x: 0, y: -1 }])
  })
})

describe('collides', () => {
  it('detects overlap via occupied cell keys', () => {
    const occupied = new Set(['2,3'])
    expect(collides(occupied, [{ x: 2, y: 3 }])).toBe(true)
    expect(collides(occupied, [{ x: 2, y: 4 }])).toBe(false)
  })
})

describe('canPlace', () => {
  const grid: Grid = { width: 5, height: 5 }
  const shape: HouseShape = {
    id: 'shape',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
  }

  it('rejects out-of-bounds placement (never partially outside)', () => {
    const placement: Placement = { shapeId: 'shape', anchor: { x: 4, y: 0 }, rotation: 0 }
    const result = canPlace(grid, new Set(), shape, placement)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('out_of_bounds')
  })

  it('rejects collisions', () => {
    const occupied = new Set(['1,1'])
    const placement: Placement = { shapeId: 'shape', anchor: { x: 1, y: 1 }, rotation: 0 }
    const result = canPlace(grid, occupied, shape, placement)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('collides')
  })

  it('accepts valid placement', () => {
    const placement: Placement = { shapeId: 'shape', anchor: { x: 1, y: 1 }, rotation: 0 }
    const result = canPlace(grid, new Set(), shape, placement)
    expect(result.ok).toBe(true)
  })
})
