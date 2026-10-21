const STORAGE_KEY = 'aboutSection';

export const DEFAULT_ABOUT = {
  title: `At the heart of the Centre's journey is Smt. Rajashree Birla, Chairperson of the Aditya Birla Centre for Community Initiatives and Rural Development. Her leadership bridges philanthropy and culture, guided by a belief that service is not obligation but expression.

Inspired by the Gandhian principle of trusteeship, she views art as a public trust, something to be protected, shared, and passed forward. Her commitment continues the vision of her late husband, Shri Aditya Vikram Birla, whose deep love for performing arts inspired generations of artists.

Under her stewardship, INTABCAPA grows as a living heritage, a place where the roots of tradition and the bloom of innovation perform in perfect synchrony.`,
  leadname: 'Smt. Rajashree Birla',
  designation: 'Founder & Chairperson',
  image: '/images/rajeshree.jpeg',
  sagaTitle: 'INTABCAPA SAGA',
  sagaText: "INTABCAPA (INT Aditya Birla Centre for Performing Arts) is a living cultural space where India's rich artistic heritage meets contemporary expression.",
  sagaTextSecond: 'Built on a legacy of patronage, the Centre brings together performance, learning, and community to create meaningful encounters with the arts.',
  buttonText: 'KNOW MORE',
  buttonHref: '#legacy',
};


// Generate ID for localStorage fallback
const createId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `about-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
};


// Convert backend/local data into a common frontend format
export const normalizeAbout = (about) => {
  if (!about || typeof about !== 'object') {
    return null;
  }

  const id = String(about.id || about._id || '').trim();
  const title = String(about.title ?? DEFAULT_ABOUT.title).trim();
  const leadname = String(about.leadname || about.leadName || about.Leadname || DEFAULT_ABOUT.leadname).trim();
  const designation = String(about.designation ?? DEFAULT_ABOUT.designation).trim();

  if (!id && !title && !leadname && !designation) {
    return null;
  }

  return {
    id: id || createId(),
    title,
    leadname,
    designation,
    image: String(about.image ?? DEFAULT_ABOUT.image).trim(),
    sagaTitle: String(about.sagaTitle ?? DEFAULT_ABOUT.sagaTitle).trim(),
    sagaText: String(about.sagaText ?? DEFAULT_ABOUT.sagaText).trim(),
    sagaTextSecond: String(about.sagaTextSecond ?? DEFAULT_ABOUT.sagaTextSecond).trim(),
    buttonText: String(about.buttonText ?? DEFAULT_ABOUT.buttonText).trim(),
    buttonHref: String(about.buttonHref ?? DEFAULT_ABOUT.buttonHref).trim(),
  };
};


// Read About section from localStorage
const readLocalAbout = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // First time → save sample data
    if (raw === null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ id: 'about-1', ...DEFAULT_ABOUT })
      );

      return normalizeAbout({ id: 'about-1', ...DEFAULT_ABOUT });
    }

    const parsed = JSON.parse(raw);

    return normalizeAbout(parsed);

  } catch (error) {
    console.error(
      'Unable to read About section from localStorage',
      error
    );

    return null;
  }
};


// Save About section to localStorage
const writeLocalAbout = (about) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(about)
  );
};


// Convert API response into JSON
const toJson = async (response) => {
  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        'About API returned an invalid response.'
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || 'Request failed'
    );
  }

  return data;
};


// Call backend API
const requestAboutApi = async (path = '', options = {}) => {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(
    () => controller.abort(),
    5000
  );

  try {
    const response = await fetch(
      `/api/about${path}`,
      {
        ...options,
        signal: controller.signal,
      }
    );

    return await toJson(response);

  } finally {
    window.clearTimeout(timeoutId);
  }
};


// Check whether API is unreachable
const isApiUnreachable = (error) => {
  const message = String(
    error?.message || ''
  );

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


// Try API first.
// If API is unavailable → localStorage
const withAboutStorage = async (
  apiAction,
  localAction
) => {
  try {
    return await apiAction();

  } catch (error) {

    if (!isApiUnreachable(error)) {
      throw error;
    }

    console.warn(
      'About API unavailable. Using localStorage.',
      error
    );

    return localAction();
  }
};


// ==============================
// GET ABOUT
// ==============================

export const fetchAbout = async () =>
  withAboutStorage(

    async () => {
      const data = await requestAboutApi('');

      return normalizeAbout(data);
    },

    readLocalAbout
  );


// ==============================
// CREATE ABOUT
// ==============================

export const createAbout = async (payload) =>
  withAboutStorage(

    async () => {
      const data = await requestAboutApi('', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      return normalizeAbout(data);
    },

    () => {
      const newAbout = normalizeAbout({
        ...payload,
        id: createId(),
      });

      writeLocalAbout(newAbout);

      return newAbout;
    }
  );


// ==============================
// UPDATE ABOUT
// ==============================

export const updateAbout = async (
  aboutId,
  payload
) =>
  withAboutStorage(

    async () => {
      const data = await requestAboutApi(
        `/${aboutId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      return normalizeAbout(data);
    },

    () => {
      const about = readLocalAbout();

      if (!about || about.id !== aboutId) {
        throw new Error(
          'About section not found'
        );
      }

      const updatedAbout = normalizeAbout({
        ...about,
        ...payload,
        id: aboutId,
      });

      writeLocalAbout(updatedAbout);

      return updatedAbout;
    }
  );


// ==============================
// DELETE ABOUT
// ==============================

export const deleteAbout = async (aboutId) =>
  withAboutStorage(

    async () =>
      requestAboutApi(
        `/${aboutId}`,
        {
          method: 'DELETE',
        }
      ),

    () => {
      const about = readLocalAbout();

      if (!about || about.id !== aboutId) {
        throw new Error(
          'About section not found'
        );
      }

      localStorage.removeItem(
        STORAGE_KEY
      );

      return {
        message:
          'About section deleted successfully',
      };
    }
  );