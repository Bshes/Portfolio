import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useMagneticHover } from '@/hooks/useMagneticHover';

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const btnRef = useMagneticHover<HTMLButtonElement>({ strength: 0.3 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@saino.studio' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  ];

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan mb-4">
            <Mail size={14} />
            Get in Touch
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Let's Build Something
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's talk about how we can bring your vision to life.
          </p>
        </motion.div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-xl p-4 text-center border border-glass-border"
            >
              <info.icon size={20} className="mx-auto mb-2 text-accent-cyan" />
              <div className="text-xs text-fg-muted mb-1">{info.label}</div>
              <div className="text-sm font-medium">{info.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-12 text-center border border-glass-border"
            >
              <CheckCircle size={48} className="mx-auto mb-4 text-success" />
              <h3 className="font-display text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-fg-muted text-sm">
                Thank you for reaching out! I'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 border border-glass-border space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5 font-medium">Name *</label>
                  <input
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-elevated rounded-xl px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted border border-glass-border focus:outline-none focus:border-accent-cyan/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5 font-medium">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-elevated rounded-xl px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted border border-glass-border focus:outline-none focus:border-accent-cyan/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5 font-medium">Service Interested In</label>
                  <select
                    name="service"
                    value={formState.service}
                    onChange={handleChange}
                    className="w-full bg-elevated rounded-xl px-4 py-2.5 text-sm text-fg-secondary border border-glass-border focus:outline-none focus:border-accent-cyan/40 transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="web-design">Web Design & Development</option>
                    <option value="brand-identity">AI Brand Identity</option>
                    <option value="3d-webgl">3D & WebGL Experiences</option>
                    <option value="ai-automation">AI Automation</option>
                    <option value="motion">Motion & Animation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5 font-medium">Budget Range</label>
                  <select
                    name="budget"
                    value={formState.budget}
                    onChange={handleChange}
                    className="w-full bg-elevated rounded-xl px-4 py-2.5 text-sm text-fg-secondary border border-glass-border focus:outline-none focus:border-accent-cyan/40 transition-colors"
                  >
                    <option value="">Select budget</option>
                    <option value="<2.5k">Under $2,500</option>
                    <option value="2.5k-5k">$2,500 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k+">$10,000+</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-fg-muted mb-1.5 font-medium">Message *</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-elevated rounded-xl px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted border border-glass-border focus:outline-none focus:border-accent-cyan/40 transition-colors resize-none"
                />
              </div>

              <button
                ref={btnRef}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-deep font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
