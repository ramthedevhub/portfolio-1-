import { useEffect, useRef, useState } from 'react'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll reveal that replays: `shown` turns true when the element scrolls into view and false
 * once it has fully left, so the entrance animation plays on every visit (as in the original page).
 * "Visible enough" = 15% of it, or 35% of the screen height for very tall blocks.
 */
export default function useReveal({ rootMargin = '0px 0px -8% 0px', amount = 0.15 } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => typeof window === 'undefined' || reduceMotion())

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduceMotion() || !('IntersectionObserver' in window)) {
      setShown(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= amount || entry.intersectionRect.height >= window.innerHeight * 0.35) {
            setShown(true)
          }
        } else {
          setShown(false)
        }
      },
      { threshold: [0, amount, 0.35, 0.6], rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, amount])

  return [ref, shown]
}
