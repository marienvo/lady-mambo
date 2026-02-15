import type { Cell } from '../../domain/types'

export function pointerToCell(
  pointer: { x: number; y: number },
  cellSize: number,
  offsetX: number,
  offsetY: number,
): Cell {
  return {
    x: Math.floor((pointer.x - offsetX) / cellSize),
    y: Math.floor((pointer.y - offsetY) / cellSize),
  }
}

export function cellToPixel(cell: Cell, cellSize: number): { x: number; y: number } {
  return {
    x: cell.x * cellSize,
    y: cell.y * cellSize,
  }
}
