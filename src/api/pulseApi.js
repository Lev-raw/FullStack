const STORAGE_KEY = 'pulsePosts';

const SAMPLE_POSTS = [
  {
    id: 'pulse-1',
    title: 'Rewa City and Theater Activities',
    date: '2022-06-08',
    image: '/images/pluse1.png',
    readMoreUrl: '/pulse/rewa-city',
  },
  {
    id: 'pulse-2',
    title: 'Rangkarma is slowly getting back on track?',
    date: '2022-04-11',
    image: '/images/pluse2.png',
    readMoreUrl: '/pulse/rangkarma',
  },
  {
    id: 'pulse-3',
    title: 'Rangkarma is slowly getting back on track?',
    date: '2022-02-14',
    image: '/images/pluse3.png',
    readMoreUrl: '/pulse/rangkarma-2',
  },
];

const formatDateValue = (value) => {
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

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `pulse-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const normalizePulsePost = (post) => {
  if (!post || typeof post !== 'object') {
    return null;
  }

  const id = String(post.id || post._id || '').trim();
  const title = String(post.title || '').trim();
  const image = String(post.image || '').trim();
  const date = formatDateValue(post.date);

  if (!id && !title && !image) {
    return null;
  }

  return {
    id: id || createId(),
    title,
    date,
    image,
    readMoreUrl: String(post.readMoreUrl || '#').trim() || '#',
  };
};

const sortPostsDescending = (posts) =>
  [...posts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

const readLocalPosts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_POSTS));
      return sortPostsDescending(SAMPLE_POSTS.map(normalizePulsePost).filter(Boolean));
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortPostsDescending(parsed.map(normalizePulsePost).filter(Boolean));
  } catch (error) {
    console.error('Unable to read Pulse posts from localStorage', error);
    return [];
  }
};

const writeLocalPosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const toJson = async (response) => {
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Pulse API returned an invalid response.');
    }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

const requestPulseApi = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`/api/pulse${path}`, {
      ...options,
      signal: controller.signal,
    });
    return await toJson(response);
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const isApiUnreachable = (error) => {
  const message = String(error?.message || '');
  return (
    error?.name === 'TypeError' ||
    error?.name === 'AbortError' ||
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('invalid response') ||
    message.includes('Load failed') ||
    message.includes('aborted')
  );
};

const withPulseStorage = async (apiAction, localAction) => {
  try {
    return await apiAction();
  } catch (error) {
    if (!isApiUnreachable(error)) {
      throw error;
    }

    console.warn('Pulse API unavailable. Using localStorage.', error);
    return localAction();
  }
};

export const fetchPulsePosts = async () =>
  withPulseStorage(
    async () => {
      const data = await requestPulseApi('');
      const posts = Array.isArray(data) ? data : [];
      return sortPostsDescending(posts.map(normalizePulsePost).filter(Boolean));
    },
    readLocalPosts,
  );

export const fetchPulsePostById = async (postId) =>
  withPulseStorage(
    async () => normalizePulsePost(await requestPulseApi(`/${postId}`)),
    () => {
      const post = readLocalPosts().find((item) => item.id === postId);
      if (!post) {
        throw new Error('Pulse post not found');
      }
      return post;
    },
  );

export const createPulsePost = async (payload) =>
  withPulseStorage(
    async () =>
      normalizePulsePost(
        await requestPulseApi('', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ),
    () => {
      const posts = readLocalPosts();
      const newPost = normalizePulsePost({
        ...payload,
        id: createId(),
      });
      writeLocalPosts([newPost, ...posts]);
      return newPost;
    },
  );

export const updatePulsePost = async (postId, payload) =>
  withPulseStorage(
    async () =>
      normalizePulsePost(
        await requestPulseApi(`/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ),
    () => {
      const posts = readLocalPosts();
      const postIndex = posts.findIndex((item) => item.id === postId);

      if (postIndex === -1) {
        throw new Error('Pulse post not found');
      }

      const updatedPost = normalizePulsePost({
        ...posts[postIndex],
        ...payload,
        id: postId,
      });
      const nextPosts = [...posts];
      nextPosts[postIndex] = updatedPost;
      writeLocalPosts(nextPosts);
      return updatedPost;
    },
  );

export const deletePulsePost = async (postId) =>
  withPulseStorage(
    async () => requestPulseApi(`/${postId}`, { method: 'DELETE' }),
    () => {
      const posts = readLocalPosts();
      const nextPosts = posts.filter((item) => item.id !== postId);

      if (nextPosts.length === posts.length) {
        throw new Error('Pulse post not found');
      }

      writeLocalPosts(nextPosts);
      return { message: 'Pulse post deleted successfully' };
    },
  );
