const STORAGE_PREFIX = 'siteSection:';

export const DEFAULT_SITE_SECTIONS = {
  hero: {
    heading: 'A Stage For Every Story',
    subheading: "Where India's performing arts meet contemporary creation.",
    ctaText: 'Know more',
    ctaHref: '#about',
    video: '/Videos/stock-footage-slow-motion-portrait-of-three-expressive-young-indian-dancers-performing-folk-dance-choreography-in.mp4',
  },
  showtime: {
    heading: 'Showtime',
    items: [
      {
        title: 'Romeo & Juliet',
        image: '/images/juliet.png',
        text: 'When Romeo of the Montagues locks eyes with Juliet of the Capulets, it is love at first sight .. and war at first breath.',
        moreInfoHref: '#showtime',
        bookHref: '/booking/romeo-juliet',
      },
      {
        title: 'Zen Katha',
        image: '/images/Zen.png',
        text: 'A fascinating story of Bodhidharma, a Prince from the ancient kingdom of Kanchi, who was the true founder of Zen and the Martial Arts.',
        moreInfoHref: '#showtime',
        bookHref: '/booking/zen-katha',
      },
    ],
  },
  performanceSpaces: {
    heading: 'Performance Spaces',
    spaces: {
      stage: {
        label: 'Stage',
        image: '/images/performance-theatre.jpg',
        items: [
          {
            title: 'Aditya Birla Theatre',
            text: 'A world-class proscenium theatre crafted for drama, dance, and productions. Its design balances acoustics, sightlines, and comfort, giving both artist and audience an immersive experience.',
          },
          {
            title: 'Mini Theatre',
            text: 'An intimate performance space for recitals, readings, and smaller showcases.',
          },
        ],
      },
      studio: {
        label: 'Studio',
        image: '/images/performance-studio.jpg',
        items: [
          {
            title: 'Rehearsal Studio',
            text: 'A professional practice space for ensembles, actors, and choreographers. These studios are designed for preparation and experimentation.',
          },
          {
            title: 'Studios',
            text: 'A professional practice space for ensembles, actors, and choreographers.',
          },
          {
            title: 'Audio Recording Studios',
            text: 'State-of-the-art studios equipped for high-quality sound production, dubbing, and post-production.',
          },
        ],
      },
    },
  },
  legacyLibrary: {
    heading: 'Legacy Library',
    tagline: 'Where the past performs for the future.',
    image: '/images/legacy-library.jpg',
    paragraphs: [
      "Since 1944, the Indian National Theatre has stood alongside India's creative journey, nurturing voices, staging new ideas, and shaping audiences.",
      "The archives trace the milestones, memories, and people who built one of India's longest-standing cultural legacies.",
    ],
    buttonText: 'KNOW MORE',
    buttonHref: '#contact',
  },
  culinaryExperience: {
    heading: 'Culinary Experience',
    items: [
      {
        image: '/images/culinary-cafe.jpg',
        title: 'All-Day Café',
        text: 'A relaxed space for conversations, where artists and audiences share a dialogue over coffee.',
      },
      {
        image: '/images/culinary-restaurant.jpg',
        title: 'Fine Dining Restaurant',
        text: 'An elegant dining experience that complements the cultural ambience and indulgence of the Centre.',
      },
    ],
  },
};

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeContent = (key, content) => {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error(`Invalid ${key} section response.`);
  }
  return { ...DEFAULT_SITE_SECTIONS[key], ...content };
};

const readLocalSection = (key) => {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (stored === null) {
    const initial = { id: createId(), ...DEFAULT_SITE_SECTIONS[key] };
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);
    return { ...normalizeContent(key, parsed), id: parsed.id || createId() };
  } catch (error) {
    console.error(`Unable to read ${key} content from localStorage.`, error);
    throw new Error(`Saved ${key} content is invalid.`);
  }
};

const request = async (key, options = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`/api/sections/${key}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Site sections API returned an invalid response.');
      }
    }
    if (!response.ok) {
      const error = new Error(data.message || 'Unable to load site section.');
      error.status = response.status;
      throw error;
    }
    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const isNetworkError = (error) =>
  error?.name === 'TypeError' ||
  error?.name === 'AbortError' ||
  /failed to fetch|networkerror|load failed|aborted/i.test(error?.message || '');

export const fetchSiteSection = async (key) => {
  if (!Object.hasOwn(DEFAULT_SITE_SECTIONS, key)) {
    throw new Error(`Unknown site section: ${key}`);
  }
  try {
    const response = await request(key);
    return { ...normalizeContent(key, response.content), id: response.id || key };
  } catch (error) {
    if (!isNetworkError(error) && error?.status !== 404) {
      throw error;
    }
    console.warn(`Site sections API unavailable; loading ${key} from localStorage.`, error);
    return readLocalSection(key);
  }
};

export const saveSiteSection = async (key, content) => {
  if (!Object.hasOwn(DEFAULT_SITE_SECTIONS, key)) {
    throw new Error(`Unknown site section: ${key}`);
  }
  const normalized = normalizeContent(key, content);
  try {
    const response = await request(key, {
      method: 'PUT',
      body: JSON.stringify({ content: normalized }),
    });
    return { ...normalizeContent(key, response.content), id: response.id || key };
  } catch (error) {
    if (!isNetworkError(error) && error?.status !== 404) {
      throw error;
    }
    console.warn(`Site sections API unavailable; saving ${key} to localStorage.`, error);
    const saved = { ...normalized, id: content.id || createId() };
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(saved));
    return saved;
  }
};
