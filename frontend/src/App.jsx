import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { Marquee, Footer } from './components/MarqueeFooter';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Process from './components/Process';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import { useCursor } from './hooks/useCursor';
import { useParticleCanvas } from './hooks/useParticleCanvas';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useCursor();
  useParticleCanvas();
  useScrollReveal();

  return (
    <>
      {/* Custom cursor */}
      <div id="cur" />
      <div id="cur-trail" />

      {/* Particle canvas */}
      <canvas id="bg-canvas" />

      {/* Loader */}
      <Loader onDone={() => setLoaded(true)} />

      {/* Main site */}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}>
        <Navbar />
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Process />
        <Reviews />
        <Contact />
        <Footer />
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0A0A0A',
            color: '#F0EBE0',
            border: '1px solid rgba(200,168,75,0.3)',
            fontFamily: "'Space Grotesk', sans-serif",
          },
        }}
      />
    </>
  );
}
