import { useEffect, useState } from 'react';
import { fetchPulsePosts } from '../api/pulseApi';

const formatPulseDate = (dateValue) => {
  if (!dateValue) {
    return '—';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};

function PulsePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchPulsePosts();
        setArticles(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (error) {
        console.error('Failed to load Pulse & Page posts', error);
        setArticles([]);
      }
    };

    loadArticles();
  }, []);

  return (
    <section className="pulse-page" id="pulse">
      <div className="pulse-heading">
        <h2>Pulse &amp; Page</h2>
      </div>
      <div className="article-grid">
        {articles.length === 0 ? (
          <p className="pulse-empty">No Pulse &amp; Page posts available.</p>
        ) : (
          articles.map((article) => (
            <article className="article-card" key={article.id || article.title}>
              {article.image ? (
                <img src={article.image} alt={article.title || 'Pulse & Page post'} />
              ) : null}
              <p className="article-date">{formatPulseDate(article.date)}</p>
              <h3>{article.title || 'Untitled post'}</h3>
              <a href={article.readMoreUrl || '#pulse'}>
                READ MORE
              </a>
            </article>
          ))
        )}
      </div>
      <div className="pulse-view">
        <button
          className="pulse-arrow"
          type="button"
          aria-label="Previous articles"
        >
          ‹
        </button>
        <a className="pulse-view-all" href="#pulse">
          VIEW ALL
        </a>
        <button
          className="pulse-arrow"
          type="button"
          aria-label="Next articles"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default PulsePage;
