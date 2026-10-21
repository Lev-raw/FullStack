const express = require("express");
const router = express.Router();

const {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

// GET - Get About section
router.get("/", getAbout);

// POST - Create About section
router.post("/", createAbout);

// PUT - Update About section
router.put("/:id", updateAbout);

// DELETE - Delete About section
router.delete("/:id", deleteAbout);

module.exports = router;