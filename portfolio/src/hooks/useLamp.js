import { useCallback, useEffect, useRef } from 'react'
import { loadFrames } from '../lib/frames'
import { setD, tweenD, cancelTween } from '../lib/theme'
import whenIdle from './whenIdle'

/**
 * The pull-cord lamp in the hero. Clicking it plays the original clip (57 frames at 24 fps) and
 * fades the whole page from light to dark in step with the room's brightness; clicking again plays
 * the clip backwards. In dark mode a 25-frame "typing in the dark" loop plays (ping-pong, 12 fps).
 *
 * Frames live in public/images (lamp-pull-1/2.webp, lamp-loop.webp) and load when the browser is idle.
 * If they fail to load, or the visitor prefers reduced motion, the theme just fades without the clip.
 */
const FW = 350
const FH = 540
const PULL = [
  { src: '/images/lamp-pull-1.webp', count: 29 },
  { src: '/images/lamp-pull-2.webp', count: 28 },
]
const LOOP = [{ src: '/images/lamp-loop.webp', count: 25 }]
const PULL_FRAMES = 57
const LOOP_FRAMES = 25
const LT = PULL_FRAMES - 1 // last pull frame
const FLIP = 22 // frame where the lamp actually switches
const PULL_FPS = 24
const LOOP_FPS = 12

// Room brightness along the clip (measured from the footage): 0 = lit, 1 = dark
const CURVE = [[0, 0], [16, 0], [18, 0.04], [20, 0.27], [22, 0.57], [24, 0.85], [26, 0.98], [28, 1], [LT, 1]]
function brightness(p) {
  for (let k = 1; k < CURVE.length; k++) {
    const a = CURVE[k - 1]
    const b = CURVE[k]
    if (p <= b[0]) {
      const t = (p - a[0]) / (b[0] - a[0] || 1)
      const l = a[1] + (b[1] - a[1]) * t
      return l * l * (3 - 2 * l)
    }
  }
  return 1
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isDark = () => document.documentElement.dataset.theme === 'dark'
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let clipsPromise = null
function loadClips() {
  if (!clipsPromise) {
    clipsPromise = Promise.all([loadFrames(PULL, FW, FH), loadFrames(LOOP, FW, FH)])
      .then(([pull, loop]) => ({ pull, loop }))
      .catch(() => {
        clipsPromise = null
        return null
      })
  }
  return clipsPromise
}

// Draws a (possibly fractional) frame, cross-fading into the next one for smooth playback.
function drawFrame(ctx, frames, position) {
  const last = frames.count - 1
  const i = Math.min(Math.max(Math.floor(position), 0), last)
  const next = Math.min(i + 1, last)
  const f = position - i
  ctx.globalAlpha = 1
  frames.draw(ctx, i)
  if (next !== i && f > 0.01) {
    ctx.globalAlpha = f
    frames.draw(ctx, next)
    ctx.globalAlpha = 1
  }
}

export default function useLamp({ sceneRef, fxRef, theme, setTheme }) {
  const state = useRef({ busy: false, raf: 0, loopRaf: 0, visible: true })

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(state.current.loopRaf)
    state.current.loopRaf = 0
  }, [])

  const startLoop = useCallback(
    (clips) => {
      const canvas = fxRef.current
      if (!canvas) return
      stopLoop()
      const ctx = canvas.getContext('2d', { alpha: false })
      const period = 2 * (LOOP_FRAMES - 1)
      const t0 = performance.now()
      const step = (now) => {
        if (!state.current.visible) {
          state.current.loopRaf = 0
          return
        }
        const m = (((now - t0) / 1000) * LOOP_FPS) % period
        drawFrame(ctx, clips.loop, m < LOOP_FRAMES - 1 ? m : period - m)
        state.current.loopRaf = requestAnimationFrame(step)
      }
      state.current.loopRaf = requestAnimationFrame(step)
    },
    [fxRef, stopLoop],
  )

  // Keeps the canvas in step with the current theme (typing loop in dark mode, hidden in light).
  const sync = useCallback(async () => {
    const canvas = fxRef.current
    if (!canvas || state.current.busy) return
    stopLoop()
    if (!isDark()) {
      canvas.classList.remove('on')
      return
    }
    if (prefersReducedMotion() || !state.current.visible) return
    const clips = await loadClips()
    if (!clips || state.current.busy || !fxRef.current || !isDark()) return
    canvas.classList.add('on')
    startLoop(clips)
  }, [fxRef, startLoop, stopLoop])

  const toggle = useCallback(async () => {
    const s = state.current
    if (s.busy) return
    const goDark = !isDark()
    const next = goDark ? 'dark' : 'light'
    const canvas = fxRef.current
    const scene = sceneRef.current

    const fadeOnly = () => {
      cancelTween()
      setTheme(next)
      tweenD(goDark ? 1 : 0)
    }
    if (!canvas || !scene || prefersReducedMotion()) {
      fadeOnly()
      return
    }
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 2500))
    const clips = await Promise.race([loadClips(), timeout])
    if (!clips) {
      fadeOnly()
      return
    }
    if (s.busy) return

    s.busy = true
    cancelTween()
    document.documentElement.dataset.lamp = 'busy'
    scene.dispatchEvent(new Event('headreset'))
    stopLoop()

    const ctx = canvas.getContext('2d', { alpha: false })
    drawFrame(ctx, clips.pull, goDark ? 0 : LT)
    const wasVisible = canvas.classList.contains('on')
    canvas.classList.add('on')
    if (!wasVisible) await wait(400) // let the canvas fade in over the still illustration first

    let flipped = false
    const t0 = performance.now()
    await new Promise((resolve) => {
      const step = (now) => {
        const el = ((now - t0) / 1000) * PULL_FPS
        const p = goDark ? Math.min(el, LT) : Math.max(LT - el, 0)
        drawFrame(ctx, clips.pull, p)
        setD(brightness(p)) // the whole page fades with the room
        if (!flipped && (goDark ? p >= FLIP : p <= FLIP)) {
          flipped = true
          setTheme(next)
        }
        if (el >= LT) {
          resolve()
          return
        }
        s.raf = requestAnimationFrame(step)
      }
      s.raf = requestAnimationFrame(step)
    })

    if (!flipped) setTheme(next)
    setD(goDark ? 1 : 0)
    if (goDark) {
      startLoop(clips)
    } else {
      scene.dispatchEvent(new Event('headreset'))
      canvas.classList.remove('on')
      await wait(420)
    }
    s.busy = false
    delete document.documentElement.dataset.lamp
  }, [fxRef, sceneRef, setTheme, startLoop, stopLoop])

  // Follow theme changes made elsewhere (navbar toggle, saved theme on load)
  useEffect(() => {
    sync()
  }, [theme, sync])

  // Fetch the animation frames when idle so the first click feels instant,
  // and pause the typing loop while the hero is off screen.
  useEffect(() => {
    const s = state.current
    const saveData = navigator.connection && navigator.connection.saveData
    const cancelIdle = !prefersReducedMotion() && !saveData ? whenIdle(loadClips) : () => {}

    let observer
    const scene = sceneRef.current
    if (scene && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        s.visible = entry.isIntersecting
        if (entry.isIntersecting) sync()
        else stopLoop()
      })
      observer.observe(scene)
    }

    return () => {
      cancelIdle()
      if (observer) observer.disconnect()
      cancelAnimationFrame(s.raf)
      stopLoop()
      delete document.documentElement.dataset.lamp
      s.busy = false
    }
  }, [sceneRef, sync, stopLoop])

  const preload = useCallback(() => {
    if (!prefersReducedMotion()) loadClips()
  }, [])

  return { toggle, preload }
}
