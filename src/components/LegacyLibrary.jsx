import { useEffect, useState } from 'react';
import { DEFAULT_SITE_SECTIONS, fetchSiteSection } from '../api/siteSectionsApi';

function LegacyLibrary() {
  const [content, setContent] = useState(DEFAULT_SITE_SECTIONS.legacyLibrary);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchSiteSection('legacyLibrary')
      .then((section) => {
        if (isMounted) setContent(section);
      })
      .catch((error) => {
        console.error('Unable to load Legacy Library content.', error);
        if (isMounted) setLoadError('Legacy Library content could not be loaded.');
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="legacy-library" id="legacy">
      {loadError ? <p role="status">{loadError}</p> : null}
      <div className="legacy-content">
        <img src={content.image} alt={content.heading} />
        <div className="legacy-copy">
          <h2 className="legacy-title">{content.heading}</h2>
          <p className="legacy-text">{content.tagline}</p>
          {content.paragraphs.map((paragraph, index) => (
            <p className="legacy-description" key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
          <a className="legacy-button" href={content.buttonHref}>{content.buttonText}</a>
        </div>
      </div>
    </section>
  );
}
export default LegacyLibrary;
