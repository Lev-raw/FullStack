import { useEffect, useState } from 'react';
import { DEFAULT_SITE_SECTIONS, fetchSiteSection } from '../api/siteSectionsApi';

function CulinaryExperience() {
  const [content, setContent] = useState(DEFAULT_SITE_SECTIONS.culinaryExperience);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchSiteSection('culinaryExperience')
      .then((section) => {
        if (isMounted) setContent(section);
      })
      .catch((error) => {
        console.error('Unable to load Culinary Experience content.', error);
        if (isMounted) setLoadError('Culinary Experience content could not be loaded.');
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="culinary-experience">
      {loadError ? <p role="status">{loadError}</p> : null}
      <h2 className="culinary-title">{content.heading}</h2>
      <div className="culinary-cards">
        {content.items.map(({ image, title, text }) => (
          <article className="culinary-card" key={title}>
            <img src={image} alt={title} />
            <div className="culinary-overlay"><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CulinaryExperience;
