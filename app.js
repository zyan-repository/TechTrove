import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectToDatabase } from "./server/db/database.js";
import { router as coursesRouter } from "./server/routes/courses.js";
import { router as creatorsRouter } from "./server/routes/creators.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/static", express.static(join(__dirname, "static")));

// API routes
app.use("/api/courses", coursesRouter);
app.use("/api/creators", creatorsRouter);

// Serve main HTML file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "static", "index.html"));
});

// Fallback to serve index.html for SPA routing
app.use((req, res) => {
  res.sendFile(join(__dirname, "static", "index.html"));
});

// Error handling middleware
app.use((err, req, res) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`TechTrove server is running on http://localhost:${PORT}`);
      console.log("Available API endpoints:");
      console.log("  GET    /api/courses     - Get all courses");
      console.log("  GET    /api/courses/:id - Get single course");
      console.log("  POST   /api/courses     - Create new course");
      console.log("  PUT    /api/courses/:id - Update course");
      console.log("  DELETE /api/courses/:id - Delete course");
      console.log("  GET    /api/creators    - Get all creators");
      console.log("  POST   /api/creators    - Create new creator");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
