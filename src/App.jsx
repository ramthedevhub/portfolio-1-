import useTheme from './hooks/useTheme'
import useScrollMotion from './hooks/useScrollMotion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Process from './components/Process'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme()
  useScrollMotion()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1}>
        <Hero theme={theme} setTheme={setTheme} />
        <About />
        <Skills />
        <Process />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer onToggleTheme={toggleTheme} />
    </>
  )
}
