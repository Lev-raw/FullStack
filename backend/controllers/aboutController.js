const mongoose = require("mongoose");
const About = require("../models/AboutSection");

const DEFAULT_ABOUT = {
  title: `At the heart of the Centre's journey is Smt. Rajashree Birla, Chairperson of the Aditya Birla Centre for Community Initiatives and Rural Development. Her leadership bridges philanthropy and culture, guided by a belief that service is not obligation but expression.

Inspired by the Gandhian principle of trusteeship, she views art as a public trust, something to be protected, shared, and passed forward. Her commitment continues the vision of her late husband, Shri Aditya Vikram Birla, whose deep love for performing arts inspired generations of artists.

Under her stewardship, INTABCAPA grows as a living heritage, a place where the roots of tradition and the bloom of innovation perform in perfect synchrony.`,
  leadname: "Smt. Rajashree Birla",
  designation: "Founder & Chairperson",
  image: "/images/rajeshree.jpeg",
  sagaTitle: "INTABCAPA SAGA",
  sagaText: "INTABCAPA (INT Aditya Birla Centre for Performing Arts) is a living cultural space where India's rich artistic heritage meets contemporary expression.",
  sagaTextSecond: "Built on a legacy of patronage, the Centre brings together performance, learning, and community to create meaningful encounters with the arts.",
  buttonText: "KNOW MORE",
  buttonHref: "#legacy",
};

const memoryContent = [{ _id: "about-1", ...DEFAULT_ABOUT }];
const isMongoConnected = () => mongoose.connection.readyState === 1;

const getAboutPayload = (body = {}) => ({
  ...(body.title !== undefined && { title: body.title }),
  ...((body.leadname ?? body.leadName ?? body.Leadname) !== undefined && {
    leadname: body.leadname ?? body.leadName ?? body.Leadname,
  }),
  ...(body.designation !== undefined && { designation: body.designation }),
  ...(body.image !== undefined && { image: body.image }),
  ...(body.sagaTitle !== undefined && { sagaTitle: body.sagaTitle }),
  ...(body.sagaText !== undefined && { sagaText: body.sagaText }),
  ...(body.sagaTextSecond !== undefined && { sagaTextSecond: body.sagaTextSecond }),
  ...(body.buttonText !== undefined && { buttonText: body.buttonText }),
  ...(body.buttonHref !== undefined && { buttonHref: body.buttonHref }),
});

const isComplete = (content) =>
  Object.keys(DEFAULT_ABOUT).every((key) => typeof content[key] === "string" && content[key].trim());

const getAbout = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const about = await About.findOneAndUpdate(
        {},
        { $setOnInsert: DEFAULT_ABOUT },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      return res.json(about);
    }

    return res.json(memoryContent[0]);
  } catch (error) {
    console.error("Error fetching About section:", error);
    return res.status(500).json({ message: "Failed to fetch About section" });
  }
};

const createAbout = async (req, res) => {
  try {
    const payload = getAboutPayload(req.body);
    if (!isComplete(payload)) {
      return res.status(400).json({ message: "All About section fields are required" });
    }

    if (isMongoConnected()) {
      const existing = await About.findOne();
      const about = existing
        ? await About.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
        : await About.create(payload);
      return res.status(existing ? 200 : 201).json(about);
    }

    memoryContent[0] = { ...memoryContent[0], ...payload };
    return res.status(200).json(memoryContent[0]);
  } catch (error) {
    console.error("Error saving About section:", error);
    return res.status(500).json({ message: "Failed to save About section" });
  }
};

const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = getAboutPayload(req.body);
    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: "At least one About section field is required" });
    }

    if (isMongoConnected()) {
      const about = await About.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!about) {
        return res.status(404).json({ message: "About section not found" });
      }
      return res.json(about);
    }

    const index = memoryContent.findIndex((about) => about._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "About section not found" });
    }
    memoryContent[index] = { ...memoryContent[index], ...payload };
    return res.json(memoryContent[index]);
  } catch (error) {
    console.error("Error updating About section:", error);
    return res.status(500).json({ message: "Failed to update About section" });
  }
};

const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const about = await About.findByIdAndDelete(id);
      if (!about) {
        return res.status(404).json({ message: "About section not found" });
      }
      return res.json({ message: "About section deleted successfully" });
    }

    const index = memoryContent.findIndex((about) => about._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "About section not found" });
    }
    memoryContent.splice(index, 1, { _id: "about-1", ...DEFAULT_ABOUT });
    return res.json({ message: "About section reset successfully" });
  } catch (error) {
    console.error("Error deleting About section:", error);
    return res.status(500).json({ message: "Failed to delete About section" });
  }
};

module.exports = { getAbout, createAbout, updateAbout, deleteAbout };
