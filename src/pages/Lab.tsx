import SEO from '@/components/SEO';
import ShaderPlayground from '@/sections/ShaderPlayground';

export default function Lab() {
  return (
    <main className="pt-24">
      <SEO
        title="Lab"
        description="Explore real-time WebGL shader experiments and AI-driven visual prototypes in Saino's experimental lab."
        path="/lab"
      />
      <ShaderPlayground />
    </main>
  );
}
