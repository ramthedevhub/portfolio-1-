import Reveal from './Reveal'

/** Shared heading for each section: title, small hand-drawn underline (draws itself in), optional intro text. */
export default function SectionHeading({ id, title, children }) {
  return (
    <Reveal as="header" className="section-head">
      <h2 id={id}>{title}</h2>
      <svg className="squiggle" viewBox="0 0 64 8" aria-hidden="true" focusable="false">
        <path
          d="M1 6C16 1.5 42 1.5 63 4.5"
          pathLength="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      {children ? <p className="section-intro">{children}</p> : null}
    </Reveal>
  )
}
