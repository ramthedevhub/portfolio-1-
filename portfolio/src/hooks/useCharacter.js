import { useEffect } from 'react'
import { loadFrames } from '../lib/frames'
import whenIdle from './whenIdle'

/**
 * The living character in the About section (ported from the original page).
 *
 *  • Steam and clouds play continuously, forward, in a seamless 10-second loop.
 *  • The head follows the cursor — left/right and up — using the footage's own head-turn frames,
 *    eased so it glides. When the pointer leaves, it eases back to the rest pose.
 *  • Both come from the same footage: the clouds/steam regions are taken from the ambient playhead
 *    and composited over the cursor-driven pose with soft masks.
 *
 * Sprites (public/images): about-sprite-1/2.webp = 64 full frames, about-head.webp = 25 head poses.
 * Until they load (or with reduced motion) the still image inside the figure stays visible.
 */
const SPRITES = [
  { src: '/images/about-sprite-1.webp', count: 32 },
  { src: '/images/about-sprite-2.webp', count: 32 },
]
const HEADS = [{ src: '/images/about-head.webp', count: 25 }]
const FW = 400
const FH = 368
const REST = 16 // ambient/idle frame (matches about-idle.webp)
const HEAD = { x: 118, y: 48, w: 128, h: 160 } // head region inside the full frame
const LOOP_SECONDS = 10

const DEAD_ZONE = 0.03 // fraction of half-viewport around the character that does nothing
const FOLLOW_RATE = 11 // head ease speed (1/s) — snappy but glided
const RETURN_RATE = 4 // calmer return to rest when the pointer leaves
const BLEND_STEPS = 16 // sub-frame cross-fade resolution
const W_X = 0.85
const W_Y = 0.6 // how much horizontal / vertical cursor position steers the head

// Regions (frame pixels) whose pixels come from the ambient playhead (clouds + tea steam).
const AMBIENT_REGIONS = [
  { x: 0, y: 0, w: 122, h: 205, feather: 'right-x', a: 108, b: 122 }, // window + clouds
  { x: 242, y: 20, w: 158, h: 190, feather: 'left-x', a: 242, b: 256 }, // steam beside head
  { x: 205, y: 198, w: 120, h: 70, feather: 'top-y', a: 198, b: 212 }, // steam above mug
]

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

function makeCanvas() {
  const c = document.createElement('canvas')
  c.width = FW
  c.height = FH
  return c
}

/** Soft alpha mask: opaque inside the ambient regions, feathered on the open edges. */
function buildMask() {
  const c = makeCanvas()
  const g = c.getContext('2d')
  g.globalCompositeOperation = 'lighter'
  for (const r of AMBIENT_REGIONS) {
    const horizontal = r.feather.endsWith('-x')
    const grad = horizontal ? g.createLinearGradient(r.a, 0, r.b, 0) : g.createLinearGradient(0, r.a, 0, r.b)
    const fadeIn = r.feather.startsWith('left') || r.feather.startsWith('top')
    grad.addColorStop(0, `rgba(0,0,0,${fadeIn ? 0 : 1})`)
    grad.addColorStop(1, `rgba(0,0,0,${fadeIn ? 1 : 0})`)
    g.fillStyle = grad
    g.fillRect(r.x, r.y, r.w, r.h)
  }
  return c
}

export default function useCharacter(figureRef, canvasRef) {
  useEffect(() => {
    const fig = figureRef.current
    const canvas = canvasRef.current
    if (!fig || !canvas) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (navigator.connection && navigator.connection.saveData) return undefined

    let cancelled = false
    let raf = 0
    let last = 0
    let visible = true
    let blend = true
    let avg = 0
    let phase = REST
    let u = 0.5 // head pose: 0 = looking right/forward … 1 = turned left/up, 0.5 = rest
    let pointer = null
    let drawn = ''
    let dirtyRect = true
    let cx = 0
    let cy = 0
    let vw = 0
    let vh = 0
    let sprites
    let heads
    const cleanups = []

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    const layer = makeCanvas()
    const lctx = layer.getContext('2d')
    const mask = buildMask()

    const targetU = () => {
      if (!pointer) return 0.5
      if (dirtyRect) {
        const r = fig.getBoundingClientRect()
        cx = r.left + r.width / 2
        cy = r.top + r.height * 0.32 // head height
        vw = document.documentElement.clientWidth
        vh = window.innerHeight
        dirtyRect = false
      }
      const axis = (v, half) => {
        const n = clamp(v / half, -1, 1)
        const a = Math.abs(n)
        if (a <= DEAD_ZONE) return 0
        let t = (a - DEAD_ZONE) / (1 - DEAD_ZONE)
        t = t * t * (3 - 2 * t) * 0.6 + t * 0.4
        return Math.sign(n) * t
      }
      const nx = axis(pointer.x - cx, Math.max(cx, vw - cx)) // + = cursor right
      const ny = axis(cy - pointer.y, Math.max(cy, vh - cy)) // + = cursor above
      return 0.5 + clamp(-nx * W_X + ny * W_Y, -1, 1) * 0.5
    }

    // split a float frame position into [index, nextIndex, weight]
    const split = (p) => {
      const n = sprites.count
      p = ((p % n) + n) % n
      const i = Math.floor(p)
      const w = blend ? Math.round((p - i) * BLEND_STEPS) / BLEND_STEPS : 0
      return [i, (i + 1) % n, w]
    }

    const render = (force = false) => {
      const hp = u * (heads.count - 1)
      const hi = Math.min(Math.floor(hp), heads.count - 2)
      const hw = Math.round((hp - hi) * 32) / 32
      const [i, j, w] = split(phase)
      const key = hi + '|' + hw + '|' + i + '|' + w
      if (!force && key === drawn) return
      drawn = key

      ctx.globalAlpha = 1
      sprites.draw(ctx, REST) // body, mug, books (static) ← rest frame
      heads.draw(ctx, hi, HEAD.x, HEAD.y) // head ← cursor
      if (hw > 0) {
        ctx.globalAlpha = hw
        heads.draw(ctx, hi + 1, HEAD.x, HEAD.y)
        ctx.globalAlpha = 1
      }
      lctx.globalCompositeOperation = 'source-over' // clouds + steam ← forward loop
      lctx.clearRect(0, 0, FW, FH)
      lctx.globalAlpha = 1
      sprites.draw(lctx, i)
      if (w > 0) {
        lctx.globalAlpha = w
        sprites.draw(lctx, j)
        lctx.globalAlpha = 1
      }
      lctx.globalCompositeOperation = 'destination-in'
      lctx.drawImage(mask, 0, 0)
      ctx.drawImage(layer, 0, 0)
    }

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // Slow machines: drop cross-fading if frames average >28 ms.
      avg = avg ? avg * 0.95 + dt * 0.05 : dt
      if (avg > 0.028 && blend) blend = false

      phase = (phase + (dt * sprites.count) / LOOP_SECONDS) % sprites.count // forward only
      const rate = pointer ? FOLLOW_RATE : RETURN_RATE
      u += (targetU() - u) * (1 - Math.exp(-rate * dt))
      render()
      raf = requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const cancelIdle = whenIdle(async () => {
      try {
        ;[sprites, heads] = await Promise.all([loadFrames(SPRITES, FW, FH), loadFrames(HEADS, HEAD.w, HEAD.h)])
      } catch {
        return // the still illustration stays
      }
      if (cancelled) return
      render(true)
      fig.classList.add('is-ready')

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const onMove = (e) => {
          if (e.pointerType === 'mouse') pointer = { x: e.clientX, y: e.clientY }
        }
        const leave = () => (pointer = null)
        document.addEventListener('pointermove', onMove, { passive: true })
        document.documentElement.addEventListener('mouseleave', leave)
        window.addEventListener('blur', leave)
        cleanups.push(() => {
          document.removeEventListener('pointermove', onMove)
          document.documentElement.removeEventListener('mouseleave', leave)
          window.removeEventListener('blur', leave)
        })
      }
      const dirty = () => (dirtyRect = true)
      window.addEventListener('resize', dirty, { passive: true })
      window.addEventListener('scroll', dirty, { passive: true })
      cleanups.push(() => {
        window.removeEventListener('resize', dirty)
        window.removeEventListener('scroll', dirty)
      })

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        if (visible) kick()
        else stop()
      })
      io.observe(fig)
      cleanups.push(() => io.disconnect())
      kick()
    })

    return () => {
      cancelled = true
      cancelIdle()
      stop()
      cleanups.forEach((fn) => fn())
      fig.classList.remove('is-ready')
    }
  }, [figureRef, canvasRef])
}
