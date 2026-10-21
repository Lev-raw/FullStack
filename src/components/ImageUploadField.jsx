import { useState } from 'react';
import { uploadImage } from '../api/uploadApi';
import './ImageUploadField.css';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function ImageUploadField({
  id,
  label,
  value,
  onChange,
  className = '',
  onUploadStateChange,
  disabled = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const hasValidType = ALLOWED_IMAGE_TYPES.includes(file.type);
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.test(file.name);
    if (!hasValidType || !hasValidExtension || file.size > MAX_IMAGE_BYTES) {
      setError(file.size > MAX_IMAGE_BYTES
        ? 'Image must be 5MB or smaller.'
        : 'Choose a JPG, JPEG, PNG, or WEBP image.');
      input.value = '';
      return;
    }

    setError('');
    setIsUploading(true);
    onUploadStateChange?.(id, true);
    try {
      onChange(await uploadImage(file));
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload image.');
    } finally {
      setIsUploading(false);
      onUploadStateChange?.(id, false);
      input.value = '';
    }
  };

  return (
    <div className={`image-upload-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => {
          setError('');
          onChange(event.target.value);
        }}
        placeholder="/images/photo.jpg or https://example.com/photo.jpg"
        disabled={disabled || isUploading}
      />
      <label htmlFor={`${id}-file`}>Upload an image</label>
      <input
        id={`${id}-file`}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      <p className="image-upload-hint">JPG, JPEG, PNG, or WEBP. Maximum 5MB.</p>
      {isUploading ? <p role="status">Uploading image…</p> : null}
      {error ? <p className="image-upload-error" role="alert">{error}</p> : null}
    </div>
  );
}

export default ImageUploadField;
