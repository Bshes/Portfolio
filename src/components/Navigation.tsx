import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useMagneticHover } from '@/hooks/useMagneticHover';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Work', path: '/work' },
  { label: 'Process', path: '/process' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Lab', path: '/lab' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useMagneticHover<HTMLAnchorElement>({ strength: 0.2 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass border-b border-glass-border shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              ref={logoRef}
              to="/"
              className="relative flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center text-deep font-bold font-display text-sm">
                S
              </div>
              <span className="font-display font-semibold text-lg tracking-tight">
                Saino
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative px-4 py-2 text-sm font-medium transition-colors duration-300"
                    onMouseEnter={() => setHoveredLink(item.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${
                      isActive ? 'text-fg-primary' : 'text-fg-muted hover:text-fg-primary'
                    }`}>
                      {item.label}
                    </span>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-white/5 border border-glass-border" />
                    )}
                    {/* Hover glow */}
                    {hoveredLink === item.path && !isActive && (
                      <span className="absolute inset-0 rounded-lg bg-white/[0.02]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg glass text-fg-primary"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${
          isMobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-deep/90 backdrop-blur-2xl" onClick={() => setIsMobileOpen(false)} aria-label="Close menu" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsMobileOpen(false)} />
        <div className="relative h-full flex flex-col items-center justify-center gap-6">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`text-2xl font-display font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-accent-cyan'
                    : 'text-fg-muted hover:text-fg-primary'
                }`}
                style={{
                  transform: isMobileOpen
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  opacity: isMobileOpen ? 1 : 0,
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
