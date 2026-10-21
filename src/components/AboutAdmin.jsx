import { useEffect, useState } from 'react';
import { createAbout, DEFAULT_ABOUT, fetchAbout, updateAbout } from '../api/AboutSectionApi';
import ImageUploadField from './ImageUploadField';
import './AboutAdmin.css';

const fieldNames = [
  'title',
  'leadname',
  'designation',
  'image',
  'sagaTitle',
  'sagaText',
  'sagaTextSecond',
  'buttonText',
  'buttonHref',
];

const isSafeLink = (value, allowAnchor = false) => {
  if (allowAnchor && value.startsWith('#')) {
    return true;
  }
  if (value.startsWith('/')) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

function AboutAdmin() {
  const [aboutId, setAboutId] = useState('');
  const [formData, setFormData] = useState(DEFAULT_ABOUT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchAbout()
      .then((content) => {
        if (!isMounted || !content) {
          return;
        }
        setAboutId(content.id);
        setFormData(Object.fromEntries(fieldNames.map((name) => [name, content[name] ?? ''])));
      })
      .catch((loadError) => {
        console.error('Unable to load About CMS content.', loadError);
        if (isMounted) {
          setError(loadError.message || 'Unable to load About content.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUploading) {
      setError('Wait for the image upload to finish before saving.');
      return;
    }
    const payload = Object.fromEntries(
      fieldNames.map((name) => [name, String(formData[name] || '').trim()]),
    );

    if (fieldNames.some((name) => !payload[name])) {
      setError('Please complete all About section fields before saving.');
      return;
    }
    if (!isSafeLink(payload.image) || !isSafeLink(payload.buttonHref, true)) {
      setError('Use a site path or a valid http(s) URL for the portrait and link destination.');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      const savedAbout = aboutId
        ? await updateAbout(aboutId, payload)
        : await createAbout(payload);
      if (!savedAbout) {
        throw new Error('The saved About content could not be read.');
      }
      setAboutId(savedAbout.id);
      setFormData(Object.fromEntries(fieldNames.map((name) => [name, savedAbout[name] ?? ''])));
      setMessage('About section saved successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save About content.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="about-admin-page">
      <header className="about-admin-header">
        <div>
          <p className="about-admin-eyebrow">CONTENT MANAGEMENT</p>
          <h1>About section</h1>
          <p>Update the story and leadership content shown on the website.</p>
        </div>
        <a href="/#about" target="_blank" rel="noreferrer">Preview website</a>
      </header>

      {isLoading ? <p className="about-admin-status">Loading About content…</p> : (
        <form className="about-admin-form" onSubmit={handleSubmit}>
          <fieldset disabled={isSaving}>
            <legend>Leadership story</legend>
            <label htmlFor="about-title">Story paragraphs</label>
            <textarea
              id="about-title"
              name="title"
              rows="8"
              value={formData.title}
              onChange={handleChange}
            />
            <p className="about-admin-hint">Separate paragraphs with a blank line.</p>

            <div className="about-admin-grid">
              <div>
                <label htmlFor="about-leadname">Leader name</label>
                <input id="about-leadname" name="leadname" value={formData.leadname} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="about-designation">Designation</label>
                <input id="about-designation" name="designation" value={formData.designation} onChange={handleChange} />
              </div>
              <ImageUploadField
                id="about-image"
                label="Portrait image URL or site path"
                value={formData.image}
                onChange={(image) => setFormData((current) => ({ ...current, image }))}
                onUploadStateChange={(_, uploading) => setIsUploading(uploading)}
                className="about-admin-full"
              />
              <div className="about-admin-full">
                {formData.image ? <img className="about-admin-image-preview" src={formData.image} alt="Current About portrait preview" /> : null}
              </div>
            </div>
          </fieldset>

          <fieldset disabled={isSaving}>
            <legend>Centre story</legend>
            <label htmlFor="about-saga-title">Heading</label>
            <input id="about-saga-title" name="sagaTitle" value={formData.sagaTitle} onChange={handleChange} />
            <label htmlFor="about-saga-text">First paragraph</label>
            <textarea id="about-saga-text" name="sagaText" rows="3" value={formData.sagaText} onChange={handleChange} />
            <label htmlFor="about-saga-text-second">Second paragraph</label>
            <textarea id="about-saga-text-second" name="sagaTextSecond" rows="3" value={formData.sagaTextSecond} onChange={handleChange} />
            <div className="about-admin-grid">
              <div>
                <label htmlFor="about-button-text">Link label</label>
                <input id="about-button-text" name="buttonText" value={formData.buttonText} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="about-button-href">Link destination</label>
                <input id="about-button-href" name="buttonHref" value={formData.buttonHref} onChange={handleChange} placeholder="#legacy" />
              </div>
            </div>
          </fieldset>

          {error ? <p className="about-admin-error" role="alert">{error}</p> : null}
          {message ? <p className="about-admin-success" role="status">{message}</p> : null}
          <div className="about-admin-actions">
            <button type="submit" disabled={isSaving || isUploading}>
              {isUploading ? 'UPLOADING IMAGE…' : isSaving ? 'SAVING…' : 'SAVE ABOUT SECTION'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default AboutAdmin;
