/** Pointer-follow glow: sets --mx / --my on the hovered card (used by the ::after highlight in motion.css). */
export default function spotlight(event) {
  const el = event.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', event.clientX - r.left + 'px')
  el.style.setProperty('--my', event.clientY - r.top + 'px')
}
