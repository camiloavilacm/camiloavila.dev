/**
 * App.tsx — Root Application Component
 *
 * Composes all portfolio sections in order:
 *   Hero → Skills → Experience → Certifications → ContactForm
 *
 * The Chatbot widget is rendered outside the main flow so it floats
 * over the page content (position: fixed in its own CSS).
 *
 * Section order matches a typical portfolio reading flow:
 *   1. Who you are (Hero)
 *   2. What you can do (Skills)
 *   3. Where you've done it (Experience)
 *   4. How it's validated (Certifications)
 *   5. How to reach you (ContactForm)
 */

import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import ContactForm from "./components/ContactForm";
import Chatbot from "./components/Chatbot";

/**
 * Root component — renders the full portfolio page.
 *
 * @returns The complete portfolio layout with floating chatbot widget.
 */
function App() {
  return (
    <div className="app">
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Certifications />
        <ContactForm />
      </main>
      {/* Chatbot floats over all sections — always accessible */}
      <Chatbot />
    </div>
  );
}

export default App;
