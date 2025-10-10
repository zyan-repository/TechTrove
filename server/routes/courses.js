import express from "express";
import { Course } from "../models/Course.js";

export const router = express.Router();

// GET /api/courses - Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/courses/:id - Get single course
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/courses - Create new course
router.post("/", async (req, res) => {
  try {
    const { title, description, creatorName, contentType, isFree, content } =
      req.body;

    if (!title || !description || !creatorName) {
      return res.status(400).json({
        error: "Missing required fields: title, description, creatorName",
      });
    }

    const courseData = {
      title,
      description,
      creatorName,
      contentType: contentType || "video",
      isFree: isFree || false,
      content: content || "",
    };

    const newCourse = await Course.create(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/courses/:id - Update course
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating immutable fields
    delete updateData._id;
    delete updateData.createdAt;

    const result = await Course.update(id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await Course.findById(id);
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Course.delete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
