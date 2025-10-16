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

// PUT /api/creators/:id - Update creator
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData._id;
    delete updateData.createdAt;

    const { name, title, bio } = updateData;

    if (!name || !title) {
      return res.status(400).json({
        error: "Missing required fields: name, title",
      });
    }

    const cleanUpdateData = {
      name,
      title,
      bio: bio || "",
    };

    const result = await Creator.update(id, cleanUpdateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Creator not found" });
    }

    const updatedCreator = await Creator.findById(id);
    res.json(updatedCreator);
  } catch (error) {
    console.error("Error updating creator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/creators/:id - Delete creator
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Creator.delete(id);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Creator not found" });
    }

    res.json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error("Error deleting creator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
