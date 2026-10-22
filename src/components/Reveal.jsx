import useReveal from '../hooks/useReveal'

/**
 * Wraps content so it slides/fades in when scrolled into view (and again on every later visit).
 *   <Reveal as="li" i={2} variant="pop" className="card">…</Reveal>
 * i       – position in its group; later items start a little later (stagger)
 * variant – '' (rise) | 'l' (from left) | 'r' (from right) | 'pop' (scale up)
 * Everything inside can react to the `.in` class on this element (see motion.css).
 */
export default function Reveal({ as: Tag = 'div', i = 0, variant = '', className = '', style, innerRef, children, ...rest }) {
  const [ref, shown] = useReveal()
  const setRef = (node) => {
    ref.current = node
    if (innerRef) innerRef.current = node
  }
  const classes = ['rv', variant, shown ? 'in' : '', className].filter(Boolean).join(' ')
  return (
    <Tag ref={setRef} className={classes} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
