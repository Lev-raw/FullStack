export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/uploads/image', {
    method: 'POST',
    body: formData,
  });
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Image upload API returned an invalid response.');
    }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Unable to upload image.');
  }
  if (typeof data.url !== 'string' || !data.url.startsWith('/uploads/')) {
    throw new Error('Image upload API returned an invalid image URL.');
  }

  return data.url;
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  let response;
  try {
    response = await fetch('/api/uploads/video', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach the CMS upload service. Make sure the backend is running, then try again.');
    }
    throw error;
  }
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Video upload API returned an invalid response.');
    }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Unable to upload video.');
  }
  if (typeof data.url !== 'string' || !data.url.startsWith('/uploads/')) {
    throw new Error('Video upload API returned an invalid video URL.');
  }

  return data.url;
};
