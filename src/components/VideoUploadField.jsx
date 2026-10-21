import { useState } from 'react';
import { uploadVideo } from '../api/uploadApi';
import './ImageUploadField.css';

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_VIDEO_EXTENSIONS = /\.(mp4|webm)$/i;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

function VideoUploadField({
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
    if (!file) return;

    const hasValidType = ALLOWED_VIDEO_TYPES.includes(file.type);
    const hasValidExtension = ALLOWED_VIDEO_EXTENSIONS.test(file.name);
    if (!hasValidType || !hasValidExtension || file.size > MAX_VIDEO_BYTES) {
      setError(file.size > MAX_VIDEO_BYTES
        ? 'Video must be 100MB or smaller.'
        : 'Choose an MP4 or WEBM video.');
      input.value = '';
      return;
    }

    setError('');
    setIsUploading(true);
    onUploadStateChange?.(id, true);
    try {
      onChange(await uploadVideo(file));
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload video.');
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
        placeholder="/uploads/video.mp4 or https://example.com/video.mp4"
        disabled={disabled || isUploading}
      />
      <label htmlFor={`${id}-file`}>Upload a video</label>
      <input
        id={`${id}-file`}
        type="file"
        accept="video/mp4,video/webm,.mp4,.webm"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      <p className="image-upload-hint">MP4 or WEBM. Maximum 100MB.</p>
      {isUploading ? <p role="status">Uploading video…</p> : null}
      {error ? <p className="image-upload-error" role="alert">{error}</p> : null}
    </div>
  );
}

export default VideoUploadField;
