import { Link } from 'react-router-dom';
import { Globe, Code, MessageCircle, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-glass-border bg-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center text-deep font-bold font-display text-sm">
                S
              </div>
              <span className="font-display font-semibold text-lg">Saino</span>
            </Link>
            <p className="text-fg-muted text-sm max-w-md">
              Crafting immersive digital experiences at the intersection of AI and design.
              We build websites that don't just look stunning — they think.
            </p>
            <div className="flex gap-3 mt-6">
              {[Code, Globe, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-fg-muted hover:text-accent-cyan transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm text-fg-primary mb-4">Navigate</h4>
            <ul className="space-y-2">
              {['Services', 'Work', 'Process', 'About'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-fg-muted hover:text-accent-cyan transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-fg-primary mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-fg-muted">
              <li>hello@saino.studio</li>
              <li>San Francisco, CA</li>
              <li>Available for projects</li>
              <li>
                <Link to="/contact" className="text-accent-cyan hover:underline">
                  Start a project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-fg-muted">
            &copy; {new Date().getFullYear()} Saino Studio. All rights reserved.
          </p>
          <p className="text-xs text-fg-muted flex items-center gap-1">
            Crafted with <Heart size={12} className="text-accent-magenta" /> and AI
          </p>
        </div>
      </div>
    </footer>
  );
}
