const mongoose = require('mongoose');
const PulsePost = require('../models/PulsePost');

const memoryPosts = [
  {
    _id: 'pulse-1',
    title: 'Rewa City and Theater Activities',
    date: '2022-06-08',
    image: '/images/pluse1.png',
    readMoreUrl: '/pulse/rewa-city',
  },
  {
    _id: 'pulse-2',
    title: 'Rangkarma is slowly getting back on track?',
    date: '2022-04-11',
    image: '/images/pluse2.png',
    readMoreUrl: '/pulse/rangkarma',
  },
  {
    _id: 'pulse-3',
    title: 'Rangkarma is slowly getting back on track?',
    date: '2022-02-14',
    image: '/images/pluse3.png',
    readMoreUrl: '/pulse/rangkarma-2',
  },
];

const sortPostsDescending = (posts) =>
  [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

const formatDateValue = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().split('T')[0];
};

const normalizePost = (post) => {
  const id = String(post._id || post.id || '');

  return {
    id,
    _id: id,
    title: post.title,
    date: formatDateValue(post.date),
    image: post.image,
    readMoreUrl: post.readMoreUrl || '#',
  };
};

const useMongo = () => mongoose.connection.readyState === 1;

const seedPulsePosts = async () =>  {
  if (!useMongo()) {
    return;
  }

  const count = await PulsePost.countDocuments({});
  if (count > 0) {
    return;
  }

  await PulsePost.insertMany(
    memoryPosts.map(({ _id, ...post }) => ({
      ...post,
      date: new Date(post.date),
    })),
  );
};

const getAllPulsePosts = async (req, res) => {
  try {
    if (useMongo()) {
      await seedPulsePosts();
      const posts = await PulsePost.find({}).sort({ date: -1 });
      return res.json(posts.map(normalizePost));
    }

    return res.json(sortPostsDescending(memoryPosts).map(normalizePost));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch pulse posts', error: error.message });
  }
};

const getPulsePostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (useMongo()) {
      const post = await PulsePost.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Pulse post not found' });
      }

      return res.json(normalizePost(post));
    }

    const post = memoryPosts.find((item) => item._id === id);
    if (!post) {
      return res.status(404).json({ message: 'Pulse post not found' });
    }

    return res.json(normalizePost(post));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch pulse post', error: error.message });
  }
};

const createPulsePost = async (req, res) => {
  try {
    const { title, date, image, readMoreUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    if (!image || !image.trim()) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const postData = {
      title: title.trim(),
      date,
      image: image.trim(),
      readMoreUrl: readMoreUrl || '#',
    };

    if (useMongo()) {
      const post = await PulsePost.create(postData);
      return res.status(201).json(normalizePost(post));
    }

    const newPost = {
      _id: `pulse-${Date.now()}`,
      ...postData,
    };
    memoryPosts.unshift(newPost);
    return res.status(201).json(normalizePost(newPost));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create pulse post', error: error.message });
  }
};

const updatePulsePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, image, readMoreUrl } = req.body;

    if (useMongo()) {
      const post = await PulsePost.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Pulse post not found' });
      }

      if (title !== undefined) post.title = title.trim();
      if (date !== undefined) post.date = date;
      if (image !== undefined) post.image = image.trim();
      if (readMoreUrl !== undefined) post.readMoreUrl = readMoreUrl || '#';

      await post.save();
      return res.json(normalizePost(post));
    }

    const postIndex = memoryPosts.findIndex((item) => item._id === id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Pulse post not found' });
    }

    const currentPost = memoryPosts[postIndex];
    const updatedPost = {
      ...currentPost,
      title: title?.trim() || currentPost.title,
      date: date || currentPost.date,
      image: image?.trim() || currentPost.image,
      readMoreUrl: readMoreUrl || currentPost.readMoreUrl || '#',
    };

    memoryPosts[postIndex] = updatedPost;
    return res.json(normalizePost(updatedPost));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update pulse post', error: error.message });
  }
};

const deletePulsePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (useMongo()) {
      const deletedPost = await PulsePost.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Pulse post not found' });
      }

      return res.json({ message: 'Pulse post deleted successfully' });
    }

    const postIndex = memoryPosts.findIndex((item) => item._id === id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Pulse post not found' });
    }

    memoryPosts.splice(postIndex, 1);
    return res.json({ message: 'Pulse post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete pulse post', error: error.message });
  }
};

module.exports = {
  getAllPulsePosts,
  getPulsePostById,
  createPulsePost,
  updatePulsePost,
  deletePulsePost,
};
