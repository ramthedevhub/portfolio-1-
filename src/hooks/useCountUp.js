import { useEffect, useState } from 'react'

/** Counts from 0 to `to` each time `active` turns true (ease-out, 1.5 s). */
export default function useCountUp(to, active, duration = 1500) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return undefined
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return undefined
    }
    let raf = 0
    const t0 = performance.now() + 450 // let the card land first
    const step = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / duration))
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, active, duration])

  return value
}
