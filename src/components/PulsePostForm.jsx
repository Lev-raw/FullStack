import { useEffect, useState } from 'react';
import ImageUploadField from './ImageUploadField';

const defaultValues = {
  title: '',
  date: '',
  image: '',
  readMoreUrl: '',
};

const toDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};

const isValidReadMoreUrl = (value) => {
  if (!value) {
    return true;
  }

  if (value.startsWith('#') || value.startsWith('/')) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

function PulsePostForm({ initialValues, onSubmit, submitLabel, onCancel }) {
  const [formData, setFormData] = useState(defaultValues);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData({
      title: initialValues?.title || '',
      date: toDateInputValue(initialValues?.date),
      image: initialValues?.image || '',
      readMoreUrl: initialValues?.readMoreUrl && initialValues.readMoreUrl !== '#'
        ? initialValues.readMoreUrl
        : '',
    });
    setError('');
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUploading) {
      setError('Wait for the image upload to finish before saving.');
      return;
    }

    const title = formData.title.trim();
    const image = formData.image.trim();
    const readMoreUrl = formData.readMoreUrl.trim();

    if (!title) {
      setError('Title is required.');
      return;
    }

    if (!formData.date) {
      setError('Date is required.');
      return;
    }

    if (!image) {
      setError('Image is required. Upload a file or provide an image URL.');
      return;
    }

    if (readMoreUrl && !isValidReadMoreUrl(readMoreUrl)) {
      setError('Enter a valid Read More URL (https://..., /path, or #section).');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        date: formData.date,
        image,
        readMoreUrl: readMoreUrl || '#',
      });
    } catch (submitError) {
      setError(submitError.message || 'Unable to save post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="pulse-form" onSubmit={handleSubmit}>
      {error ? <p className="pulse-admin-error">{error}</p> : null}
      <div className="pulse-form-grid">
        <div className="pulse-form-field full">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
          />
        </div>

        <div className="pulse-form-field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="pulse-form-field">
          <label htmlFor="readMoreUrl">Read More URL</label>
          <input
            id="readMoreUrl"
            name="readMoreUrl"
            type="text"
            value={formData.readMoreUrl}
            onChange={handleChange}
            placeholder="https://example.com/article or /pulse/rewa-city"
          />
        </div>

        <ImageUploadField
          id="image"
          label="Image URL or upload"
          value={formData.image}
          onChange={(image) => {
            setFormData((current) => ({ ...current, image }));
            setError('');
          }}
          onUploadStateChange={(_, uploading) => setIsUploading(uploading)}
          className="pulse-form-field"
        />

        {formData.image ? (
          <div className="pulse-form-field full">
            <span>Image preview</span>
            <img
              className="pulse-image-preview"
              src={formData.image}
              alt="Pulse post preview"
            />
          </div>
        ) : null}
      </div>

      <div className="pulse-form-actions">
        {onCancel ? (
          <button type="button" className="pulse-form-cancel" onClick={onCancel}>
            CANCEL
          </button>
        ) : null}
        <button type="submit" className="pulse-form-submit" disabled={isSubmitting || isUploading}>
          {isUploading ? 'UPLOADING IMAGE...' : isSubmitting ? 'SAVING...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PulsePostForm;
