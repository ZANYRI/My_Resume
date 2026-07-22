import { LanguageProvider } from './lang/LanguageContext'
import { ThemeProvider } from './lang/ThemeContext'
import ParticlesBackground from './components/ParticlesBackground'
import Header from './components/Header'
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
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ParticlesBackground />
        <div className="container">
          <Header />
          <div className="content">
            <div className="left-column">
              <About />
              <Experience />
              <ProjectsSection />
              <ArticlesSection />
            </div>
            <div className="right-column">
              <Education />
              <Skills />
              <SoftSkills />
            </div>
          </div>
        </div>
        <Notification />
      </LanguageProvider>
    </ThemeProvider>
  )
}
