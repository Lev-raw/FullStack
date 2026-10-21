const mongoose = require('mongoose');
const SiteSection = require('../models/SiteSection');

const DEFAULT_SITE_SECTIONS = {
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
        bookHref: '#contact',
      },
      {
        title: 'Zen Katha',
        image: '/images/Zen.png',
        text: 'A fascinating story of Bodhidharma, a Prince from the ancient kingdom of Kanchi, who was the true founder of Zen and the Martial Arts.',
        moreInfoHref: '#showtime',
        bookHref: '#contact',
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

const isMongoConnected = () => mongoose.connection.readyState === 1;
const isValidSection = (key) => Object.hasOwn(DEFAULT_SITE_SECTIONS, key);
const memorySections = Object.fromEntries(
  Object.entries(DEFAULT_SITE_SECTIONS).map(([key, content]) => [
    key,
    JSON.parse(JSON.stringify(content)),
  ]),
);

const getSection = async (req, res) => {
  const { key } = req.params;
  if (!isValidSection(key)) {
    return res.status(404).json({ message: 'Site section not found' });
  }

  try {
    if (isMongoConnected()) {
      const section = await SiteSection.findOneAndUpdate(
        { key },
        { $setOnInsert: { content: DEFAULT_SITE_SECTIONS[key] } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      return res.json({ id: section._id, content: section.content });
    }

    return res.json({ id: key, content: memorySections[key] });
  } catch (error) {
    console.error(`Error fetching ${key} site section:`, error);
    return res.status(500).json({ message: 'Failed to fetch site section' });
  }
};

const updateSection = async (req, res) => {
  const { key } = req.params;
  const { content } = req.body || {};
  if (!isValidSection(key)) {
    return res.status(404).json({ message: 'Site section not found' });
  }
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return res.status(400).json({ message: 'Section content must be an object' });
  }

  try {
    if (isMongoConnected()) {
      const section = await SiteSection.findOneAndUpdate(
        { key },
        { $set: { content } },
        { new: true, upsert: true, runValidators: true },
      );
      return res.json({ id: section._id, content: section.content });
    }

    memorySections[key] = content;
    return res.json({ id: key, content: memorySections[key] });
  } catch (error) {
    console.error(`Error saving ${key} site section:`, error);
    return res.status(500).json({ message: 'Failed to save site section' });
  }
};

module.exports = { getSection, updateSection };
