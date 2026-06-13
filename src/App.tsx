import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ColorSchemeSwitcher from '@/components/ColorSchemeSwitcher';
import PreLoader from '@/components/PreLoader';
import CustomCursor from '@/components/CustomCursor';
import SkipToContent from '@/components/SkipToContent';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Work from '@/pages/Work';
import Process from '@/pages/Process';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

// Lazy-loaded heavy chunks
const Lab = lazy(() => import('@/pages/Lab'));
const FluidOverlay = lazy(() => import('@/three/FluidSimulation'));

function SmoothScrollProvider({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function onRaf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(onRaf);
    }
    requestAnimationFrame(onRaf);

    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0, left: 0, width: window.innerWidth, height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    return () => { lenis.destroy(); };
  }, [disabled]);

  return <>{children}</>;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  return (
    <BrowserRouter>
      <SkipToContent />

      {/* Pre-loader — shows on first visit */}
      <PreLoader
        minDuration={2000}
        onFinish={() => setLoaded(true)}
      />

      {/* Main app — hidden until preloader finishes */}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <SmoothScrollProvider disabled={reducedMotion}>
          <div className={`min-h-screen bg-deep text-fg-primary flex flex-col ${reducedMotion ? 'reduce-motion' : ''}`}>
            <Navigation />
            <main id="main-content" className="flex-1">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/work" element={<Work />} />
                  <Route path="/process" element={<Process />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/lab" element={
                    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan animate-spin" /></div>}>
                      <Lab />
                    </Suspense>
                  } />
                </Routes>
              </PageTransition>
            </main>
            <Footer />
            <ColorSchemeSwitcher />
            {!reducedMotion && (
              <>
                <CustomCursor />
                <Suspense fallback={null}>
                  <FluidOverlay />
                </Suspense>
              </>
            )}
          </div>
        </SmoothScrollProvider>
      </div>

      {/* Hide default cursor styles — injected by CustomCursor */}
    </BrowserRouter>
  );
}
