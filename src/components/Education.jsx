import { useRef } from 'react'
import { education } from '../data/portfolioData'
import useReveal from '../hooks/useReveal'
import spotlight from '../hooks/useSpotlight'
import useStrokeDraw from '../hooks/useStrokeDraw'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import './Education.css'

const FIELDS = [
  { key: 'degree', label: 'Degree' },
  { key: 'institution', label: 'Institution' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'graduationYear', label: 'Graduation year' },
  { key: 'grade', label: 'Grade' },
]

export default function Education() {
  const { summary, timeline } = education
  const filled = FIELDS.filter((field) => summary[field.key])
  // Only while running `npm run dev`: remind you which details are still empty
  const missing = FIELDS.filter((field) => field.key !== 'grade' && !summary[field.key])

  const [timelineRef, timelineShown] = useReveal()
  const listRef = useRef(null)
  useStrokeDraw(listRef, '.journey-node svg')

  return (
    <section className="section edu" id="education" aria-labelledby="education-title">
      <span className="edu-glow edu-glow--a" aria-hidden="true" />
      <span className="edu-glow edu-glow--b" aria-hidden="true" />
      <div className="container edu-grid">
        <div>
          <SectionHeading id="education-title" title="Education" />
          <Reveal className="card edu-summary" variant="l" i={1}>
            <h3>{summary.headline}</h3>
            <dl className="edu-facts">
              {filled.map((field) => (
                <div key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>{summary[field.key]}</dd>
                </div>
              ))}
            </dl>
            {import.meta.env.DEV && missing.length > 0 ? (
              <p className="edu-todo">
                Dev reminder (hidden on the live site): add {missing.map((field) => field.label.toLowerCase()).join(', ')} in{' '}
                <code>src/data/portfolioData.js</code>.
              </p>
            ) : null}
          </Reveal>
        </div>

        <div>
          <Reveal as="h3" className="journey-title" i={1}>
            Learning journey
          </Reveal>
          <div ref={timelineRef} className={shownClass(timelineShown)}>
            <ol className="journey" ref={listRef}>
              {timeline.map((step, index) => (
                <li className="journey-item" key={step.id} style={{ '--c': step.color, '--i': index }}>
                  <span className="journey-node" aria-hidden="true">
                    <Icon name={step.icon} size={22} />
                  </span>
                  <div className="journey-card card spot" onPointerMove={spotlight}>
                    <p className="journey-year">{step.year}</p>
                    <h4>{step.title}</h4>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

const shownClass = (shown) => `journey-wrap${shown ? ' in' : ''}`
