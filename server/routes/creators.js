import express from "express";
import { Creator } from "../models/Creator.js";

export const router = express.Router();

// GET /api/creators - Get all creators
router.get("/", async (req, res) => {
  try {
    const creators = await Creator.findAll();
    res.json(creators);
  } catch (error) {
    console.error("Error fetching creators:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/creators - Create new creator
router.post("/", async (req, res) => {
  try {
    const { name, title, bio } = req.body;

    if (!name || !title) {
      return res.status(400).json({
        error: "Missing required fields: name, title",
      });
    }

    const creatorData = {
      name,
      title,
      bio: bio || "",
    };

    const newCreator = await Creator.create(creatorData);
    res.status(201).json(newCreator);
  } catch (error) {
    console.error("Error creating creator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
