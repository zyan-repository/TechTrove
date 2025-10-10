# TechTrove: A Community-Driven Learning Platform

## Project Description

TechTrove is a web platform designed to bridge the gap between aspiring learners and experienced tech professionals. In the current landscape, many people want to learn practical programming skills, while many industry experts (like software engineers and product managers) are looking for ways to share their knowledge, build their influence, or establish a side income. TechTrove provides the marketplace for this exchange.
Creators can publish their educational content (such as blog posts, video series, or project walkthroughs), which can be offered for free or for a fee. Learners can then discover, subscribe to, and learn from this content, which is often more practical and up-to-date than traditional academic materials. The platform will be built using Node.js, Express, MongoDB, and vanilla HTML, CSS, and JavaScript.

## User Personas

- The Ambitious Student: A college student who finds their coursework too theoretical.
- The Industry Expert: A senior software engineer working at a major tech company.
- The Upskilling Professional: An employee in a non-tech role wanting to improve their productivity.
- The Niche Contributor: A product manager with valuable non-coding experience.
- The Lifelong Learner: A developer who wants to keep their skills sharp.

## User Stories

- As a computer science student, I want to find project-based tutorials from industry professionals so I can learn practical, real-world skills that go beyond my university curriculum.
- As a senior software engineer, I want a platform to publish and monetize my technical tutorials so I can build my personal brand and create a side income by sharing my expertise.
- As a professional in marketing, I want to find beginner-friendly courses on topics like GenAI and automation scripts so I can learn practical skills to improve my work efficiency.
- As a product manager, I want to share my experience in project management and software development lifecycles so I can contribute to the community and help developers understand the business side of tech.
- As a developer, I want to subscribe to creators who specialize in new technologies so I can stay up-to-date with the latest industry trends.

## Features

1. A main page where anyone can view all available courses.
2. Course Management: An admin or creator can create, read, update, and delete courses (CRUD for the courses collection). This will be handled through a simple admin interface.
3. Creator Management: An admin can create, read, update, and delete creators (CRUD for the creators collection). This is the second collection required by the rubric. Each course will be linked to a creator.
4. View Course Details: Users can click on a course from the catalog to see its full description and content.

## Technical Architecture

The application will be a Single Page Application with a RESTful API backend.

- Frontend (Client-Side):
  - Technology: Vanilla HTML5, CSS3, and JavaScript.
  - Responsibility: All rendering and DOM manipulation will be handled by client-side JavaScript. It will fetch data from the backend API and dynamically build the course catalog and detail pages.

* Backend (Server-Side):
  - Technology: Node.js with the Express framework.
  - Responsibility: Provide a RESTful API for all CRUD operations on courses and creators.
  - API Endpoints:
    - GET /api/courses: Retrieves all courses.
    * GET /api/courses/:id: Retrieves a single course.
    * POST /api/courses: Creates a new course (implements a form).
    * PUT /api/courses/:id: Updates an existing course.
    * DELETE /api/courses/:id: Deletes a course.
    * GET /api/creators: Retrieves all creators.
    * POST /api/creators: Creates a new creator.
    * PUT /api/creators/:id: Updates a creator.
    * DELETE /api/creators/:id: Deletes a creator.
* Database:
  - Technology: MongoDB (using the official mongodb driver, not Mongoose).
  - Responsibility: Store all course and creator data.

## Data Models (MongoDB Collections)

The database will contain two collections to meet the project requirements.
a. `creators` Collection
Stores information about the content creators.

```
{
  "\_id": "ObjectId('...')",
  "name": "John",
  "title": "Senior Software Engineer at TechCorp",
  "bio": "Expert in cloud computing and backend development with 10+ years of experience.",
  "createdAt": "ISODate('...')"
}
```

b. `courses` Collection
Stores the educational content published on the platform.

```
{
  "\_id": "ObjectId('...')",
  "creatorName": "John",
  "title": "Mastering Node.js for Beginners",
  "description": "A comprehensive video series covering the fundamentals of Node.js, from setting up your environment to building your first API.",
  "contentType": "video",
  "isFree": true,
  "content": "https://www.youtube.com/embed/example_video_id",
  "createdAt": "ISODate('...')"
}
```

## Design Mockups

Mockup 1: The Course Catalog (Homepage)

```
+------------------------------------------------------+
| TechTrove [Add New Course]|
+------------------------------------------------------+
| |
| +---------------------+ +---------------------+ |
| | Course Title 1 | | Course Title 2 | |
| | by Creator A | | by Creator B | |
| | A short desc... | | A short desc... | |
| +---------------------+ +---------------------+ |
| |
| +---------------------+ +---------------------+ |
| | Course Title 3 | | Course Title 4 | |
| | by Creator A | | by Creator C | |
| | A short desc... | | A short desc... | |
| +---------------------+ +---------------------+ |
| |
+------------------------------------------------------+
```

Mockup 2: Course Detail Page

```
+------------------------------------------------------+
| TechTrove |
+------------------------------------------------------+
| |
| # Mastering Node.js for Beginners |
| by John, Senior Software Engineer |
| |
| +-------------------------------------------------+ |
| | | |
| | [ Embedded YouTube Video Player ] | |
| | | |
| +-------------------------------------------------+ |
| |
| A comprehensive video series covering the... |
| |
| [ Edit Course ] [ Delete Course ] |
| |
+------------------------------------------------------+
```

Mockup 3: Add/Edit Course Form (Admin/Creator View)

```
+------------------------------------------------------+
| TechTrove |
+------------------------------------------------------+
| |
| ## Create a New Course |
| |
| Title: |
| [ Mastering Node.js... ] |
| |
| Description: |
| [ A comprehensive video series... ] |
| |
| Creator: [ John ] |
| |
| Content URL: |
| [ https://youtube.com/... ] |
| |
| [x] Is this course free? |
| |
| [ Submit ] |
| |
+------------------------------------------------------+
```
