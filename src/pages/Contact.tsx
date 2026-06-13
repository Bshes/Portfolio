import SEO from '@/components/SEO';
import ContactForm from '@/sections/ContactForm';

export default function Contact() {
  return (
    <main className="pt-24">
      <SEO
        title="Contact"
        description="Start your AI-powered web design project. Tell Saino about your vision and get a custom proposal within 24 hours."
        path="/contact"
      />
      <ContactForm />
    </main>
  );
}
