/**
 * Light/dark "blend" value. --d is 0 in light mode and 1 in dark mode; every colour token in
 * index.css is mixed from it, so the whole page can fade smoothly (the lamp animation drives it
 * frame by frame, the navbar toggle tweens it).
 */
const root = () => document.documentElement
let value = 0
let tweenId = 0

export const getD = () => value

export function setD(v) {
  value = v
  root().style.setProperty('--d', v.toFixed(4))
}

export function tweenD(to, ms = 520) {
  cancelAnimationFrame(tweenId)
  const from = value
  const t0 = performance.now()
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) {
    setD(to)
    return
  }
  const step = (now) => {
    const t = Math.min(1, (now - t0) / ms)
    setD(from + (to - from) * t * t * (3 - 2 * t))
    if (t < 1) tweenId = requestAnimationFrame(step)
  }
  tweenId = requestAnimationFrame(step)
}

export const cancelTween = () => cancelAnimationFrame(tweenId)

// Pick up the theme chosen before first paint (index.html sets data-theme and --d).
value = parseFloat(root().style.getPropertyValue('--d')) || 0
