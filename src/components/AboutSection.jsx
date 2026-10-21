import { useEffect, useState } from 'react';
import { DEFAULT_ABOUT, fetchAbout } from '../api/AboutSectionApi';
import './AboutSection.css';
import sagaEmblem from '../assets/saga-emblem.svg';
import sagaInstrument from '../assets/saga-instrument.svg';

function AboutSection() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchAbout()
      .then((content) => {
        if (isMounted && content) {
          setAbout(content);
        }
      })
      .catch((error) => {
        console.error('Unable to load About section content.', error);
        if (isMounted) {
          setLoadError('Some About section content could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const paragraphs = about.title.split(/\n\s*\n/).filter(Boolean);

  return (
    <section className="about-poster" id="about">
      {loadError ? <p className="about-load-error" role="status">{loadError}</p> : null}
      <div className="rajashree-section">
        <div className="rajashree-image">
          <div className="image-pink-bg" />
          <img src={about.image} alt={`${about.leadname}, featured in a portrait for the About section.`} />
        </div>
        <div className="rajashree-content">
          <div className="quote-mark"><svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.7872 21.06L19.8107 0H25.0311L21.0154 21.06H13.7872ZM0 21.06L5.9789 0H11.3331L7.13898 21.06H0Z" fill="#A4895D"/>
</svg>
</div>
          {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
          <div className="rajashree-name">
            <h2>{about.leadname}</h2>
            <span>{about.designation}</span>
          </div>
        </div>
      </div>
      <div className="saga-section">
        <img className="saga-decoration saga-decoration--emblem" src={sagaEmblem} alt="" aria-hidden="true" />
        <h2 className="saga-title">{about.sagaTitle}</h2>
        <p className="saga-text">{about.sagaText}</p>
        <p className="saga-text saga-text-second">{about.sagaTextSecond}</p>
        <a className="saga-button" href={about.buttonHref}>{about.buttonText}</a>
        <img className="saga-decoration saga-decoration--instrument" src={sagaInstrument} alt="" aria-hidden="true" />
      </div>
    </section>
  );
}

export default AboutSection;
