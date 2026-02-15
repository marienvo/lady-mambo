import { useEffect, useMemo, useRef, useState } from 'react'

import { CanvasStage } from './CanvasStage'

type Size = Readonly<{ width: number; height: number }>

function measure(el: HTMLElement): Size {
  return { width: el.clientWidth, height: el.clientHeight }
}

export function SquareCanvasViewport() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId: number | null = null
    let debounceId: number | null = null

    const update = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        setSize(measure(el))
      })
    }

    // Optional: during aggressive window dragging, delay some updates.
    const updateDebounced = () => {
      if (debounceId != null) window.clearTimeout(debounceId)
      debounceId = window.setTimeout(update, 32)
    }

    setSize(measure(el))

    const observer = new ResizeObserver(updateDebounced)
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafId != null) cancelAnimationFrame(rafId)
      if (debounceId != null) window.clearTimeout(debounceId)
    }
  }, [])

  const stageSize = useMemo(() => {
    const s = Math.floor(Math.min(size.width, size.height))
    return Number.isFinite(s) ? Math.max(0, s) : 0
  }, [size.height, size.width])

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {stageSize > 0 ? (
        <div style={{ placeSelf: 'center' }}>
          <CanvasStage stageSize={stageSize} />
        </div>
      ) : null}
    </div>
  )
}
