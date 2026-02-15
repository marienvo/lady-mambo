import './styles/app.css'

import { useEffect } from 'react'

import { useGameStore } from './state/gameStore'
import { CanvasStage } from './ui/canvas/CanvasStage'

export function App() {
  const shapeMetaById = useGameStore((s) => s.shapeMetaById)
  const selectedShapeId = useGameStore((s) => s.selectedShapeId)
  const rotation = useGameStore((s) => s.rotation)

  const selectShape = useGameStore((s) => s.selectShape)
  const rotate = useGameStore((s) => s.rotate)
  const clearPlacements = useGameStore((s) => s.clearPlacements)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') rotate(90)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [rotate])

  const shapeOptions = Object.values(shapeMetaById)

  return (
    <div className="app">
      <header className="appHeader">
        <h1 className="appTitle">Lady Mambo</h1>
        <p className="appSubtitle">Grid-based house builder (Konva + Zustand)</p>
      </header>

      <main className="appMain">
        <aside className="panel">
          <h2 className="panelTitle">Tools</h2>

          <label className="field">
            <span className="fieldLabel">Shape</span>
            <select
              className="fieldControl"
              value={selectedShapeId}
              onChange={(e) => selectShape(e.target.value)}
            >
              {shapeOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <div className="row">
            <button className="button" type="button" onClick={() => rotate(90)}>
              Rotate (R) — {rotation}°
            </button>
            <button
              className="button buttonSecondary"
              type="button"
              onClick={clearPlacements}
            >
              Clear
            </button>
          </div>

          <div className="hint">
            <p>
              Move mouse to snap the ghost. Click to place. Out-of-bounds is always
              invalid.
            </p>
          </div>
        </aside>

        <section className="canvasPanel">
          <CanvasStage />
        </section>
      </main>
    </div>
  )
}
