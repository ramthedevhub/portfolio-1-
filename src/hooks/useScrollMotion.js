import { useEffect } from 'react'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Page-wide scroll motion (from the original page):
 *  • eased scroll progress  → --sp on <html>   (top progress bar)
 *  • hero fade/parallax      → --hp on #home
 *  • About figure drift      → --ap on #about
 *    The values glide toward the real scroll position, so it stays smooth even with stepped mouse wheels.
 *  • in-page links scroll with an eased glide instead of the browser's default jump.
 */
export default function useScrollMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cleanups = []

    /* ── eased anchor scrolling ── */
    let raf = 0
    const stopEvents = ['wheel', 'touchstart', 'keydown']
    const halt = () => {
      cancelAnimationFrame(raf)
      raf = 0
      stopEvents.forEach((k) => removeEventListener(k, halt))
    }
    function scrollToY(y) {
      halt()
      const y0 = window.scrollY
      const d = y - y0
      if (reduce.matches || Math.abs(d) < 4) {
        window.scrollTo({ top: y, behavior: 'instant' })
        return
      }
      const dur = Math.min(1500, Math.max(800, Math.abs(d) * 0.55))
      let t0 = 0
      stopEvents.forEach((k) => addEventListener(k, halt, { passive: true }))
      raf = requestAnimationFrame(function step(now) {
        t0 = t0 || now
        const t = Math.min(1, (now - t0) / dur)
        window.scrollTo({ top: y0 + d * easeInOut(t), behavior: 'instant' })
        if (t < 1) raf = requestAnimationFrame(step)
        else halt()
      })
    }
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      const el = id && document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
      scrollToY(Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin))
      history.replaceState(null, '', '#' + id)
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)
    cleanups.push(() => {
      document.removeEventListener('click', onClick)
      halt()
    })

    /* ── scroll-linked values ── */
    if (!reduce.matches) {
      const root = document.documentElement
      const hero = document.getElementById('home')
      const about = document.getElementById('about')
      const T = { hp: 0, sp: 0, ap: 0 }
      const C = { hp: 0, sp: 0, ap: 0 }
      let loop = 0
      const measure = () => {
        const y = window.scrollY
        const max = root.scrollHeight - window.innerHeight
        T.hp = hero ? clamp(y / (hero.offsetHeight * 0.85), 0, 1) : 0
        T.sp = max > 0 ? clamp(y / max, 0, 1) : 0
        if (about) {
          const r = about.getBoundingClientRect()
          T.ap = clamp((window.innerHeight * 0.5 - (r.top + r.height * 0.5)) / window.innerHeight, -1, 1)
        }
      }
      const tick = () => {
        let busy = false
        for (const k in T) {
          const d = T[k] - C[k]
          if (Math.abs(d) > 0.0005) {
            C[k] += d * 0.14
            busy = true
          } else C[k] = T[k]
        }
        if (hero) hero.style.setProperty('--hp', C.hp.toFixed(4))
        if (about) about.style.setProperty('--ap', C.ap.toFixed(4))
        root.style.setProperty('--sp', C.sp.toFixed(4))
        loop = busy ? requestAnimationFrame(tick) : 0
      }
      const kick = () => {
        measure()
        if (!loop) loop = requestAnimationFrame(tick)
      }
      addEventListener('scroll', kick, { passive: true })
      addEventListener('resize', kick, { passive: true })
      kick()
      cleanups.push(() => {
        removeEventListener('scroll', kick)
        removeEventListener('resize', kick)
        cancelAnimationFrame(loop)
      })
    } else {
      // reduced motion: plain progress bar, no parallax
      const root = document.documentElement
      const onScroll = () => {
        const max = root.scrollHeight - window.innerHeight
        root.style.setProperty('--sp', (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0).toFixed(4))
      }
      addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      cleanups.push(() => removeEventListener('scroll', onScroll))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
