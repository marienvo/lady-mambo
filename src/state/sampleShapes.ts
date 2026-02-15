import type { Cell, HouseShape } from '../domain/types'

export type BuildingKind = 'house' | 'church' | 'office'

type ShapeMeta = Readonly<{
  id: string
  name: string
  color: string
  building: Readonly<{
    kind: BuildingKind
  }>
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
    name: 'House',
    color: '#27ae60',
    building: { kind: 'house' },
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
    name: 'Church',
    color: '#9b51e0', // purple-ish for now
    building: { kind: 'church' },
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
    name: 'Office',
    color: '#2f80ed',
    building: { kind: 'office' },
    shape: {
      id: 'house_12',
      cells: rectCells(4, 3), // 12 pixels
      pivot: { x: 1, y: 1 },
    },
  },
]
