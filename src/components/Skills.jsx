import { useRef } from 'react'
import { skillCategories } from '../data/portfolioData'
import useStrokeDraw from '../hooks/useStrokeDraw'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import './Skills.css'

export default function Skills() {
  const listRef = useRef(null)
  useStrokeDraw(listRef, '.skill-icon svg')

  return (
    <section className="section section--alt" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading id="skills-title" title="Skills">
          The languages, frameworks and security tools I use to build and test applications.
        </SectionHeading>

        <ul className="skill-list" ref={listRef}>
          {skillCategories.map((category, index) => (
            <Reveal as="li" className="skill-row" i={index} key={category.id}>
              <h3 className="skill-title">
                <span className="skill-icon">
                  <Icon name={category.icon} size={22} />
                </span>
                {category.title}
              </h3>
              <ul className="chips" aria-label={`${category.title}: skills`}>
                {category.items.map((item, k) => (
                  <li className="chip" style={{ '--k': k }} key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
