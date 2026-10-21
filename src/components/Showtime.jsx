import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_SITE_SECTIONS, fetchSiteSection } from '../api/siteSectionsApi';

function Showtime() {
  const navigate = useNavigate();
  const [content, setContent] = useState(DEFAULT_SITE_SECTIONS.showtime);
  const [loadError, setLoadError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const bookShow = (show) => {
    const title = show.title.trim().toLowerCase();
    const knownRoute = title.includes('romeo') && title.includes('juliet')
      ? '/booking/romeo-juliet'
      : title.startsWith('zen katha')
        ? '/booking/zen-katha'
        : null;
    const route = knownRoute || show.bookHref;

    if (route) navigate(route);
  };

  const scrollToIndex = (index) => {
    const carousel = carouselRef.current;
    const card = carousel?.querySelectorAll('.showtime-card')[index];
    if (!carousel || !card) return;

    setActiveIndex(index);
    const left = carousel.scrollLeft + card.getBoundingClientRect().left - carousel.getBoundingClientRect().left;
    carousel.scrollTo({ left, behavior: 'smooth' });
  };

  useEffect(() => {
    let isMounted = true;
    fetchSiteSection('showtime')
      .then((section) => {
        if (isMounted) setContent(section);
      })
      .catch((error) => {
        console.error('Unable to load Showtime content.', error);
        if (isMounted) setLoadError('Showtime content could not be loaded.');
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="showtime" id="showtime">
      {loadError ? <p role="status">{loadError}</p> : null}
      <h2 className="showtime-heading">{content.heading}</h2>
      <div className="showtime-carousel" ref={carouselRef}>
        <div className="showtime-cards">
          {content.items.map((show) => (
            <article className="showtime-card" key={show.title}>
              <img className="showtime-image" src={show.image} alt={show.title} />
              <h3>{show.title}</h3>
              <p>{show.text}</p>
              <div className="showtime-buttons">
                <a className="more-info" href={show.moreInfoHref}>MORE INFO</a>
                <button className="showtime-book" type="button" onClick={() => bookShow(show)}>
                  BOOK NOW
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="showtime-view">
        <button
          className="showtime-arrow"
          type="button"
          aria-label="Previous"
          disabled={content.items.length < 2}
          onClick={() => scrollToIndex((activeIndex - 1 + content.items.length) % content.items.length)}
        >
          ‹
        </button>
        <a className="view-all" href="#showtime">VIEW ALL</a>
        <button
          className="showtime-arrow"
          type="button"
          aria-label="Next"
          disabled={content.items.length < 2}
          onClick={() => scrollToIndex((activeIndex + 1) % content.items.length)}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default Showtime;
