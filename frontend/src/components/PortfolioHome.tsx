/**
 * PortfolioHome.tsx — Root Portfolio Home Page Component
 *
 * Composes all portfolio sections in order:
 *   Hero → Chatbot → Skills → Experience → Certifications → ContactForm → ThisSite
 */

import React from 'react';
import { GlowCapture, Glow } from '@codaworks/react-glow';
import Hero from './Hero';
import Chatbot from './Chatbot';
import Skills from './Skills';
import Experience from './Experience';
import Certifications from './Certifications';
import ContactForm from './ContactForm';
import ThisSite from './ThisSite';
import SEO from './SEO';

export const PortfolioHome: React.FC = () => {
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
};

export default PortfolioHome;
