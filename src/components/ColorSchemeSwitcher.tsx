import { useColorScheme } from '@/hooks/useColorScheme';
import { Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ColorSchemeSwitcher() {
  const { scheme, schemes, setScheme } = useColorScheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 left-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full glass border border-glass-border flex items-center justify-center text-fg-muted hover:text-accent-cyan transition-all duration-300 hover:border-accent-cyan/30"
        aria-label="Switch color scheme"
        title="Switch color scheme"
      >
        <Palette size={18} />
      </button>

      {isOpen && (
        <div className="absolute bottom-14 left-0 glass rounded-xl border border-glass-border p-2 shadow-2xl min-w-[160px]">
          {schemes.map((s) => (
            <button
              key={s.name}
              onClick={() => { setScheme(s.name); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                scheme.name === s.name
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-fg-muted hover:text-fg-primary hover:bg-white/5'
              }`}
            >
              {/* Color dots */}
              <span className="flex gap-0.5">
                {s.fluidColors.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
              <span className="font-medium">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
