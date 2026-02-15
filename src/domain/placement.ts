import type { Cell, Grid, HouseShape, Placement, Rotation } from './types'

export type CanPlaceReason = 'out_of_bounds' | 'collides'

export type CanPlaceResult =
  | Readonly<{ ok: true; cells: readonly Cell[] }>
  | Readonly<{ ok: false; reason: CanPlaceReason; cells: readonly Cell[] }>

export function rotateCell(cell: Cell, rotation: Rotation, pivot: Cell): Cell {
  const dx = cell.x - pivot.x
  const dy = cell.y - pivot.y

  switch (rotation) {
    case 0:
      return cell
    case 90:
      return { x: pivot.x - dy, y: pivot.y + dx }
    case 180:
      return { x: pivot.x - dx, y: pivot.y - dy }
    case 270:
      return { x: pivot.x + dy, y: pivot.y - dx }
  }
}

export function rotateCells(
  cells: readonly Cell[],
  rotation: Rotation,
  pivot: Cell = { x: 0, y: 0 },
): Cell[] {
  if (rotation === 0) return [...cells]
  return cells.map((cell) => rotateCell(cell, rotation, pivot))
}

export function absoluteCells(shape: HouseShape, placement: Placement): Cell[] {
  const pivot = shape.pivot ?? { x: 0, y: 0 }
  const rotated = rotateCells(shape.cells, placement.rotation, pivot)
  return rotated.map((cell) => ({
    x: cell.x + placement.anchor.x,
    y: cell.y + placement.anchor.y,
  }))
}

export function isWithinBounds(grid: Grid, cells: readonly Cell[]): boolean {
  return cells.every(
    (cell) => cell.x >= 0 && cell.y >= 0 && cell.x < grid.width && cell.y < grid.height,
  )
}

export function cellKey(cell: Cell): string {
  return `${cell.x},${cell.y}`
}

export function collides(
  occupiedKeys: ReadonlySet<string>,
  cells: readonly Cell[],
): boolean {
  return cells.some((cell) => occupiedKeys.has(cellKey(cell)))
}

export function canPlace(
  grid: Grid,
  occupiedKeys: ReadonlySet<string>,
  shape: HouseShape,
  placement: Placement,
): CanPlaceResult {
  const cells = absoluteCells(shape, placement)

  if (!isWithinBounds(grid, cells)) return { ok: false, reason: 'out_of_bounds', cells }
  if (collides(occupiedKeys, cells)) return { ok: false, reason: 'collides', cells }

  return { ok: true, cells }
}
