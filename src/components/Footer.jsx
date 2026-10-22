import { useState, useRef, useEffect } from 'react'
import { profile } from '../data/portfolioData'
import Reveal from './Reveal'
import Icon from './Icon'
import './Footer.css'

// Tech stack items shown in column 3
const TECH_STACK = [
  { name: 'React', icon: 'react' },
  { name: 'TypeScript', icon: 'ts' },
  { name: 'Tailwind CSS', icon: 'tailwind' },
  { name: 'Python', icon: 'python' },
  { name: 'Flask', icon: 'flask' },
  { name: 'Docker', icon: 'docker' },
  { name: 'AWS', icon: 'aws' },
  { name: 'PostgreSQL', icon: 'postgres' },
  { name: 'Redis', icon: 'redis' },
  { name: 'Git', icon: 'git' },
]

// Quick links in column 2
const QUICK_LINKS = [
  { label: 'About', href: '#about', icon: 'user' },
  { label: 'Skills', href: '#skills', icon: 'gear' },
  { label: 'Projects', href: '#projects', icon: 'folder' },
  { label: 'Experience', href: '#experience', icon: 'briefcase' },
  { label: 'Certifications', href: '#certifications', icon: 'bookmark' },
  { label: 'Contact', href: '#contact', icon: 'mail-outline' },
]

// Pre-populated initial terminal log matching the user's design
const INITIAL_LOG = [
  {
    cmd: 'whoami',
    output: 'RA Manikanta Bathula - Full-Stack Developer & Cybersecurity Analyst',
  },
  {
    cmd: 'cat skills.txt',
    output: 'Security-focused development, Cloud architecture, DevSecOps',
  },
]

// Quick clickable suggestion chips in terminal
const SUGGESTED_COMMANDS = ['whoami', 'cat skills.txt', 'ls', 'projects', 'status', 'help', 'clear']

export default function Footer({ onToggleTheme }) {
  const [history, setHistory] = useState(INITIAL_LOG)
  const [inputVal, setInputVal] = useState('')
  const [cmdHistory, setCmdHistory] = useState(['whoami', 'cat skills.txt'])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalBodyRef = useRef(null)
  const isMountedRef = useRef(false)
  const inputRef = useRef(null)

  // Scroll to bottom of terminal ONLY when user runs a command, never on initial mount or page refresh
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [history])

  // Execute terminal command
  const executeCommand = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setCmdHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    const parts = trimmed.split(' ')
    const cmd = parts[0].toLowerCase()
    const arg = parts.slice(1).join(' ').trim().toLowerCase()

    let output = ''
    let isAccent = false
    let isSuccess = false

    switch (cmd) {
      case 'help':
        output = `Available commands:
  • whoami           - Print developer bio and role
  • cat <filename>   - Display file contents (e.g. cat skills.txt, cat about.md)
  • ls               - List available files in virtual workspace
  • skills           - Overview of technical skills & security tools
  • projects         - Summary of featured full-stack projects
  • certifications   - List verified cloud & security credentials
  • status           - Current availability & hiring status
  • contact          - View direct contact channels
  • theme            - Toggle between light & dark room theme
  • clear            - Clear the terminal screen
  • date             - Display current system time
  • sudo             - Elevate privileges (requires admin)`
        break

      case 'whoami':
        output = 'RA Manikanta Bathula - Full-Stack Developer & Cybersecurity Analyst'
        isAccent = true
        break

      case 'ls':
        output = `about.md         skills.txt        projects.json
certifications.txt  experience.txt    contact.sh    resume.pdf`
        break

      case 'cat':
        if (!arg) {
          output = 'usage: cat <filename>\nTry: cat skills.txt, cat about.md, cat contact.sh, cat projects.json'
        } else if (arg === 'skills.txt' || arg === 'skills') {
          output = `Security-focused development, Cloud architecture, DevSecOps

Languages: JavaScript (ES6+), TypeScript, Python, SQL, Bash
Frontend:  React, HTML5, CSS3, Tailwind CSS
Backend:   Node.js, Express.js, REST APIs, WebSockets, JWT, RBAC
Database:  PostgreSQL, Redis, SQLite, Prisma ORM
Cloud/Sec: AWS, Google Cloud, Docker, OWASP Top 10, Burp Suite, Nmap, Wireshark`
        } else if (arg === 'about.md' || arg === 'about') {
          output = `Cyber Security graduate and aspiring Backend / Full-Stack Developer (Node.js & React).
Passionate about engineering reliable, scalable applications with security built-in from the ground up.`
        } else if (arg === 'contact.sh' || arg === 'contact') {
          output = `#!/usr/bin/env bash
echo "Email:    ram.thedevhub@gmail.com"
echo "Phone:    +91 6303589140"
echo "GitHub:   https://github.com/Ramcodeverse"
echo "LinkedIn: In-progress / Open to connect"
echo "Status:   Open to full-time remote/hybrid roles"`
        } else if (arg === 'projects.json' || arg === 'projects') {
          output = `[
  { "name": "BlinkTalks", "tech": ["React", "TypeScript", "Node.js", "WebSockets", "Prisma"] },
  { "name": "MindMate", "tech": ["React", "Express", "Gemini AI", "JWT", "Tailwind"] },
  { "name": "Nexus TaskFlow", "tech": ["React", "TypeScript", "Firebase", "Automation"] }
]`
        } else if (arg === 'certifications.txt' || arg === 'certifications') {
          output = `1. Google Cloud Certified Associate Cloud Engineer (Credly verified)
2. HackerRank Java (Basic) Certificate (Verified: hackerrank.com/certificates/3cc9033cd4f9)
3. AWS Academy Graduate – Cloud Architecting (Credly verified)
4. Google Cloud Engineering Certificate (Credly verified)
5. Coursera Java Programming (Board Infinity - Verified)
6. UiPath Automation Developer Associate Training`
        } else if (arg === 'experience.txt') {
          output = `Internships & Traineeships:
• Datavalley India - Cybersecurity Intern (OWASP Top 10, Vulnerability Assessments)
• Palo Alto Networks - Cybersecurity Virtual Intern
• UiPath - RPA Automation Developer
• Bluestock - Software Development Engineer Intern
• TCS & Mastercard Forage Programs`
        } else if (arg === 'resume.pdf') {
          output = `[PDF Document: Ra-Mani-Kanta-Bathula-Resume.pdf]
Location: /public/resume.pdf. Click the resume button in the hero or navbar to view.`
        } else {
          output = `cat: ${arg}: No such file or directory. Try 'ls' to list files.`
        }
        break

      case 'skills':
        output = `Security-focused development, Cloud architecture, DevSecOps
Languages: JavaScript, TypeScript, Python, SQL, Bash
Frontend: React, Tailwind CSS | Backend: Node.js, Express, REST, WebSockets
Databases: PostgreSQL, Redis, SQLite | Cloud: AWS, GCP, Docker`
        break

      case 'projects':
        output = `Featured Projects:
1. BlinkTalks      - Real-time team messaging & Kanban with WebSockets
2. MindMate        - AI wellness platform with secure Gemini API proxy
3. Nexus TaskFlow  - SaaS-grade collaborative task automation`
        break

      case 'certifications':
        output = `Top Verified Certifications:
✔ Google Cloud Certified Associate Cloud Engineer (Credly)
✔ HackerRank Java (Basic) Certificate (Verified)
✔ AWS Academy Graduate – Cloud Architecting (Credly)
✔ Coursera Fundamentals of Java Programming (Verified)
✔ Google Cloud Engineering Certificate (Credly)`
        isSuccess = true
        break

      case 'status':
        output = '🟢 Status: Available for full-time Software Engineer, Full-Stack Developer & Cybersecurity Analyst roles (Class of 2026)'
        isSuccess = true
        break

      case 'contact':
        output = 'Email: ram.thedevhub@gmail.com | Phone: +91 6303589140 | GitHub: https://github.com/Ramcodeverse'
        break

      case 'theme':
        if (onToggleTheme) {
          onToggleTheme()
          output = 'Toggled portfolio color theme!'
          isSuccess = true
        } else {
          output = 'Theme toggle not available.'
        }
        break

      case 'date':
        output = new Date().toString()
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      case 'sudo':
        output = 'Guest user is not in the sudoers file. This incident will be reported to Ra Mani Kanta 🔒'
        break

      case 'repo':
      case 'github':
        output = 'GitHub: https://github.com/Ramcodeverse'
        break

      case 'pwd':
        output = '/home/ram/portfolio'
        break

      default:
        output = `zsh: command not found: ${cmd}. Type 'help' to see available commands.`
        break
    }

    setHistory((prev) => [...prev, { cmd: trimmed, output, isAccent, isSuccess }])
    setInputVal('')
  }

  // Key handler for Enter, ArrowUp, ArrowDown, Tab
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInputVal(cmdHistory[nextIndex] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1)
        setInputVal('')
      } else {
        setHistoryIndex(nextIndex)
        setInputVal(cmdHistory[nextIndex] || '')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const trimmed = inputVal.trim()
      const candidates = SUGGESTED_COMMANDS.filter((c) => c.startsWith(trimmed))
      if (candidates.length === 1) {
        setInputVal(candidates[0])
      }
    }
  }

  return (
    <footer className="footer" id="footer">
      <div className="container">
        {/* ── Top Area: 3 Columns (Brand, Quick Links, Tech Stack) ── */}
        <div className="footer-top-grid">
          {/* Column 1: Illustration & Bio */}
          <Reveal as="div" className="footer-brand-col" i={1}>
            <div className="footer-illustration-wrap">
              <img
                src="/images/footer-dev.png"
                alt="Developer illustration with laptop, coffee, plant and hanging lamp"
                className="footer-dev-img"
                width="470"
                height="340"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3 className="footer-brand-name">
              <span className="footer-brand-accent">RA</span> Manikanta Bathula
            </h3>
            <p className="footer-bio">
              Software Engineer passionate about building secure, scalable applications and protecting digital
              infrastructure through innovative cybersecurity solutions.
            </p>
            <div className="footer-social-row">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="GitHub profile"
              >
                <Icon name="github" size={20} />
              </a>
              {profile.linkedin ? (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="LinkedIn profile"
                >
                  <Icon name="linkedin" size={20} />
                </a>
              ) : (
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="LinkedIn profile"
                >
                  <Icon name="linkedin" size={20} />
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="footer-social-btn" aria-label="Send email">
                <Icon name="mail" size={20} />
              </a>
            </div>
          </Reveal>

          {/* Column 2: Quick Links */}
          <Reveal as="div" className="footer-links-col" i={2}>
            <h4 className="footer-heading">
              <span>Quick Links</span>
              <svg className="footer-spark-rays" viewBox="0 0 20 16" fill="none" stroke="currentColor">
                <path d="M4 14L16 10" strokeLinecap="round" />
                <path d="M2 8L18 8" strokeLinecap="round" />
                <path d="M4 2L16 6" strokeLinecap="round" />
              </svg>
            </h4>
            <ul className="footer-nav-list">
              {QUICK_LINKS.map((link) => (
                <li key={link.label} className="footer-nav-item">
                  <a href={link.href}>
                    <span className="footer-link-icon">
                      <FooterNavIcon name={link.icon} />
                    </span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Column 3: Tech Stack */}
          <Reveal as="div" className="footer-tech-col" i={3}>
            <h4 className="footer-heading">
              <span className="terminal-prompt-symbol">&gt;_</span>
              <span>Tech Stack</span>
              <svg className="footer-spark-rays" viewBox="0 0 20 16" fill="none" stroke="currentColor">
                <path d="M4 14L16 10" strokeLinecap="round" />
                <path d="M2 8L18 8" strokeLinecap="round" />
                <path d="M4 2L16 6" strokeLinecap="round" />
              </svg>
            </h4>
            <div className="footer-tech-pills">
              {TECH_STACK.map((tech) => (
                <div key={tech.name} className="footer-tech-pill">
                  <span className="footer-tech-icon">
                    <TechIcon name={tech.icon} />
                  </span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Middle Area: Copyright & Pulse Status Bar ── */}
        <Reveal as="div" className="footer-status-bar" i={2}>
          <p className="footer-copyright">
            © 2026 RA Manikanta Bathula. Made with <span className="footer-heart">🧡</span> and{' '}
            <span className="footer-code-tag">&lt;/ &gt;</span>
          </p>
          <div className="footer-status-indicator">
            <span className="footer-status-dot" aria-hidden="true" />
            <span>Status: Available for opportunities</span>
          </div>
        </Reveal>

        {/* ── Bottom Area: Workable Real Terminal ── */}
        <Reveal as="div" className="footer-terminal-wrap" i={3}>
          {/* Top-Right Decorative Sparks */}
          <svg className="footer-terminal-sparks" viewBox="0 0 32 28" fill="none" stroke="currentColor">
            <line x1="16" y1="2" x2="26" y2="12" strokeLinecap="round" />
            <line x1="28" y1="18" x2="16" y2="24" strokeLinecap="round" />
          </svg>

          <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
            {/* Terminal Window Header with Mac Controls */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot terminal-dot--red" />
                <span className="terminal-dot terminal-dot--yellow" />
                <span className="terminal-dot terminal-dot--green" />
              </div>
              <span className="terminal-title">terminal</span>
              {/* Quick clickable command chips */}
              <div className="terminal-quick-chips">
                {SUGGESTED_COMMANDS.slice(0, 5).map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    className="terminal-chip"
                    onClick={(e) => {
                      e.stopPropagation()
                      executeCommand(cmd)
                    }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Body */}
            <div className="terminal-body" ref={terminalBodyRef}>
              <div className="terminal-history">
                {history.map((item, idx) => (
                  <div key={idx} className="terminal-entry">
                    <div className="terminal-prompt-line">
                      <span className="terminal-prompt-symbol">$</span>
                      <span className="terminal-command-text">{item.cmd}</span>
                    </div>
                    {item.output && (
                      <div
                        className={`terminal-output${item.isAccent ? ' accent' : ''}${item.isSuccess ? ' success' : ''}`}
                      >
                        {item.output}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Active Prompt Input */}
              <div className="terminal-input-line">
                <span className="terminal-prompt-symbol">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type a command (try 'help' or 'cat skills.txt')..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <span className="terminal-cursor" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}

/** Crisp inline SVG icons for Quick Links */
function FooterNavIcon({ name }) {
  switch (name) {
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    case 'folder':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      )
    case 'bookmark':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'mail-outline':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polyline points="3 7 12 13 21 7" />
        </svg>
      )
    default:
      return null
  }
}

/** Official SVG logos for Tech Stack pills */
function TechIcon({ name }) {
  switch (name) {
    case 'react':
      return (
        <svg viewBox="0 0 115.3 100" fill="#00d8ff">
          <ellipse cx="57.6" cy="50" rx="14.3" ry="14.3" />
          <ellipse cx="57.6" cy="50" rx="55" ry="21" fill="none" stroke="#00d8ff" strokeWidth="8" />
          <ellipse
            cx="57.6"
            cy="50"
            rx="55"
            ry="21"
            fill="none"
            stroke="#00d8ff"
            strokeWidth="8"
            transform="rotate(60 57.6 50)"
          />
          <ellipse
            cx="57.6"
            cy="50"
            rx="55"
            ry="21"
            fill="none"
            stroke="#00d8ff"
            strokeWidth="8"
            transform="rotate(120 57.6 50)"
          />
        </svg>
      )
    case 'ts':
      return (
        <svg viewBox="0 0 24 24" fill="#3178c6">
          <rect width="24" height="24" rx="4" />
          <path d="M5 8h6M8 8v9M13 14c1 1 2 1.5 3.5 1.5s2-.7 2-1.6c0-2-3.5-1.5-3.5-3.8 0-1.4 1.2-2.3 2.9-2.3 1.2 0 2.2.4 2.8 1l-.8 1.4c-.6-.5-1.2-.8-2-.8s-1.4.5-1.4 1.2c0 1.9 3.5 1.4 3.5 3.8 0 1.6-1.3 2.5-3.2 2.5-1.5 0-2.8-.5-3.6-1.4l.8-1.5z" fill="#ffffff" />
        </svg>
      )
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" fill="#38bdf8">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
        </svg>
      )
    case 'python':
      return (
        <svg viewBox="0 0 24 24">
          <path
            d="M11.9 2c-3.8 0-3.6 1.6-3.6 1.6l.01 1.7h3.7v.5H4.8S2 5.5 2 9.4c0 3.8 2.4 3.7 2.4 3.7h1.4v-2s-.1-2.4 2.4-2.4h3.7s2.3.04 2.3-2.3V4.3S14.6 2 11.9 2zm-1.1 1.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z"
            fill="#3776ab"
          />
          <path
            d="M12.1 22c3.8 0 3.6-1.6 3.6-1.6l-.01-1.7h-3.7v-.5h7.2s2.8.3 2.8-3.6c0-3.8-2.4-3.7-2.4-3.7h-1.4v2s.1 2.4-2.4 2.4H12s-2.3-.04-2.3 2.3v2.5s-.4 2.3 2.4 2.3zm1.1-1.2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"
            fill="#ffd43b"
          />
        </svg>
      )
    case 'flask':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 2v5.5L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 7.5V2" />
          <line x1="8.5" y1="2" x2="15.5" y2="2" />
          <path d="M6.8 15h10.4" strokeWidth="1.5" />
        </svg>
      )
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" fill="#0db7ed">
          <path d="M13 5.5h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm6 3h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm9 0h2v2h-2zm3.3 2.8c-.3-.2-1.3-.3-2.3.2 0 0-.2-.7-.9-1.2-.5-.4-1.2-.5-1.2-.5s0 0 0 0H2.5c-.3 1.2 0 3.6 1.4 5.3 1.4 1.7 3.5 2.1 6.8 2.1 5.3 0 9-2.7 10.3-6.6.7 0 1.6-.2 2.2-.8.2-.2.3-.5.3-.5s-.4-.2-.8-.2l.2.2z" />
        </svg>
      )
    case 'aws':
      return (
        <svg viewBox="0 0 24 24" fill="#ff9900">
          <path d="M18.8 13.5a10.8 10.8 0 0 1-13.6 1.5.5.5 0 0 1 .1-.8 11.8 11.8 0 0 0 13 .3c.5-.3.8-.1.5.4v-.1l-.1-.3h.1zm.9-1.2c-.3-.4-1.8-.2-2.5-.1-.2 0-.3-.2-.1-.3 1.2-.8 3.1-.6 3.4-.2.3.4-.1 2.3-1.2 3.2-.2.1-.3.1-.3-.1.2-.8.7-2.1.7-2.5zm-8.2-1.8a2.5 2.5 0 0 1-2.2-1.2c-.2-.4 0-.8.4-.9l1.1-.3c.3-.1.6.1.8.4.3.4.6.6 1.1.6.7 0 1.2-.4 1.2-1.2V9A2.8 2.8 0 0 1 11 9.8c-1.8 0-3.1-1.1-3.1-2.7 0-1.7 1.4-2.8 3.3-2.8 1.3 0 2.2.5 2.7 1.2V4.5c0-.3.2-.5.5-.5h1.2c.3 0 .5.2.5.5V9c0 2.2-1.6 3.2-3.6 3.2v.3h-1zm.3-3.2c.8 0 1.5-.5 1.5-1.5s-.6-1.5-1.5-1.5-1.5.5-1.5 1.5.7 1.5 1.5 1.5z" />
        </svg>
      )
    case 'postgres':
      return (
        <svg viewBox="0 0 24 24" fill="#336791">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.4 9.3.2-.3.4-.8.5-1.3-.8-.3-1.6-.7-2.2-1.3-.2-.2-.2-.6 0-.8.2-.2.6-.2.8 0 .5.5 1.2.9 2 1.1.2-.6.4-1.2.7-1.8-1.5-.7-2.5-2.2-2.5-4 0-1.6.9-3 2.2-3.8-.4-.9-.6-2-.6-3.2 0-3.3 2.7-5.9 6-5.9 3.3 0 6 2.6 6 5.9 0 1.2-.2 2.3-.6 3.2 1.3.8 2.2 2.2 2.2 3.8 0 1.8-1 3.3-2.5 4 .3.6.5 1.2.7 1.8.8-.2 1.5-.6 2-1.1.2-.2.6-.2.8 0 .2.2.2.6 0 .8-.6.6-1.4 1-2.2 1.3.1.5.3 1 .5 1.3 3.8-1.5 6.4-5.1 6.4-9.3 0-5.5-4.5-10-10-10z" />
        </svg>
      )
    case 'redis':
      return (
        <svg viewBox="0 0 24 24" fill="#dc382d">
          <path d="M2 9.5l10-4.5 10 4.5-10 4.5L2 9.5zm0 5l10 4.5 10-4.5v2.5l-10 4.5-10-4.5v-2.5z" />
        </svg>
      )
    case 'git':
      return (
        <svg viewBox="0 0 24 24" fill="#f05032">
          <path d="M21.7 10.7L13.3 2.3c-.4-.4-1.1-.4-1.5 0L9.4 4.7l2.8 2.8c.4-.1.9 0 1.2.3.4.4.5 1 .3 1.5l2.7 2.7c.5-.2 1.1-.1 1.5.3.6.6.6 1.5 0 2.1s-1.5.6-2.1 0c-.4-.4-.5-1-.3-1.5L12.8 10v4.8c.2.2.4.4.4.7 0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.6.4-1.2 1-1.4v-4.9c-.6-.2-1-.8-1-1.4 0-.3.1-.6.3-.8L7.7 4.2 2.3 9.6c-.4.4-.4 1.1 0 1.5l8.4 8.4c.4.4 1.1.4 1.5 0l9.5-9.5c.4-.4.4-1.1 0-1.5v2.2z" />
        </svg>
      )
    default:
      return null
  }
}
