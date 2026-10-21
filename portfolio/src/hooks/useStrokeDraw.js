import { useEffect } from 'react'

/** Gives every shape inside the matching icons pathLength=1, so CSS can "draw" them with dash offsets. */
export default function useStrokeDraw(ref, selector) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    root.querySelectorAll(`${selector} *`).forEach((node) => node.setAttribute('pathLength', '1'))
  }, [ref, selector])
}
