import { create } from 'zustand'

import { occupiedKeysForPlacements } from '../domain/occupied'
import { canPlace } from '../domain/placement'
import type { Cell, Grid, HouseShape, Placement, Rotation } from '../domain/types'
import type { BuildingKind } from './sampleShapes'
import { sampleShapes } from './sampleShapes'

export type Placed = Placement &
  Readonly<{
    id: string
  }>

type ShapeMetaById = Readonly<
  Record<
    string,
    Readonly<{
      id: string
      name: string
      color: string
      building?: Readonly<{
        kind: BuildingKind
      }>
    }>
  >
>

type GameState = Readonly<{
  grid: Grid

  shapesById: Readonly<Record<string, HouseShape>>
  shapeMetaById: ShapeMetaById

  selectedShapeId: string
  rotation: Rotation
  hoverAnchor: Cell | null

  placements: readonly Placed[]
}>

type GameActions = Readonly<{
  selectShape: (shapeId: string) => void
  rotate: (delta?: Rotation) => void
  setHoverAnchor: (anchor: Cell | null) => void
  tryPlaceAtHover: () => void
  clearPlacements: () => void
}>

function buildShapes() {
  const shapesById: Record<string, HouseShape> = {}
  const shapeMetaById: Record<
    string,
    { id: string; name: string; color: string; building?: { kind: BuildingKind } }
  > = {}

  for (const meta of sampleShapes) {
    shapesById[meta.id] = meta.shape
    shapeMetaById[meta.id] = {
      id: meta.id,
      name: meta.name,
      color: meta.color,
      building: meta.building,
    }
  }

  return { shapesById, shapeMetaById }
}

function normalizeRotation(value: number): Rotation {
  const normalized = ((value % 360) + 360) % 360
  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270)
    return normalized
  return 0
}

const { shapesById, shapeMetaById } = buildShapes()

export const useGameStore = create<GameState & GameActions>((set) => ({
  grid: { width: 28, height: 28 },

  shapesById,
  shapeMetaById,

  selectedShapeId: sampleShapes[0]?.id ?? 'house_12',
  rotation: 0,
  hoverAnchor: null,

  placements: [],

  selectShape: (shapeId) => set({ selectedShapeId: shapeId }),
  rotate: (delta = 90) =>
    set((state) => ({
      rotation: normalizeRotation(state.rotation + delta),
    })),
  setHoverAnchor: (hoverAnchor) => set({ hoverAnchor }),

  tryPlaceAtHover: () =>
    set((state) => {
      if (!state.hoverAnchor) return state
      const shape = state.shapesById[state.selectedShapeId]
      if (!shape) return state

      const placement: Placement = {
        shapeId: state.selectedShapeId,
        anchor: state.hoverAnchor,
        rotation: state.rotation,
      }

      const occupied = occupiedKeysForPlacements(
        state.shapesById,
        state.placements.map((p) => ({
          shapeId: p.shapeId,
          anchor: p.anchor,
          rotation: p.rotation,
        })),
      )

      const result = canPlace(state.grid, occupied, shape, placement)
      if (!result.ok) return state

      const placed: Placed = { id: crypto.randomUUID(), ...placement }
      return { ...state, placements: [...state.placements, placed] }
    }),

  clearPlacements: () => set({ placements: [] }),
}))
