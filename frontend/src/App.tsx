/**
 * App.tsx — Root Application Component
 *
 * Composes all portfolio sections in order:
 *   Hero → Chatbot → Skills → Experience → Certifications → ContactForm → ThisSite
 *
 * Section order matches a typical portfolio reading flow:
 *   1. Who you are (Hero)
 *   2. AI Resume Assistant (Chatbot - inline, always visible)
 *   3. What you can do (Skills)
 *   4. Where you've done it (Experience)
 *   5. How it's validated (Certifications)
 *   6. How to reach you (ContactForm)
 *   7. Technical stack (ThisSite)
 */

import { GlowCapture, Glow } from '@codaworks/react-glow';
import Hero from './components/Hero';
import Chatbot from './components/Chatbot';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import ContactForm from './components/ContactForm';
import ThisSite from './components/ThisSite';
import SEO from './components/SEO';

/**
 * Root component — renders the full portfolio page.
 *
 * @returns The complete portfolio layout.
 */
function App() {
  return (
    <GlowCapture>
      <SEO />
      <div className="app">
        <main>
          <Hero />
          <Chatbot />
          <Glow color="#64ffda">
            <Skills />
          </Glow>
          <Glow color="#64ffda">
            <Experience />
          </Glow>
          <Glow color="#64ffda">
            <Certifications />
          </Glow>
          <ContactForm />
          <ThisSite />
        </main>
      </div>
    </GlowCapture>
  );
}

export default App;
