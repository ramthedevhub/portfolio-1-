import { useRef } from 'react'
import { about, certifications } from '../data/portfolioData'
import useCharacter from '../hooks/useCharacter'
import useCountUp from '../hooks/useCountUp'
import useReveal from '../hooks/useReveal'
import SectionHeading from './SectionHeading'
import './About.css'

// "18+" -> counts up to 18 and keeps the "+"
function Stat({ label, value, active, index }) {
  const match = /^(\d+)(.*)$/.exec(String(value))
  const target = match ? Number(match[1]) : 0
  const shown = useCountUp(target, active && Boolean(match))
  return (
    <div className="stat card rv pop" style={{ '--i': index + 6 }}>
      <dt>{label}</dt>
      <dd>
        {match ? shown : value}
        {match ? match[2] : ''}
      </dd>
    </div>
  )
}

export default function About() {
  const [sectionRef, shown] = useReveal()
  const figureRef = useRef(null)
  const canvasRef = useRef(null)
  useCharacter(figureRef, canvasRef)

  const stats = [
    { label: 'Projects completed', value: about.projectsCompleted },
    { label: 'Credentials earned', value: String(certifications.length) },
  ].filter((stat) => stat.value)

  return (
    <section
      className={`section about${shown ? ' in' : ''}`}
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <figure className="about-figure" ref={figureRef}>
          <img
            src="/images/about-idle.webp"
            width="400"
            height="368"
            alt="Illustration of a developer sipping tea by a window, next to a stack of books"
            loading="lazy"
            decoding="async"
          />
          <canvas ref={canvasRef} width="400" height="368" aria-hidden="true" />
        </figure>

        <div className="about-content">
          <SectionHeading id="about-title" title="About me" />
          {about.paragraphs.map((text, i) => (
            <p className="about-text rv" style={{ '--i': i + 1 }} key={text}>
              {text}
            </p>
          ))}

          <h3 className="mini-title rv" style={{ '--i': 3 }}>
            Career interests
          </h3>
          <ul className="chips">
            {about.interests.map((interest, i) => (
              <li className="chip rv pop" style={{ '--i': i + 4 }} key={interest}>
                {interest}
              </li>
            ))}
          </ul>

          <dl className="stats">
            {stats.map((stat, i) => (
              <Stat key={stat.label} index={i} active={shown} {...stat} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
