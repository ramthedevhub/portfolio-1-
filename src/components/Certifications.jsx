import { useState } from 'react'
import { certificationFilters, certifications, certificationsBundle } from '../data/portfolioData'
import spotlight from '../hooks/useSpotlight'
import Icon from './Icon'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import './Certifications.css'

const TYPE_LABELS = {
  certification: 'Certification',
  virtual: 'Virtual experience',
  course: 'Course',
}

const searchText = (cert) =>
  [cert.title, cert.issuer, cert.meta, cert.date, ...cert.skills].join(' ').toLowerCase()

// Helper to determine if a credential has Credly or Verify links
const hasCredlyOrVerify = (cert) =>
  cert.links?.some((l) => {
    const text = `${l.label || ''} ${l.href || ''}`.toLowerCase()
    return text.includes('credly') || text.includes('verify')
  })

// Prioritize items having Credly or Verify links first, then verified platform certs
const getPriorityScore = (cert) => {
  if (hasCredlyOrVerify(cert)) return 1
  const hasPlatformCert = cert.links?.some((l) => l.href?.includes('theforage.com'))
  if (hasPlatformCert) return 2
  if (cert.category === 'certification') return 3
  if (cert.category === 'virtual') return 4
  return 5
}

// 6 cards initially (2 rows on standard 3-column layout)
const INITIAL_LIMIT = 6

export default function Certifications() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const term = query.trim().toLowerCase()
  const visible = certifications
    .filter(
      (cert) => (filter === 'all' || cert.category === filter) && (!term || searchText(cert).includes(term)),
    )
    .sort((a, b) => getPriorityScore(a) - getPriorityScore(b))

  const countFor = (id) => (id === 'all' ? certifications.length : certifications.filter((c) => c.category === id).length)
  const displayed = showAll ? visible : visible.slice(0, INITIAL_LIMIT)
  const hasMore = visible.length > INITIAL_LIMIT

  return (
    <section className="section section--alt" id="certifications" aria-labelledby="certifications-title">
      <div className="container">
        <div className="certs-top">
          <Reveal as="figure" variant="l" className="certs-figure">
            <img src="/images/certs-desk.webp" width="505" height="480" alt="" loading="lazy" decoding="async" />
          </Reveal>
          <div>
            <SectionHeading id="certifications-title" title="Certifications & virtual experiences">
              Industry certifications and hands-on programs across cloud engineering, cybersecurity, automation and
              programming. Each card links to its certificate.
            </SectionHeading>

            <Reveal className="certs-tools" i={2}>
              <div className="certs-filters" role="group" aria-label="Filter credentials">
                {certificationFilters.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={filter === item.id ? 'on' : ''}
                    aria-pressed={filter === item.id}
                    onClick={() => {
                      setFilter(item.id)
                      setShowAll(false)
                    }}
                  >
                    {item.label} <span className="certs-count">{countFor(item.id)}</span>
                  </button>
                ))}
              </div>
              <label className="certs-search">
                <span className="sr-only">Search credentials</span>
                <Icon name="search" size={18} />
                <input
                  type="search"
                  placeholder="Search credentials…"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowAll(false)
                  }}
                />
              </label>
            </Reveal>
          </div>
        </div>

        <ul className="cert-grid">
          {displayed.map((cert, index) => {
            const primary = cert.links.find((link) => link.primary)
            const others = cert.links.filter((link) => !link.primary)
            return (
              <Reveal
                as="li"
                className="cert card spot"
                i={index % 3}
                key={cert.id}
                style={{ '--b': cert.color }}
                onPointerMove={spotlight}
              >
                <div className="cert-top">
                  <span className="cert-badge" aria-hidden="true">
                    {cert.badge}
                  </span>
                  <span className="cert-date">{cert.date}</span>
                </div>
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <p className="cert-meta">{cert.meta}</p>
                <ul className="chips chips--small" aria-label="Skills covered">
                  {cert.skills.map((skill) => (
                    <li className="chip" key={skill}>
                      {skill}
                    </li>
                  ))}
                </ul>
                <div className="cert-foot">
                  <span className="cert-type">{TYPE_LABELS[cert.category]}</span>
                  {others.map((link) => (
                    <a className="cert-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <span className="sr-only"> for {cert.title} (opens in a new tab)</span>
                    </a>
                  ))}
                  {primary ? (
                    <a className="cert-view" href={primary.href} target="_blank" rel="noopener noreferrer">
                      {primary.label} <Icon name="arrow-up-right" size={16} />
                      <span className="sr-only"> for {cert.title} (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ul>

        {visible.length === 0 ? (
          <p className="certs-empty">No credentials match “{query}”. Try a different keyword or filter.</p>
        ) : null}

        {hasMore && (
          <Reveal className="certs-more-toggle">
            <button
              type="button"
              className={`certs-toggle-btn${showAll ? ' is-expanded' : ''}`}
              onClick={() => {
                setShowAll((prev) => !prev)
                if (showAll) {
                  document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              aria-expanded={showAll}
            >
              {showAll ? (
                <>
                  <span>Show less (showing top 6)</span>
                  <Icon name="chevron-up" size={18} />
                </>
              ) : (
                <>
                  <span>Show more ({visible.length - INITIAL_LIMIT} more credentials)</span>
                  <Icon name="chevron-down" size={18} />
                </>
              )}
            </button>
          </Reveal>
        )}

        <Reveal as="p" className="certs-more">
          <span aria-live="polite">
            Showing {displayed.length} of {visible.length} credentials
          </span>
          {certificationsBundle.href ? (
            <a className="link-btn" href={certificationsBundle.href} target="_blank" rel="noopener noreferrer">
              {certificationsBundle.label}
              <Icon name="arrow-up-right" size={18} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
