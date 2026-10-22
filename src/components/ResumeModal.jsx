import { useEffect } from 'react'
import Icon from './Icon'
import './ResumeModal.css'

export default function ResumeModal({ isOpen, onClose }) {
  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handlePrint = () => {
    // Open the PDF in a new window or trigger print
    const printWindow = window.open('/resume.pdf', '_blank')
    if (printWindow) {
      printWindow.focus()
    } else {
      window.print()
    }
  }

  return (
    <div
      className="resume-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="resume-modal-card">
        {/* Close button ✕ */}
        <button
          type="button"
          className="resume-modal-close"
          onClick={onClose}
          aria-label="Close résumé preview"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Modal Header ── */}
        <div className="resume-header">
          <div className="resume-doc-badge" aria-hidden="true">
            {/* Document icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>

          <div className="resume-header-text">
            <h2 id="resume-title" className="resume-name-title">
              <span>RA Manikanta Bathula</span>
              {/* Orange radiating sparks */}
              <svg className="resume-title-rays" viewBox="0 0 20 16" fill="none" stroke="currentColor">
                <path d="M2 14L12 10" strokeLinecap="round" />
                <path d="M2 8L16 8" strokeLinecap="round" />
                <path d="M2 2L12 6" strokeLinecap="round" />
              </svg>
            </h2>
            {/* Underline Squiggle */}
            <svg className="resume-header-underline" viewBox="0 0 140 6" fill="none" stroke="currentColor">
              <path d="M1 4.5C25 1.5 55 5.5 85 3C105 1.5 125 4 139 3" stroke="#f26a1f" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="resume-subtitle">
              Software Engineer · Full-Stack Developer · Cybersecurity Analyst (2026)
            </span>
          </div>
        </div>

        {/* ── Modal Grid (Two Columns) ── */}
        <div className="resume-grid">
          {/* Left Column: Comic Paper Resume Sheet */}
          <div className="resume-sheet">
            {/* Orange Paperclip Graphic */}
            <svg className="resume-clip" viewBox="0 0 28 38" fill="none" stroke="currentColor">
              <rect x="2" y="2" width="22" height="14" rx="3" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
              <path d="M6 16V30C6 33.3 8.7 36 12 36C15.3 36 18 33.3 18 30V10" stroke="#f26a1f" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            {/* Corner Orange Sparks */}
            <svg className="resume-sheet-spark resume-sheet-spark--tl" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <line x1="8" y1="1" x2="8" y2="6" strokeLinecap="round" />
              <line x1="14" y1="4" x2="10" y2="8" strokeLinecap="round" />
              <line x1="2" y1="4" x2="6" y2="8" strokeLinecap="round" />
            </svg>
            <svg className="resume-sheet-spark resume-sheet-spark--bl" viewBox="0 0 16 20" fill="none" stroke="currentColor">
              <line x1="14" y1="4" x2="4" y2="8" strokeLinecap="round" />
              <line x1="14" y1="14" x2="4" y2="12" strokeLinecap="round" />
            </svg>

            {/* Folded Paper Corner */}
            <svg className="resume-fold-corner" viewBox="0 0 28 28">
              <polygon points="0,28 28,28 28,0" fill="#bae6fd" />
              <polygon points="0,28 28,0 0,0" fill="#e0f2fe" opacity="0.3" />
            </svg>

            {/* 1. PROFESSIONAL SUMMARY */}
            <div>
              <h3 className="resume-sec-title">
                <span className="resume-badge-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </span>
                <span>PROFESSIONAL SUMMARY</span>
              </h3>
              <p className="resume-summary-text">
                Forward-thinking Software Engineer (B.Tech 2026) specializing in high-reliability full-stack applications with security-first architecture. Proven hands-on experience in building scalable REST services, reactive frontends, and zero-trust cloud infrastructure on AWS and Google Cloud.
              </p>
            </div>

            {/* 2. CORE COMPETENCIES */}
            <div>
              <h3 className="resume-sec-title">
                <span className="resume-badge-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
                <span>CORE COMPETENCIES</span>
              </h3>
              <div className="competencies-grid">
                {/* 1. Frontend */}
                <div className="competency-card">
                  <div className="competency-head">
                    <span className="competency-icon">&lt;/&gt;</span>
                    <span>Frontend &amp; Architecture:</span>
                  </div>
                  <div className="competency-skills">
                    React 18, TypeScript, JavaScript, Tailwind CSS, Responsive UI/UX, Vite
                  </div>
                </div>

                {/* 2. Backend */}
                <div className="competency-card">
                  <div className="competency-head">
                    <svg className="competency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 9.5l10-4.5 10 4.5-10 4.5L2 9.5zm0 5l10 4.5 10-4.5v2.5l-10 4.5-10-4.5v-2.5z" />
                    </svg>
                    <span>Backend &amp; APIs:</span>
                  </div>
                  <div className="competency-skills">
                    Python Flask, Node.js, Express, RESTful APIs, Microservices, PostgreSQL, Redis
                  </div>
                </div>

                {/* 3. DevSecOps */}
                <div className="competency-card">
                  <div className="competency-head">
                    <svg className="competency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 9z" />
                    </svg>
                    <span>DevSecOps &amp; Cloud:</span>
                  </div>
                  <div className="competency-skills">
                    AWS (EC2, S3, IAM), Google Cloud, Docker, Zero Trust, GitHub Actions
                  </div>
                </div>

                {/* 4. Security */}
                <div className="competency-card">
                  <div className="competency-head">
                    <svg className="competency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
                    </svg>
                    <span>Security &amp; Analysis:</span>
                  </div>
                  <div className="competency-skills">
                    Threat Modeling, RBAC, Vulnerability Assessment, Wireshark, Ethical Hacking
                  </div>
                </div>
              </div>
            </div>

            {/* 3. KEY EXPERIENCE & INTERNSHIPS */}
            <div>
              <h3 className="resume-sec-title">
                <span className="resume-badge-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </span>
                <span>KEY EXPERIENCE &amp; INTERNSHIPS</span>
              </h3>
              <div className="resume-exp-list">
                {/* 1. Bluestock */}
                <div className="resume-exp-item">
                  <div className="resume-exp-header">
                    <span className="resume-exp-role">Software Development Engineer Intern</span>
                    <span className="resume-exp-dates">Oct – Nov 2025</span>
                  </div>
                  <div className="resume-exp-company">Bluestock Fintech</div>
                  <p className="resume-exp-desc">
                    Engineered and optimized responsive frontend interfaces for financial dashboards and implemented resilient API integrations for real-time market data handling.
                  </p>
                </div>

                {/* 2. Palo Alto Networks */}
                <div className="resume-exp-item">
                  <div className="resume-exp-header">
                    <span className="resume-exp-role">Cybersecurity Virtual Intern</span>
                    <span className="resume-exp-dates">Jan – Mar 2025</span>
                  </div>
                  <div className="resume-exp-company">Palo Alto Networks</div>
                  <p className="resume-exp-desc">
                    Conducted advanced network threat analysis, zero-trust network policy evaluation, and enterprise security configuration.
                  </p>
                </div>

                {/* 3. RPA & Ethical Hacking */}
                <div className="resume-exp-item">
                  <div className="resume-exp-header">
                    <span className="resume-exp-role">RPA Developer &amp; Ethical Hacking Intern (240 Hours)</span>
                    <span className="resume-exp-dates">2024 – 2025</span>
                  </div>
                  <p className="resume-exp-desc">
                    Automated workflows using UiPath bots and conducted vulnerability scans and endpoint integrity audits.
                  </p>
                </div>

                {/* 4. Datavalley India */}
                <div className="resume-exp-item">
                  <div className="resume-exp-header">
                    <span className="resume-exp-role">Cybersecurity Intern</span>
                    <span className="resume-exp-dates">Jan – Apr 2026</span>
                  </div>
                  <div className="resume-exp-company">Datavalley India Pvt. Ltd. (APSCHE)</div>
                  <p className="resume-exp-desc">
                    Conducted vulnerability assessments on 15+ web endpoints using Burp Suite and Nmap; remediated OWASP Top 10 vulnerabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comic Illustration & Actions */}
          <div className="resume-actions-col">
            {/* Developer Artwork */}
            <div className="resume-illus-wrap">
              <img
                src="/images/resume-dev.png"
                alt="Developer illustration with Build Create Grow"
                className="resume-dev-img"
                width="430"
                height="295"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Download PDF Button */}
            <a
              href="/resume.pdf"
              download="Bathula_Ra_Mani_Kanta_Resume.pdf"
              className="btn-resume-download"
              aria-label="Download resume PDF"
            >
              <span className="btn-resume-center">
                <Icon name="download" size={20} />
                <span>Download PDF</span>
              </span>
              <span>➔</span>
            </a>

            {/* Print Resume Button */}
            <button
              type="button"
              className="btn-resume-print"
              onClick={handlePrint}
              aria-label="Print resume document"
            >
              <span className="btn-resume-center">
                {/* Printer Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Print Resume</span>
              </span>
              <span>➔</span>
            </button>

            {/* Note Pill Card */}
            <div className="resume-note-card">
              {/* Lightbulb Icon */}
              <svg className="resume-note-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
              </svg>
              <div>
                This resume highlights my core skills, experience, and key projects. Feel free to reach out, I'd love to connect!
              </div>
              <svg className="resume-note-squiggle" viewBox="0 0 60 6" fill="none" stroke="currentColor">
                <path d="M1 3C15 1 30 5 45 2C52 1 58 4 59 3" stroke="#f26a1f" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Bottom-right Potted Plant Artwork */}
            <div className="resume-plant-wrap">
              <img
                src="/images/resume-plant.png"
                alt=""
                className="resume-plant-img"
                width="145"
                height="195"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
