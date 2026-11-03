import { useState, useRef, useEffect } from 'react';
import { type Language, LANGUAGES } from '../i18n/translations';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="h-9 px-2.5 sm:px-3 rounded-xl border border-[#E0D8CD] bg-white hover:bg-[#FAF8F5] text-[#382314] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#8C4A26]/30"
      >
        <span className="text-sm leading-none">{activeOption.flag}</span>
        <span className="tracking-wide">{activeOption.shortLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#6B5A4D] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white border border-[#E0D8CD] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold text-[#8C4A26]/80 border-b border-[#F0EBE3] mb-1">
            Language / Idioma / Sprache
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF5EE] text-[#382314] font-bold'
                    : 'text-[#5C4A3E] hover:bg-[#F8F5F0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8C4A26]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
