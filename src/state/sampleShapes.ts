import type { Cell, HouseShape } from '../domain/types'

type ShapeMeta = Readonly<{
  id: string
  name: string
  color: string
  shape: HouseShape
}>

function rectCells(width: number, height: number): Cell[] {
  const cells: Cell[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) cells.push({ x, y })
  }
  return cells
}

export const sampleShapes: readonly ShapeMeta[] = [
  {
    id: 'house_14',
    name: 'House 14px (5×4)',
    color: '#27ae60',
    shape: {
      id: 'house_14',
      // Pattern:
      // __█__
      // _███_
      // █████
      // █████
      cells: [
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 0, y: 3 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
      ],
      pivot: { x: 2, y: 1 },
    },
  },
  {
    id: 'tetris_t',
    name: 'T-shape (demo)',
    color: '#9b51e0',
    shape: {
      id: 'tetris_t',
      cells: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
      ],
      pivot: { x: 1, y: 0 },
    },
  },
  {
    id: 'house_12',
    name: 'House 12px (4×3)',
    color: '#2f80ed',
    shape: {
      id: 'house_12',
      cells: rectCells(4, 3), // 12 pixels
      pivot: { x: 1, y: 1 },
    },
  },
]
