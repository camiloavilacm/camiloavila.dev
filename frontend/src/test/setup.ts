import '@testing-library/jest-dom';

// Mock scrollIntoView and scrollTo (not implemented in jsdom)
Element.prototype.scrollIntoView = () => {};
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {};
}
