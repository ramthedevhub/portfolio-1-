import { useState, useRef, useEffect } from 'react'
import { profile } from '../data/portfolioData'
import Reveal from './Reveal'
import Icon from './Icon'
import './Contact.css'

// Subject options as specified
const SUBJECT_OPTIONS = [
  'Job Opportunity',
  'Internship Opportunity',
  'Freelance Project',
  'Full-Stack Development',
  'Software Engineering',
  'Cybersecurity / Security',
  'Collaboration',
  'Technical Inquiry',
  'Other',
]

// Dynamic recruiter-friendly pre-filled templates matching section 3
const SUBJECT_TEMPLATES = {
  'Job Opportunity':
    "Hi Ram Manikanta, I came across your portfolio and would like to connect regarding a potential job opportunity. I'd be happy to share more details about the role, team, and next steps.",
  'Internship Opportunity':
    "Hi Ram Manikanta, I came across your portfolio and would like to connect regarding an internship opportunity. I'd be happy to share more details about the role, team, and application process.",
  'Freelance Project':
    "Hi Ram Manikanta, I came across your portfolio and would like to discuss a potential freelance project. I'd be happy to share the project requirements, timeline, and expected scope.",
  'Full-Stack Development':
    "Hi Ram Manikanta, I came across your portfolio and would like to discuss a full-stack development opportunity. I'd be happy to share more details about the project, requirements, and next steps.",
  'Software Engineering':
    "Hi Ram Manikanta, I came across your portfolio and would like to connect regarding a Software Engineering opportunity. I'd be happy to share more details about the role, team, and next steps.",
  'Cybersecurity / Security':
    "Hi Ram Manikanta, I came across your portfolio and would like to connect regarding a cybersecurity opportunity. I'd be happy to share more details about the role, security work, and next steps.",
  'Collaboration':
    "Hi Ram Manikanta, I came across your portfolio and would like to discuss a potential collaboration. I'd be happy to share more about the idea, requirements, and how we could work together.",
  'Technical Inquiry':
    "Hi Ram Manikanta, I came across your portfolio and have a technical question I'd like to discuss with you. I'd be happy to provide more context and details.",
  'Other':
    "Hi Ram Manikanta, I came across your portfolio and would like to connect with you regarding an opportunity or inquiry. I'd be happy to share more details.",
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0])
  const [message, setMessage] = useState(SUBJECT_TEMPLATES[SUBJECT_OPTIONS[0]])
  const [isMessageEdited, setIsMessageEdited] = useState(false)
  const [botField, setBotField] = useState('') // Honeypot
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const timerRef = useRef(0)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // When subject changes, update message if user hasn't manually customized it
  const handleSubjectChange = (e) => {
    const nextSub = e.target.value
    setSubject(nextSub)
    if (!isMessageEdited) {
      setMessage(SUBJECT_TEMPLATES[nextSub] || SUBJECT_TEMPLATES['Job Opportunity'])
    }
  }

  // Handle message manual edits
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    setIsMessageEdited(true)
    if (errors.message) setErrors((prev) => ({ ...prev, message: '' }))
  }

  // Restore the suggested template for current subject
  const handleResetTemplate = () => {
    setMessage(SUBJECT_TEMPLATES[subject] || SUBJECT_TEMPLATES['Job Opportunity'])
    setIsMessageEdited(false)
    if (errors.message) setErrors((prev) => ({ ...prev, message: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Honeypot check for bots
    if (botField) return

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMsg = message.trim()

    const newErrors = {}
    if (!trimmedName) {
      newErrors.name = 'Please enter your name or company name.'
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!trimmedMsg) {
      newErrors.message = 'Please add a short message so I know how I can help.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setStatus('')
      return
    }

    // Construct native mailto link
    const mailSubject = `${subject} — ${trimmedName}`
    const mailBody = `Hello Ram,

${trimmedMsg}

---
Contact: ${trimmedName}
Email: ${trimmedEmail}`

    const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

    setSending(true)
    setStatus('Your email draft is ready! Opening your email client…')

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      window.location.href = mailtoHref
      setSending(false)
    }, 450)
  }

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-grid">
          {/* ══════════════════════════════════════════════════════
              LEFT CARD: Contact Channels & Developer at Desk
             ══════════════════════════════════════════════════════ */}
          <Reveal as="div" className="contact-comic-card" variant="l">
            {/* Top-Right Decorative Origami Plane Doodle */}
            <svg
              className="card-plane-doodle"
              viewBox="0 0 76 60"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              {/* Dashed Loop Trail */}
              <path
                d="M4 48C18 56 32 50 34 38C36 24 24 20 18 30C12 40 26 46 42 34"
                strokeDasharray="4 3"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Folded Paper Airplane */}
              <g transform="translate(32, 2) scale(0.65)">
                <polygon points="58,6 6,36 30,42" fill="#fbbf24" stroke="#d97706" strokeWidth="2.8" />
                <polygon points="58,6 30,42 42,56" fill="#f59e0b" stroke="#d97706" strokeWidth="2.8" />
                <polygon points="58,6 30,42 22,50" fill="#fef3c7" stroke="#d97706" strokeWidth="2.4" />
              </g>
            </svg>

            {/* Header */}
            <div className="card-header-wrap">
              <div className="contact-eyebrow">
                {/* Left 3 rays */}
                <svg className="contact-rays" viewBox="0 0 20 16" fill="none" stroke="currentColor">
                  <path d="M18 14L8 10" strokeLinecap="round" />
                  <path d="M18 8L4 8" strokeLinecap="round" />
                  <path d="M18 2L8 6" strokeLinecap="round" />
                </svg>
                <span>LET'S CONNECT</span>
                {/* Right 3 rays */}
                <svg className="contact-rays" viewBox="0 0 20 16" fill="none" stroke="currentColor">
                  <path d="M2 14L12 10" strokeLinecap="round" />
                  <path d="M2 8L16 8" strokeLinecap="round" />
                  <path d="M2 2L12 6" strokeLinecap="round" />
                </svg>
              </div>

              <h2 id="contact-heading" className="card-main-title">
                Contact Channels.
              </h2>
              <p className="card-desc">
                Feel free to reach out for opportunities, collaborations, security audits, or full-stack projects.
              </p>
            </div>

            {/* Split Middle: Channel Links on Left, Desk Character on Right */}
            <div className="channels-split-body">
              <ul className="channels-list">
                {/* Email */}
                <li>
                  <a href={`mailto:${profile.email}`} className="channel-pill" aria-label="Send direct email">
                    <span className="channel-icon-badge badge--email">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <polyline points="3 7 12 13 21 7" />
                      </svg>
                    </span>
                    <span className="channel-content">
                      <span className="channel-label">EMAIL</span>
                      <span className="channel-val">{profile.email}</span>
                    </span>
                  </a>
                </li>

                {/* Phone */}
                <li>
                  <a href={profile.phoneHref} className="channel-pill" aria-label="Call direct phone">
                    <span className="channel-icon-badge badge--phone">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                      </svg>
                    </span>
                    <span className="channel-content">
                      <span className="channel-label">PHONE</span>
                      <span className="channel-val">{profile.phone}</span>
                    </span>
                  </a>
                </li>

                {/* Location */}
                <li>
                  <div className="channel-pill" role="region" aria-label="Location and work model">
                    <span className="channel-icon-badge badge--location">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    </span>
                    <span className="channel-content">
                      <span className="channel-label">LOCATION</span>
                      <span className="channel-val">{profile.location}</span>
                    </span>
                  </div>
                </li>

                {/* GitHub */}
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-pill"
                    aria-label="View GitHub profile (opens in new tab)"
                  >
                    <span className="channel-icon-badge badge--github">
                      <Icon name="github" size={20} />
                    </span>
                    <span className="channel-content">
                      <span className="channel-label">GITHUB</span>
                      <span className="channel-val">{profile.github.replace(/^https?:\/\//, '')}</span>
                    </span>
                  </a>
                </li>
              </ul>

              {/* Developer at Desk Artwork with "Let's Work Together" */}
              <figure className="contact-dev-figure">
                <img
                  src="/images/contact-dev.png"
                  alt="Developer working at desk saying Let's Work Together"
                  className="contact-dev-img"
                  width="445"
                  height="485"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            {/* Availability Card with pulsing green light */}
            <div className="availability-pill-card">
              {/* Left Orange Rays */}
              <svg className="availability-rays availability-rays--left" viewBox="0 0 16 24" fill="none" stroke="currentColor">
                <path d="M14 4L2 8" strokeLinecap="round" />
                <path d="M14 12L2 12" strokeLinecap="round" />
                <path d="M14 20L2 16" strokeLinecap="round" />
              </svg>

              <div className="availability-icon-wrap">
                <span className="availability-pulse-dot" aria-hidden="true" />
                {/* Lightbulb Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                </svg>
              </div>

              <div className="availability-text">
                I'm open to full-time, internship, and freelance opportunities.{' '}
                <strong>Let's build</strong> something great!
              </div>

              {/* Right Orange Rays */}
              <svg className="availability-rays availability-rays--right" viewBox="0 0 16 24" fill="none" stroke="currentColor">
                <path d="M2 4L14 8" strokeLinecap="round" />
                <path d="M2 12L14 12" strokeLinecap="round" />
                <path d="M2 20L14 16" strokeLinecap="round" />
              </svg>
            </div>
          </Reveal>

          {/* ══════════════════════════════════════════════════════
              RIGHT CARD: Send a Direct Message
             ══════════════════════════════════════════════════════ */}
          <Reveal as="div" className="contact-comic-card" variant="r">
            {/* Top-Right Decorative Origami Plane Doodle */}
            <svg
              className="card-plane-doodle"
              viewBox="0 0 76 60"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="M4 48C18 56 32 50 34 38C36 24 24 20 18 30C12 40 26 46 42 34"
                strokeDasharray="4 3"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <g transform="translate(32, 2) scale(0.65)">
                <polygon points="58,6 6,36 30,42" fill="#fbbf24" stroke="#d97706" strokeWidth="2.8" />
                <polygon points="58,6 30,42 42,56" fill="#f59e0b" stroke="#d97706" strokeWidth="2.8" />
                <polygon points="58,6 30,42 22,50" fill="#fef3c7" stroke="#d97706" strokeWidth="2.4" />
              </g>
            </svg>

            {/* Header */}
            <div className="card-header-wrap">
              <h2 className="card-main-title">
                {/* Big Blue Flying Paper Plane Icon */}
                <svg className="direct-msg-plane-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>Send a Direct Message</span>
                {/* Orange rays */}
                <svg className="contact-rays" viewBox="0 0 20 16" fill="none" stroke="currentColor">
                  <path d="M2 14L12 10" strokeLinecap="round" />
                  <path d="M2 8L16 8" strokeLinecap="round" />
                  <path d="M2 2L12 6" strokeLinecap="round" />
                </svg>
              </h2>
              <p className="card-desc">
                Drop me a message and I'll get back to you as soon as possible.
              </p>
              <p className="card-sub-desc">(Usually within 24–48 hours)</p>
            </div>

            {/* Direct Message Form */}
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="website"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                style={{ display: 'none', position: 'absolute', opacity: 0 }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Row 1: Full Name & Your Email */}
              <div className="form-row-2col">
                {/* Full Name */}
                <div className="comic-field">
                  <label htmlFor="contact-name" className="comic-label">
                    Full Name
                  </label>
                  <div className={`input-box-wrap${errors.name ? ' has-error' : ''}`}>
                    <span className="field-leading-icon">
                      {/* User Icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                      </svg>
                    </span>
                    <input
                      id="contact-name"
                      type="text"
                      className="comic-input"
                      placeholder="e.g. Hiring Manager / Jane Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                      }}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <span className="field-helper">(Use your name and company name if you're a recruiter)</span>
                  {errors.name && <span className="field-err-msg">{errors.name}</span>}
                </div>

                {/* Your Email */}
                <div className="comic-field">
                  <label htmlFor="contact-email" className="comic-label">
                    Your Email
                  </label>
                  <div className={`input-box-wrap${errors.email ? ' has-error' : ''}`}>
                    <span className="field-leading-icon">
                      {/* Mail Icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <polyline points="3 7 12 13 21 7" />
                      </svg>
                    </span>
                    <input
                      id="contact-email"
                      type="email"
                      className="comic-input"
                      placeholder="e.g. jane@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                      }}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <span className="field-helper">(Work email is preferred)</span>
                  {errors.email && <span className="field-err-msg">{errors.email}</span>}
                </div>
              </div>

              {/* Row 2: Subject Dropdown */}
              <div className="comic-field">
                <label htmlFor="contact-subject" className="comic-label">
                  Subject
                </label>
                <div className="input-box-wrap">
                  <span className="field-leading-icon">
                    {/* Briefcase Icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </span>
                  <select
                    id="contact-subject"
                    className="comic-select"
                    value={subject}
                    onChange={handleSubjectChange}
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {/* Chevron down arrow */}
                  <span className="comic-select-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div className="comic-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="contact-message" className="comic-label">
                    Message
                  </label>
                  {isMessageEdited && (
                    <button
                      type="button"
                      className="template-reset-btn"
                      onClick={handleResetTemplate}
                      title="Reset message to the recruiter-friendly suggestion for the current subject"
                    >
                      Use suggested template
                    </button>
                  )}
                </div>
                <div className={`input-box-wrap textarea-box-wrap${errors.message ? ' has-error' : ''}`}>
                  <span className="field-leading-icon">
                    {/* Chat Bubble Icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <textarea
                    id="contact-message"
                    rows="4"
                    className="comic-textarea"
                    value={message}
                    onChange={handleMessageChange}
                    required
                  />
                </div>
                {errors.message && <span className="field-err-msg">{errors.message}</span>}
              </div>

              {/* Status Banner */}
              {status && (
                <div className="form-toast-status ready" role="status">
                  {status}
                </div>
              )}

              {/* Submit Button */}
              <div className="send-btn-wrap">
                {/* Left Blue Rays */}
                <svg className="send-btn-rays send-btn-rays--left" viewBox="0 0 16 24" fill="none" stroke="currentColor">
                  <path d="M14 4L2 8" strokeLinecap="round" />
                  <path d="M14 12L2 12" strokeLinecap="round" />
                  <path d="M14 20L2 16" strokeLinecap="round" />
                </svg>

                <button
                  type="submit"
                  className="comic-send-btn"
                  disabled={sending}
                  aria-label="Send direct message via email client"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  <span>Send Message</span>
                </button>

                {/* Right Blue Rays */}
                <svg className="send-btn-rays send-btn-rays--right" viewBox="0 0 16 24" fill="none" stroke="currentColor">
                  <path d="M2 4L14 8" strokeLinecap="round" />
                  <path d="M2 12L14 12" strokeLinecap="round" />
                  <path d="M2 20L14 16" strokeLinecap="round" />
                </svg>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
