import { processSection } from '../data/portfolioData'
import useReveal from '../hooks/useReveal'
import Reveal from './Reveal'
import './Process.css'

export default function Process() {
  const [sectionRef, shown] = useReveal()
  const { eyebrow, title, highlightWord, subtitle, steps } = processSection

  // Split title around the highlightWord to apply the hand-drawn swoop underline
  const [beforeHighlight, afterHighlight] = title.split(highlightWord)

  return (
    <section
      className={`section process${shown ? ' in' : ''}`}
      id="process"
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      {/* ── Decorative Background Flourishes matching image ── */}
      {/* Top Left: Orange Swirl Loop */}
      <svg
        className="process-decor process-decor--swirl"
        viewBox="0 0 100 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 25C18 10 38 4 54 18C68 30 52 46 36 38C22 30 30 14 50 12C66 10 82 20 94 32" />
      </svg>

      {/* Top Right: Spark Marks */}
      <svg
        className="process-decor process-decor--sparks-tr"
        viewBox="0 0 70 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 12L24 24" />
        <path d="M42 6L44 22" />
        <path d="M62 18L50 26" />
      </svg>

      {/* Bottom Left: Organic Wave */}
      <svg
        className="process-decor process-decor--wave-bl"
        viewBox="0 0 180 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M0 70C40 70 60 90 95 90C130 90 145 60 180 60" opacity="0.4" />
        <path d="M0 45C35 45 50 80 85 80C120 80 135 40 170 30" />
      </svg>

      {/* Bottom Right: Hand-drawn botanical sprig */}
      <svg
        className="process-decor process-decor--leaf-br"
        viewBox="0 0 80 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M30 105C35 75 42 45 60 15" />
        {/* Leaf 1 */}
        <path d="M45 58C36 50 24 52 20 58C22 66 32 68 45 58Z" fill="currentColor" fillOpacity="0.12" />
        {/* Leaf 2 */}
        <path d="M52 40C64 35 72 40 70 48C62 52 52 46 52 40Z" fill="currentColor" fillOpacity="0.12" />
        {/* Leaf 3 */}
        <path d="M57 24C52 14 62 6 68 12C72 20 62 26 57 24Z" fill="currentColor" fillOpacity="0.12" />
        {/* Accents */}
        <path d="M68 6L74 2" stroke="var(--orange)" strokeWidth="2.5" />
        <path d="M76 12L80 10" stroke="var(--orange)" strokeWidth="2.5" />
      </svg>

      <div className="container">
        {/* ── Section Header ── */}
        <header className="process-header">
          <Reveal as="div" className="process-eyebrow" i={1}>
            {/* Left 3 rays */}
            <svg className="process-eyebrow-rays" viewBox="0 0 24 16" fill="none" stroke="currentColor">
              <path d="M22 14L10 10" strokeLinecap="round" />
              <path d="M22 8L6 8" strokeLinecap="round" />
              <path d="M22 2L10 6" strokeLinecap="round" />
            </svg>
            <span>{eyebrow}</span>
            {/* Right 3 rays */}
            <svg className="process-eyebrow-rays" viewBox="0 0 24 16" fill="none" stroke="currentColor">
              <path d="M2 14L14 10" strokeLinecap="round" />
              <path d="M2 8L18 8" strokeLinecap="round" />
              <path d="M2 2L14 6" strokeLinecap="round" />
            </svg>
          </Reveal>

          <Reveal as="h2" id="process-title" className="process-title" i={2}>
            {beforeHighlight}
            <span className="process-title-highlight">
              {highlightWord}
              {/* Hand-drawn swoop underline */}
              <svg className="process-title-swoop" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                <path
                  d="M4 12C45 4 135 3 196 14C150 9 75 7 12 16"
                  stroke="currentColor"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {afterHighlight}
          </Reveal>

          <Reveal as="p" className="process-subtitle" i={3}>
            {subtitle}
          </Reveal>
        </header>

        {/* ── 5 Steps Flow ── */}
        <div className="process-flow">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            return (
              <div key={step.id} className="process-step-wrap">
                <Reveal as="div" className="process-step" i={index + 3} variant="pop">
                  {/* Illustration Disc */}
                  <div className="process-illus-box">
                    <StepIllustration type={step.id} />
                  </div>

                  {/* Step Number */}
                  <div className="process-number" aria-label={`Step ${step.stepNumber}`}>
                    {step.stepNumber}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-desc">{step.description}</p>
                </Reveal>

                {/* Animated Connecting Dashed Arrow to Next Step */}
                {!isLast && (
                  <svg
                    className="process-connector"
                    viewBox="0 0 46 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M0 8H36" />
                    <path d="M30 3L37 8L30 13" fill="none" />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Vector illustrations faithfully reproducing the hand-drawn style of each step in the image */
function StepIllustration({ type }) {
  switch (type) {
    case 'discover':
      return (
        <img
          src="/assets/aistudio/image_91df20e3.png"
          alt="Discover - Understand the problem deeply"
          className="process-img anim-thought"
          width="172"
          height="163"
          loading="lazy"
          decoding="async"
        />
      )

    case 'design':
      return (
        <svg
          className="process-svg"
          viewBox="0 0 140 140"
          fill="none"
          stroke="#12161f"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Subtle radiating ticks */}
          <g stroke="var(--orange)" strokeWidth="2.2">
            <line x1="16" y1="52" x2="24" y2="56" />
            <line x1="18" y1="76" x2="26" y2="74" />
            <line x1="122" y1="54" x2="130" y2="52" />
          </g>

          {/* Wireframe Notepad (Tilted sheet) */}
          <g transform="rotate(-6 65 65)">
            {/* Paper sheet */}
            <rect x="28" y="24" width="70" height="88" rx="6" fill="#ffffff" strokeWidth="3" />
            {/* Top spiral binder notches */}
            <line x1="40" y1="20" x2="40" y2="28" strokeWidth="3.2" />
            <line x1="52" y1="20" x2="52" y2="28" strokeWidth="3.2" />
            <line x1="64" y1="20" x2="64" y2="28" strokeWidth="3.2" />
            <line x1="76" y1="20" x2="76" y2="28" strokeWidth="3.2" />

            {/* Wireframe UI elements */}
            {/* Header placeholder box with X */}
            <rect x="36" y="38" width="22" height="20" rx="3" fill="#f4f6fb" strokeWidth="2" />
            <line x1="36" y1="38" x2="58" y2="58" strokeWidth="1.8" />
            <line x1="58" y1="38" x2="36" y2="58" strokeWidth="1.8" />

            {/* Top horizontal text lines */}
            <line x1="64" y1="42" x2="90" y2="42" strokeWidth="2.4" />
            <line x1="64" y1="48" x2="86" y2="48" strokeWidth="2.4" />
            <line x1="64" y1="54" x2="80" y2="54" strokeWidth="2.4" />

            {/* Bottom placeholder box with X */}
            <rect x="36" y="66" width="22" height="20" rx="3" fill="#f4f6fb" strokeWidth="2" />
            <line x1="36" y1="66" x2="58" y2="86" strokeWidth="1.8" />
            <line x1="58" y1="66" x2="36" y2="86" strokeWidth="1.8" />

            {/* Bottom text lines */}
            <line x1="64" y1="70" x2="90" y2="70" strokeWidth="2.4" />
            <line x1="64" y1="76" x2="84" y2="76" strokeWidth="2.4" />
            <line x1="64" y1="82" x2="78" y2="82" strokeWidth="2.4" />
          </g>

          {/* Sharp Orange Pencil leaning across paper */}
          <g className="anim-pencil" transform="translate(14, 4)">
            {/* Pencil body */}
            <path
              d="M92 46L80 94L70 91L82 43Z"
              fill="var(--orange)"
              stroke="#12161f"
              strokeWidth="2.6"
            />
            {/* Pencil tip cone */}
            <path d="M80 94L73 108L70 91Z" fill="#ffcca8" stroke="#12161f" strokeWidth="2.6" />
            {/* Graphite lead point */}
            <polygon points="76,102 73,108 71,100" fill="#12161f" />
            {/* Eraser cap */}
            <path d="M92 46L82 43L84 35L94 38Z" fill="#ffd8bf" stroke="#12161f" strokeWidth="2.6" />
            <line x1="83" y1="40" x2="93" y2="43" strokeWidth="2" />
          </g>
        </svg>
      )

    case 'develop':
      return (
        <svg
          className="process-svg"
          viewBox="0 0 140 140"
          fill="none"
          stroke="#12161f"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Spark rays on sides */}
          <g stroke="var(--orange)" strokeWidth="2.4">
            <line x1="16" y1="60" x2="26" y2="60" />
            <line x1="18" y1="46" x2="28" y2="52" />
            <line x1="18" y1="74" x2="28" y2="68" />
            <line x1="124" y1="60" x2="114" y2="60" />
            <line x1="122" y1="46" x2="112" y2="52" />
            <line x1="122" y1="74" x2="112" y2="68" />
          </g>

          {/* Laptop Open Screen */}
          {/* Outer lid */}
          <rect x="34" y="38" width="72" height="48" rx="5" fill="#1e2533" strokeWidth="3" />
          {/* Inner Display Screen */}
          <rect x="38" y="42" width="64" height="40" rx="3" fill="#121721" />

          {/* Code Symbol: </> */}
          <g stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            {/* < */}
            <path d="M52 56L46 62L52 68" stroke="var(--orange)" />
            {/* / */}
            <line x1="68" y1="54" x2="62" y2="70" stroke="#ffffff" />
            {/* > */}
            <path d="M78 56L84 62L78 68" stroke="var(--orange)" />
          </g>

          {/* Laptop Base & Keyboard Deck */}
          <path
            d="M22 88L28 98C29 100 31 101 34 101H106C109 101 111 100 112 98L118 88H22Z"
            fill="#dbe2ed"
            strokeWidth="3"
          />
          {/* Trackpad notch */}
          <line x1="62" y1="92" x2="78" y2="92" stroke="#9ba4b4" strokeWidth="2" />
        </svg>
      )

    case 'deploy':
      return (
        <img
          src="/assets/aistudio/image_37264f1b.png"
          alt="Deploy - Test thoroughly and launch"
          className="process-img anim-rocket"
          width="162"
          height="155"
          loading="lazy"
          decoding="async"
        />
      )

    case 'improve':
      return (
        <svg
          className="process-svg"
          viewBox="0 0 140 140"
          fill="none"
          stroke="#12161f"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Radiating spark marks */}
          <g stroke="var(--orange)" strokeWidth="2.2">
            <line x1="20" y1="40" x2="30" y2="44" />
            <line x1="16" y1="62" x2="26" y2="62" />
            <line x1="18" y1="84" x2="28" y2="80" />
          </g>

          {/* Upward Trending Arrow */}
          <path
            d="M36 78C48 70 70 52 98 34"
            stroke="#12161f"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Arrow Head */}
          <path d="M88 33L98 34L97 45" stroke="#12161f" strokeWidth="3.2" fill="none" />

          {/* Bar Chart Bars */}
          <g className="anim-bar" style={{ transformOrigin: 'bottom' }}>
            {/* Bar 1 (Shortest - Blue/Navy) */}
            <rect x="34" y="86" width="14" height="24" rx="3" fill="#243447" strokeWidth="2.6" />
            {/* Bar 2 (Medium - Orange) */}
            <rect x="54" y="72" width="14" height="38" rx="3" fill="var(--orange)" strokeWidth="2.6" />
            {/* Bar 3 (Tallest - Orange) */}
            <rect x="74" y="54" width="14" height="56" rx="3" fill="var(--orange)" strokeWidth="2.6" />
            {/* Baseline */}
            <line x1="26" y1="110" x2="114" y2="110" strokeWidth="3" />
          </g>

          {/* Growing Leaf Sprig (Symbolizing Organic Improvement) */}
          <g transform="translate(14, 0)">
            <path d="M96 110C98 88 104 68 116 58" stroke="#12161f" strokeWidth="2.8" />
            {/* Leaves */}
            <path
              d="M102 88C94 82 92 72 98 68C104 74 106 82 102 88Z"
              fill="#243447"
              stroke="#12161f"
              strokeWidth="2.2"
            />
            <path
              d="M106 72C116 68 122 72 120 80C112 82 106 78 106 72Z"
              fill="#243447"
              stroke="#12161f"
              strokeWidth="2.2"
            />
            <path
              d="M116 58C112 50 118 42 124 46C126 54 120 60 116 58Z"
              fill="#243447"
              stroke="#12161f"
              strokeWidth="2.2"
            />
          </g>
        </svg>
      )

    default:
      return null
  }
}
