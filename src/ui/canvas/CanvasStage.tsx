import { Group, Layer, Line, Rect, Stage } from 'react-konva'

import { occupiedKeysForPlacements } from '../../domain/occupied'
import { absoluteCells, canPlace } from '../../domain/placement'
import type { Cell, Placement } from '../../domain/types'
import { useGameStore } from '../../state/gameStore'
import { cellToPixel, pointerToCell } from './gridMath'

function GridLines({
  width,
  height,
  cellSize,
}: {
  width: number
  height: number
  cellSize: number
}) {
  const stroke = 'rgba(128, 128, 128, 0.28)'

  const vertical = Array.from({ length: width + 1 }, (_, x) => (
    <Line
      key={`v-${x}`}
      points={[x * cellSize, 0, x * cellSize, height * cellSize]}
      stroke={stroke}
      strokeWidth={1}
    />
  ))

  const horizontal = Array.from({ length: height + 1 }, (_, y) => (
    <Line
      key={`h-${y}`}
      points={[0, y * cellSize, width * cellSize, y * cellSize]}
      stroke={stroke}
      strokeWidth={1}
    />
  ))

  return (
    <>
      {vertical}
      {horizontal}
    </>
  )
}

function CellRects({
  cells,
  cellSize,
  fill,
  opacity,
}: {
  cells: readonly Cell[]
  cellSize: number
  fill: string
  opacity?: number
}) {
  return cells.map((cell) => {
    const px = cellToPixel(cell, cellSize)
    return (
      <Rect
        key={`${cell.x},${cell.y}`}
        x={px.x}
        y={px.y}
        width={cellSize}
        height={cellSize}
        fill={fill}
        opacity={opacity}
        stroke="rgba(0, 0, 0, 0.18)"
        strokeWidth={1}
      />
    )
  })
}

export function CanvasStage({ stageSize }: { stageSize: number }) {
  const grid = useGameStore((s) => s.grid)

  const shapesById = useGameStore((s) => s.shapesById)
  const shapeMetaById = useGameStore((s) => s.shapeMetaById)

  const placements = useGameStore((s) => s.placements)
  const selectedShapeId = useGameStore((s) => s.selectedShapeId)
  const rotation = useGameStore((s) => s.rotation)
  const hoverAnchor = useGameStore((s) => s.hoverAnchor)

  const setHoverAnchor = useGameStore((s) => s.setHoverAnchor)
  const tryPlaceAtHover = useGameStore((s) => s.tryPlaceAtHover)

  const cellSize = Math.max(1, Math.floor(stageSize / Math.max(grid.width, grid.height)))
  const gridPxW = grid.width * cellSize
  const gridPxH = grid.height * cellSize
  const offsetX = Math.floor((stageSize - gridPxW) / 2)
  const offsetY = Math.floor((stageSize - gridPxH) / 2)

  const placementsForDomain: Placement[] = placements.map((p) => ({
    shapeId: p.shapeId,
    anchor: p.anchor,
    rotation: p.rotation,
  }))
  const occupied = occupiedKeysForPlacements(shapesById, placementsForDomain)

  const selectedShape = shapesById[selectedShapeId]
  const selectedColor = shapeMetaById[selectedShapeId]?.color ?? '#2f80ed'

  const hoverPlacement =
    hoverAnchor && selectedShape
      ? ({ shapeId: selectedShapeId, anchor: hoverAnchor, rotation } satisfies Placement)
      : null

  const ghost =
    hoverPlacement && selectedShape
      ? canPlace(grid, occupied, selectedShape, hoverPlacement)
      : null

  return (
    <Stage
      width={stageSize}
      height={stageSize}
      onMouseMove={(e) => {
        const pos = e.target.getStage()?.getPointerPosition()
        if (!pos) return
        const pointerCell = pointerToCell(pos, cellSize, offsetX, offsetY)
        const pivot = selectedShape?.pivot ?? { x: 0, y: 0 }
        // Keep the cursor on the shape's pivot (roughly its center).
        setHoverAnchor({ x: pointerCell.x - pivot.x, y: pointerCell.y - pivot.y })
      }}
      onMouseLeave={() => setHoverAnchor(null)}
      onClick={() => tryPlaceAtHover()}
      style={{ background: 'rgba(127,127,127,0.06)', borderRadius: 12 }}
    >
      <Layer>
        <Group x={offsetX} y={offsetY}>
          <GridLines width={grid.width} height={grid.height} cellSize={cellSize} />
        </Group>
      </Layer>

      <Layer>
        <Group x={offsetX} y={offsetY}>
          {placements.flatMap((p) => {
            const shape = shapesById[p.shapeId]
            if (!shape) return []
            const color = shapeMetaById[p.shapeId]?.color ?? '#2f80ed'
            return (
              <CellRects
                key={p.id}
                cells={absoluteCells(shape, p)}
                cellSize={cellSize}
                fill={color}
              />
            )
          })}
        </Group>
      </Layer>

      <Layer>
        <Group x={offsetX} y={offsetY}>
          {ghost ? (
            <CellRects
              cells={ghost.cells}
              cellSize={cellSize}
              fill={ghost.ok ? selectedColor : '#eb5757'}
              opacity={0.35}
            />
          ) : null}
        </Group>
      </Layer>
    </Stage>
  )
}
