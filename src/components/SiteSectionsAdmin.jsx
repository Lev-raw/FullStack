import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_SITE_SECTIONS, fetchSiteSection, saveSiteSection } from '../api/siteSectionsApi';
import ImageUploadField from './ImageUploadField';
import VideoUploadField from './VideoUploadField';
import './SiteSectionsAdmin.css';

const SECTION_DETAILS = {
  hero: { title: 'Hero', description: 'Manage the hero video, headline, subheading, and call-to-action.' },
  showtime: { title: 'Showtime', description: 'Manage the show cards, descriptions, images, and links.' },
  performanceSpaces: { title: 'Performance Spaces', description: 'Manage Stage and Studio spaces, items, and images.' },
  legacyLibrary: { title: 'Legacy Library', description: 'Manage the library story, image, and link.' },
  culinaryExperience: { title: 'Culinary Experience', description: 'Manage the café and dining experience cards.' },
};

const splitParagraphs = (value) => value.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
const hasEmptyText = (value) => {
  if (typeof value === 'string') return !value.trim();
  if (Array.isArray(value)) return value.some(hasEmptyText);
  if (value && typeof value === 'object') return Object.values(value).some(hasEmptyText);
  return false;
};
const isSafeUrl = (value, allowAnchor = false) => {
  if (allowAnchor && value.startsWith('#')) return true;
  if (value.startsWith('/')) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

function TextField({ id, label, value, onChange, multiline = false, rows = 3 }) {
  return (
    <div className="site-cms-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function SiteSectionsEditor({ sectionKey }) {
  const details = SECTION_DETAILS[sectionKey];
  const [content, setContent] = useState(() => details ? DEFAULT_SITE_SECTIONS[sectionKey] : null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(() => new Set());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (!details) {
      return () => { isMounted = false; };
    }
    fetchSiteSection(sectionKey)
      .then((section) => {
        if (isMounted) {
          setContent(section);
          setError('');
        }
      })
      .catch((loadError) => {
        console.error(`Unable to load ${sectionKey} CMS content.`, loadError);
        if (isMounted) setError(loadError.message || `Unable to load ${details.title}.`);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, [details, sectionKey]);

  const setField = (path, value) => {
    setContent((current) => {
      const next = structuredClone(current);
      let target = next;
      for (const key of path.slice(0, -1)) target = target[key];
      target[path[path.length - 1]] = value;
      return next;
    });
    setError('');
    setSuccess('');
  };

  const updateItem = (listPath, index, field, value) => {
    const list = listPath.reduce((target, key) => target[key], content);
    const updated = list.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item);
    setField(listPath, updated);
  };

  const appendItem = (listPath, item) => {
    const list = listPath.reduce((target, key) => target[key], content);
    setField(listPath, [...list, item]);
  };

  const removeItem = (listPath, index) => {
    const list = listPath.reduce((target, key) => target[key], content);
    if (list.length <= 1) {
      setError('Keep at least one item in this section.');
      return;
    }
    setField(listPath, list.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleUploadStateChange = (id, isUploading) => {
    setPendingUploads((current) => {
      const next = new Set(current);
      if (isUploading) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content || !details) return;
    if (pendingUploads.size) {
      setError('Wait for all file uploads to finish before saving.');
      return;
    }

    const urls = [];
    if (sectionKey === 'hero') {
      urls.push([content.video, false], [content.ctaHref, true]);
    // } else if (sectionKey === 'showtime') {
    //   content.items.forEach((item) => urls.push([item.image, false], [item.moreInfoHref, true], [item.bookHref, true]));
    // } else if (sectionKey === 'performanceSpaces') {
      Object.values(content.spaces).forEach((space) => urls.push([space.image, false]));
    } else if (sectionKey === 'legacyLibrary') {
      urls.push([content.image, false], [content.buttonHref, true]);
    } else {
      content.items.forEach((item) => urls.push([item.image, false]));
    }
    if (hasEmptyText(content)) {
      setError('Complete all content fields before saving.');
      return;
    }
    if (urls.some(([url, allowAnchor]) => !url || !isSafeUrl(url, allowAnchor))) {
      setError('Use a site path or valid http(s) URL for images and links.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const savedContent = await saveSiteSection(sectionKey, content);
      setContent(savedContent);
      setSuccess(`${details.title} saved successfully.`);
    } catch (saveError) {
      setError(saveError.message || `Unable to save ${details.title}.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!details) {
    return <section className="site-cms-page"><h1>Section not found</h1><p>Unknown site section.</p></section>;
  }

  const renderCardFields = (items, listPath, imageLabel = 'Image URL or site path', links = false) => (
    <div className="site-cms-card-list">
      {items.map((item, index) => (
        <fieldset className="site-cms-card" key={`${listPath.join('-')}-${index}`}>
          <legend>Item {index + 1}</legend>
          <TextField id={`${sectionKey}-${listPath.join('-')}-${index}-title`} label="Title" value={item.title} onChange={(value) => updateItem(listPath, index, 'title', value)} />
          <ImageUploadField
            id={`${sectionKey}-${listPath.join('-')}-${index}-image`}
            label={imageLabel}
            value={item.image}
            onChange={(value) => updateItem(listPath, index, 'image', value)}
            onUploadStateChange={handleUploadStateChange}
            className="site-cms-field"
          />
          <TextField id={`${sectionKey}-${listPath.join('-')}-${index}-text`} label="Description" value={item.text} onChange={(value) => updateItem(listPath, index, 'text', value)} multiline />
          {links ? (
            <div className="site-cms-grid">
              <TextField id={`${sectionKey}-${index}-more-info`} label="More Info destination" value={item.moreInfoHref} onChange={(value) => updateItem(listPath, index, 'moreInfoHref', value)} />
              <TextField id={`${sectionKey}-${index}-book`} label="Book Now destination" value={item.bookHref} onChange={(value) => updateItem(listPath, index, 'bookHref', value)} />
            </div>
          ) : null}
          <button className="site-cms-remove" type="button" onClick={() => removeItem(listPath, index)}>Remove item</button>
        </fieldset>
      ))}
      <button
        className="site-cms-add"
        type="button"
        onClick={() => appendItem(listPath, links
          ? { title: '', image: '', text: '', moreInfoHref: '#showtime', bookHref: '#contact' }
          : { title: '', image: '', text: '' })}
      >
        + Add item
      </button>
    </div>
  );

  return (
    <section className="site-cms-page">
      <header className="site-cms-header">
        <div>
          <p className="site-cms-eyebrow">CONTENT MANAGEMENT</p>
          <h1>{details.title}</h1>
          <p>{details.description}</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer">Preview website</a>
      </header>
      {isLoading ? <p className="site-cms-status">Loading content…</p> : content ? (
        <form className="site-cms-form" onSubmit={handleSubmit}>
          {sectionKey === 'hero' ? (
            <fieldset className="site-cms-group">
              <legend>Hero content</legend>
              <TextField id="hero-heading" label="Heading" value={content.heading} onChange={(value) => setField(['heading'], value)} />
              <TextField id="hero-subheading" label="Subheading" value={content.subheading} onChange={(value) => setField(['subheading'], value)} />
              <div className="site-cms-grid">
                <TextField id="hero-cta-text" label="Button label" value={content.ctaText} onChange={(value) => setField(['ctaText'], value)} />
                <TextField id="hero-cta-href" label="Button destination" value={content.ctaHref} onChange={(value) => setField(['ctaHref'], value)} />
              </div>
              <VideoUploadField
                id="hero-video"
                label="Video URL or site path"
                value={content.video}
                onChange={(value) => setField(['video'], value)}
                onUploadStateChange={handleUploadStateChange}
                className="site-cms-field"
                disabled={isSaving}
              />
            </fieldset>
          ) : null}

          {sectionKey === 'showtime' ? (
            <>
              <fieldset className="site-cms-group">
                <legend>Section heading</legend>
                <TextField id="showtime-heading" label="Heading" value={content.heading} onChange={(value) => setField(['heading'], value)} />
              </fieldset>
              {renderCardFields(content.items, ['items'], 'Image URL or site path', true)}
            </>
          ) : null}

          {sectionKey === 'performanceSpaces' ? (
            <>
              <fieldset className="site-cms-group">
                <legend>Section heading</legend>
                <TextField id="spaces-heading" label="Heading" value={content.heading} onChange={(value) => setField(['heading'], value)} />
              </fieldset>
              {Object.entries(content.spaces).map(([spaceKey, space]) => (
                <fieldset className="site-cms-group" key={spaceKey}>
                  <legend>{space.label || spaceKey}</legend>
                  <div className="site-cms-grid">
                    <TextField id={`${spaceKey}-label`} label="Tab label" value={space.label} onChange={(value) => setField(['spaces', spaceKey, 'label'], value)} />
                    <ImageUploadField id={`${spaceKey}-image`} label="Image URL or site path" value={space.image} onChange={(value) => setField(['spaces', spaceKey, 'image'], value)} onUploadStateChange={handleUploadStateChange} className="site-cms-field" />
                  </div>
                  {space.items.map((item, index) => (
                    <div className="site-cms-item-row" key={`${spaceKey}-${index}`}>
                      <TextField id={`${spaceKey}-${index}-title`} label="Space name" value={item.title} onChange={(value) => updateItem(['spaces', spaceKey, 'items'], index, 'title', value)} />
                      <TextField id={`${spaceKey}-${index}-text`} label="Description" value={item.text} onChange={(value) => updateItem(['spaces', spaceKey, 'items'], index, 'text', value)} multiline />
                      <button className="site-cms-remove" type="button" onClick={() => removeItem(['spaces', spaceKey, 'items'], index)}>Remove space</button>
                    </div>
                  ))}
                  <button className="site-cms-add" type="button" onClick={() => appendItem(['spaces', spaceKey, 'items'], { title: '', text: '' })}>+ Add space</button>
                </fieldset>
              ))}
            </>
          ) : null}

          {sectionKey === 'legacyLibrary' ? (
            <fieldset className="site-cms-group">
              <legend>Library content</legend>
              <div className="site-cms-grid">
                <TextField id="legacy-heading" label="Heading" value={content.heading} onChange={(value) => setField(['heading'], value)} />
                <TextField id="legacy-tagline" label="Tagline" value={content.tagline} onChange={(value) => setField(['tagline'], value)} />
              </div>
              <ImageUploadField id="legacy-image" label="Image URL or site path" value={content.image} onChange={(value) => setField(['image'], value)} onUploadStateChange={handleUploadStateChange} className="site-cms-field" />
              <TextField id="legacy-paragraphs" label="Story paragraphs" value={content.paragraphs.join('\n\n')} onChange={(value) => setField(['paragraphs'], splitParagraphs(value))} multiline rows={8} />
              <div className="site-cms-grid">
                <TextField id="legacy-button" label="Link label" value={content.buttonText} onChange={(value) => setField(['buttonText'], value)} />
                <TextField id="legacy-href" label="Link destination" value={content.buttonHref} onChange={(value) => setField(['buttonHref'], value)} />
              </div>
            </fieldset>
          ) : null}

          {sectionKey === 'culinaryExperience' ? (
            <>
              <fieldset className="site-cms-group">
                <legend>Section heading</legend>
                <TextField id="culinary-heading" label="Heading" value={content.heading} onChange={(value) => setField(['heading'], value)} />
              </fieldset>
              {renderCardFields(content.items, ['items'])}
            </>
          ) : null}

          {error ? <p className="site-cms-error" role="alert">{error}</p> : null}
          {success ? <p className="site-cms-success" role="status">{success}</p> : null}
          <div className="site-cms-actions">
            <button type="submit" disabled={isSaving || pendingUploads.size > 0}>
              {pendingUploads.size ? 'UPLOADING FILE…' : isSaving ? 'SAVING…' : `SAVE ${details.title.toUpperCase()}`}
            </button>
          </div>
        </form>
      ) : <p className="site-cms-error" role="alert">{error || 'Section content unavailable.'}</p>}
    </section>
  );
}

function SiteSectionsAdmin() {
  const { sectionKey } = useParams();
  return <SiteSectionsEditor key={sectionKey} sectionKey={sectionKey} />;
}

export default SiteSectionsAdmin;
