import { describe, expect, it } from 'vitest'

import { depthKeyForCell, gridToIsoCenter, isoToGridFloat, isPointInDiamond } from './isometric'
import type { Cell } from './types'

describe('isometric projection', () => {
  const m = { tileW: 40, tileH: 20, columnH: 12 } as const

  it('projects grid coords to expected iso center deltas', () => {
    const o = gridToIsoCenter({ x: 0, y: 0 }, m)
    expect(o).toEqual({ x: 0, y: 0 })

    const x1 = gridToIsoCenter({ x: 1, y: 0 }, m)
    expect(x1).toEqual({ x: 20, y: 10 })

    const y1 = gridToIsoCenter({ x: 0, y: 1 }, m)
    expect(y1).toEqual({ x: -20, y: 10 })
  })

  it('roundtrips grid -> iso -> grid (within tolerance)', () => {
    const cells: Cell[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 3, y: 2 },
      { x: 7, y: 1 },
    ]

    for (const c of cells) {
      const iso = gridToIsoCenter(c, m)
      const back = isoToGridFloat(iso, m)
      expect(back.x).toBeCloseTo(c.x, 8)
      expect(back.y).toBeCloseTo(c.y, 8)
    }
  })
})

describe('isPointInDiamond', () => {
  const m = { tileW: 40, tileH: 20, columnH: 12 } as const

  it('is true for the tile center', () => {
    const cell = { x: 2, y: 3 }
    const p = gridToIsoCenter(cell, m)
    expect(isPointInDiamond(p, cell, m)).toBe(true)
  })

  it('is false outside the diamond', () => {
    const cell = { x: 0, y: 0 }
    const c = gridToIsoCenter(cell, m)
    // Far to the right beyond half width.
    expect(isPointInDiamond({ x: c.x + 50, y: c.y }, cell, m)).toBe(false)
  })
})

describe('depthKeyForCell', () => {
  it('increases with x+y', () => {
    expect(depthKeyForCell({ x: 0, y: 0 })).toBe(0)
    expect(depthKeyForCell({ x: 1, y: 0 })).toBe(1)
    expect(depthKeyForCell({ x: 0, y: 1 })).toBe(1)
    expect(depthKeyForCell({ x: 2, y: 3 })).toBe(5)
  })
})

