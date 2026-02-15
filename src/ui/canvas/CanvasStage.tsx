import { Group, Layer, Line, Stage } from 'react-konva'

import { occupiedKeysForPlacements } from '../../domain/occupied'
import { depthKeyForCell, gridToIsoCenter, type IsoMetrics } from '../../domain/isometric'
import { absoluteCells, canPlace } from '../../domain/placement'
import type { Cell, Placement } from '../../domain/types'
import { useGameStore } from '../../state/gameStore'
import { cellToScreenIso, pointerToCellIso } from './gridMath'

function shadeHex(hex: string, factor: number): string {
  if (!hex.startsWith('#')) return hex
  const raw = hex.slice(1)
  if (raw.length !== 6) return hex

  const r = Number.parseInt(raw.slice(0, 2), 16)
  const g = Number.parseInt(raw.slice(2, 4), 16)
  const b = Number.parseInt(raw.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return hex

  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  const rr = clamp(r * factor)
  const gg = clamp(g * factor)
  const bb = clamp(b * factor)
  return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`
}

function diamondPoints(center: { x: number; y: number }, m: IsoMetrics): number[] {
  const halfW = m.tileW / 2
  const halfH = m.tileH / 2
  return [
    center.x,
    center.y - halfH,
    center.x + halfW,
    center.y,
    center.x,
    center.y + halfH,
    center.x - halfW,
    center.y,
  ]
}

function IsoGrid({
  width,
  height,
  metrics,
}: {
  width: number
  height: number
  metrics: IsoMetrics
}) {
  const stroke = 'rgba(128, 128, 128, 0.20)'

  const cells: Cell[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells.push({ x, y })
    }
  }

  return cells.map((cell) => {
    const c = gridToIsoCenter(cell, metrics)
    return (
      <Line
        key={`g-${cell.x},${cell.y}`}
        points={diamondPoints(c, metrics)}
        closed
        stroke={stroke}
        strokeWidth={1}
      />
    )
  })
}

type ColoredCell = Readonly<{ cell: Cell; fill: string }>

function IsoColumnsColored({
  items,
  metrics,
  opacity,
}: {
  items: readonly ColoredCell[]
  metrics: IsoMetrics
  opacity?: number
}) {
  const sorted = [...items].sort((a, b) => {
    const da = depthKeyForCell(a.cell)
    const db = depthKeyForCell(b.cell)
    if (da !== db) return da - db
    if (a.cell.x !== b.cell.x) return a.cell.x - b.cell.x
    return a.cell.y - b.cell.y
  })

  return sorted.flatMap(({ cell, fill }) => {
    const topFill = fill
    const rightFill = shadeHex(fill, 0.86)
    const leftFill = shadeHex(fill, 0.74)

    const base = cellToScreenIso(cell, metrics)
    const top = { x: base.x, y: base.y - metrics.columnH }

    const halfW = metrics.tileW / 2
    const halfH = metrics.tileH / 2

    const topPts = diamondPoints(top, metrics)

    // Ground diamond corners (for side faces).
    const groundLeft = { x: base.x - halfW, y: base.y }
    const groundRight = { x: base.x + halfW, y: base.y }
    const groundBottom = { x: base.x, y: base.y + halfH }

    const topLeft = { x: top.x - halfW, y: top.y }
    const topRight = { x: top.x + halfW, y: top.y }
    const topBottom = { x: top.x, y: top.y + halfH }

    const leftFace = [
      topLeft.x,
      topLeft.y,
      topBottom.x,
      topBottom.y,
      groundBottom.x,
      groundBottom.y,
      groundLeft.x,
      groundLeft.y,
    ]

    const rightFace = [
      topRight.x,
      topRight.y,
      topBottom.x,
      topBottom.y,
      groundBottom.x,
      groundBottom.y,
      groundRight.x,
      groundRight.y,
    ]

    return [
      <Line
        key={`col-left-${cell.x},${cell.y}`}
        points={leftFace}
        closed
        fill={leftFill}
        opacity={opacity}
        stroke="rgba(0, 0, 0, 0.16)"
        strokeWidth={1}
      />,
      <Line
        key={`col-right-${cell.x},${cell.y}`}
        points={rightFace}
        closed
        fill={rightFill}
        opacity={opacity}
        stroke="rgba(0, 0, 0, 0.16)"
        strokeWidth={1}
      />,
      <Line
        key={`col-top-${cell.x},${cell.y}`}
        points={topPts}
        closed
        fill={topFill}
        opacity={opacity}
        stroke="rgba(0, 0, 0, 0.18)"
        strokeWidth={1}
      />,
    ]
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

  const span = grid.width + grid.height
  const tileW = Math.max(8, Math.floor((stageSize * 1.8) / Math.max(1, span)))
  const tileH = Math.max(4, Math.floor(tileW / 2))
  const metrics: IsoMetrics = {
    tileW,
    tileH,
    columnH: Math.max(4, Math.floor(tileH * 1.2)),
  }

  const corners: Cell[] = [
    { x: 0, y: 0 },
    { x: Math.max(0, grid.width - 1), y: 0 },
    { x: 0, y: Math.max(0, grid.height - 1) },
    { x: Math.max(0, grid.width - 1), y: Math.max(0, grid.height - 1) },
  ]
  const projected = corners.map((c) => gridToIsoCenter(c, metrics))
  const halfW = metrics.tileW / 2
  const halfH = metrics.tileH / 2
  const minX = Math.min(...projected.map((p) => p.x)) - halfW
  const maxX = Math.max(...projected.map((p) => p.x)) + halfW
  const minY = Math.min(...projected.map((p) => p.y)) - halfH - metrics.columnH
  const maxY = Math.max(...projected.map((p) => p.y)) + halfH

  const boundsW = maxX - minX
  const boundsH = maxY - minY
  const margin = 16
  const availW = Math.max(0, stageSize - margin * 2)
  const availH = Math.max(0, stageSize - margin * 2)
  const offsetX = Math.floor(margin + (availW - boundsW) / 2 - minX)
  const offsetY = Math.floor(margin + (availH - boundsH) / 2 - minY)

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

  const placedItems: ColoredCell[] = placements.flatMap((p) => {
    const shape = shapesById[p.shapeId]
    if (!shape) return []
    const color = shapeMetaById[p.shapeId]?.color ?? '#2f80ed'
    return absoluteCells(shape, p).map((cell) => ({ cell, fill: color }))
  })

  return (
    <Stage
      width={stageSize}
      height={stageSize}
      onMouseMove={(e) => {
        const pos = e.target.getStage()?.getPointerPosition()
        if (!pos) return
        const pointerCell = pointerToCellIso(pos, metrics, offsetX, offsetY)
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
          <IsoGrid width={grid.width} height={grid.height} metrics={metrics} />
        </Group>
      </Layer>

      <Layer>
        <Group x={offsetX} y={offsetY}>
          <IsoColumnsColored items={placedItems} metrics={metrics} />
        </Group>
      </Layer>

      <Layer>
        <Group x={offsetX} y={offsetY}>
          {ghost ? (
            <IsoColumnsColored
              items={ghost.cells.map((cell) => ({
                cell,
                fill: ghost.ok ? selectedColor : '#eb5757',
              }))}
              metrics={metrics}
              opacity={0.35}
            />
          ) : null}
        </Group>
      </Layer>
    </Stage>
  )
}
