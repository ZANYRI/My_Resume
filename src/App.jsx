import { useState } from 'react'
import { LanguageProvider } from './lang/LanguageContext'
import { ThemeProvider } from './lang/ThemeContext'
import ParticlesBackground from './components/ParticlesBackground'
import Header from './components/Header'
import SectionFilter from './components/SectionFilter'
import GithubActivity from './components/GithubActivity'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import SoftSkills from './components/SoftSkills'
import ProjectsSection from './components/ProjectsSection'
import ArticlesSection from './components/ArticlesSection'
import Footer from './components/Footer'
import Notification from './components/Notification'

export default function App() {
  const [selectedSections, setSelectedSections] = useState([])

  function toggleSection(id) {
    setSelectedSections((prev) => (
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    ))
  }

  function showAll() {
    setSelectedSections([])
  }

  const isVisible = (id) => selectedSections.length === 0 || selectedSections.includes(id)

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ParticlesBackground />
        <div className="container">
          <Header />
          <SectionFilter selected={selectedSections} onToggle={toggleSection} onShowAll={showAll} />
          <div className="content">
            <div className="left-column">
              {isVisible('github-activity') && <GithubActivity />}
              {isVisible('about') && <About />}
              {isVisible('experience') && <Experience />}
              {isVisible('projects') && <ProjectsSection />}
              {isVisible('articles') && <ArticlesSection />}
            </div>
            <div className="right-column">
              {isVisible('education') && <Education />}
              {isVisible('skills') && <Skills />}
              {isVisible('soft-skills') && <SoftSkills />}
            </div>
          </div>
          <Footer />
        </div>
        <Notification />
      </LanguageProvider>
    </ThemeProvider>
  )
}
