import { useEffect, useRef, useState } from 'react';
import { DEFAULT_SITE_SECTIONS, fetchSiteSection } from '../api/siteSectionsApi';
import './Hero.css';

function Hero() {
  const videoRef = useRef(null);
  const [content, setContent] = useState(DEFAULT_SITE_SECTIONS.hero);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchSiteSection('hero')
      .then((section) => {
        if (isMounted) setContent(section);
      })
      .catch((error) => {
        console.error('Unable to load hero content.', error);
        if (isMounted) setLoadError('Hero content could not be loaded.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Autoplay prevented or pending interaction:', err);
        }
      });
    }
  }, [content.video]);

  return (
    <section className="hero" id="home">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        src={content.video}
      >
        Your browser does not support the video tag.
      </video>

      <div className="hero-overlay" />

      <button
        className="arrow-left"
        aria-label="Previous slide"
      >
        &#8249;
      </button>

      <div className="hero-content">
        <h1>
          {content.heading}
        </h1>

        <p>
          {content.subheading}
        </p>

        <a href={content.ctaHref} className="btn-book">
          {content.ctaText}
        </a>
        {loadError ? <p role="status">{loadError}</p> : null}
      </div>

      <button
        className="arrow-right"
        aria-label="Next slide"
      >
        &#8250;
      </button>
    </section>
  );
}

export default Hero;