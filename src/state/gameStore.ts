import { create } from 'zustand'

import { findPlacementIdAtCell } from '../domain/selection'
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
  placeEnabled: boolean

  placements: readonly Placed[]

  selectedPlacementId: string | null
  moveCandidateAnchor: Cell | null
}>

type GameActions = Readonly<{
  selectShape: (shapeId: string) => void
  rotate: (delta?: Rotation) => void
  setHoverAnchor: (anchor: Cell | null) => void
  setPlaceEnabled: (enabled: boolean) => void
  tryPlaceAtHover: () => void
  clearPlacements: () => void

  placementIdAtCell: (cell: Cell) => string | null
  selectPlacement: (id: string | null) => void
  deleteSelectedPlacement: () => void

  cancelMove: () => void
  setMoveCandidateAnchor: (anchor: Cell | null) => void
  commitMoveTo: (anchor: Cell) => void
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
  placeEnabled: true,

  placements: [],

  selectedPlacementId: null,
  moveCandidateAnchor: null,

  selectShape: (shapeId) => set({ selectedShapeId: shapeId }),
  rotate: (delta = 90) =>
    set((state) => ({
      rotation: normalizeRotation(state.rotation + delta),
    })),
  setHoverAnchor: (hoverAnchor) => set({ hoverAnchor }),
  setPlaceEnabled: (enabled) =>
    set((state) => ({
      ...state,
      placeEnabled: enabled,
      // Switching modes should avoid mixing states.
      hoverAnchor: enabled ? state.hoverAnchor : null,
      selectedPlacementId: enabled ? null : state.selectedPlacementId,
      moveCandidateAnchor: null,
    })),

  tryPlaceAtHover: () =>
    set((state) => {
      if (!state.placeEnabled) return state
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

  clearPlacements: () => set({ placements: [], selectedPlacementId: null, moveCandidateAnchor: null }),

  placementIdAtCell: (cell) => {
    const state = useGameStore.getState()
    return findPlacementIdAtCell(state.shapesById, state.placements, cell)
  },

  selectPlacement: (id) => set({ selectedPlacementId: id, moveCandidateAnchor: null }),

  deleteSelectedPlacement: () =>
    set((state) => {
      if (!state.selectedPlacementId) return state
      return {
        ...state,
        placements: state.placements.filter((p) => p.id !== state.selectedPlacementId),
        selectedPlacementId: null,
        moveCandidateAnchor: null,
      }
    }),

  cancelMove: () => set({ moveCandidateAnchor: null }),

  setMoveCandidateAnchor: (anchor) => set({ moveCandidateAnchor: anchor }),

  commitMoveTo: (anchor) =>
    set((state) => {
      const id = state.selectedPlacementId
      if (!id) return state
      const idx = state.placements.findIndex((p) => p.id === id)
      if (idx < 0) return { ...state, selectedPlacementId: null, moveCandidateAnchor: null }

      const current = state.placements[idx]!
      const shape = state.shapesById[current.shapeId]
      if (!shape) return state

      const occupied = occupiedKeysForPlacements(
        state.shapesById,
        state.placements
          .filter((p) => p.id !== id)
          .map((p) => ({ shapeId: p.shapeId, anchor: p.anchor, rotation: p.rotation })),
      )

      const candidate: Placement = {
        shapeId: current.shapeId,
        anchor,
        rotation: current.rotation,
      }
      const result = canPlace(state.grid, occupied, shape, candidate)
      if (!result.ok) return { ...state, moveCandidateAnchor: null }

      const updated: Placed = { ...current, anchor }
      const next = [...state.placements]
      next[idx] = updated
      return { ...state, placements: next, moveCandidateAnchor: null }
    }),
}))
