import { useEffect } from 'react'

const PARTICLES_SRC = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'

export default function ParticlesBackground() {
  useEffect(() => {
    function init() {
      if (!window.particlesJS) return
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
          opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: false }, onclick: { enable: false }, resize: true },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      })
    }

    let script = document.querySelector(`script[src="${PARTICLES_SRC}"]`)
    if (window.particlesJS) {
      init()
    } else if (script) {
      script.addEventListener('load', init)
    } else {
      script = document.createElement('script')
      script.src = PARTICLES_SRC
      script.async = true
      script.addEventListener('load', init)
      document.body.appendChild(script)
    }

    return () => {
      script?.removeEventListener('load', init)
    }
  }, [])

  return <div id="particles-js" />
}
