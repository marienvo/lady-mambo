export type Grid = Readonly<{
  width: number
  height: number
}>

export type Cell = Readonly<{
  x: number
  y: number
}>

export type Rotation = 0 | 90 | 180 | 270

export type HouseShape = Readonly<{
  id: string
  /**
   * Cells are relative to (0,0) unless a pivot is used for rotation.
   */
  cells: readonly Cell[]
  pivot?: Cell
}>

export type Placement = Readonly<{
  shapeId: string
  anchor: Cell
  rotation: Rotation
}>
