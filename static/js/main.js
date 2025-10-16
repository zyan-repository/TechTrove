class TechTroveApp {
  constructor() {
    this.currentPage = "catalog";
    this.courses = [];
    this.creators = [];
    this.currentCourse = null;
    this.init();
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  async init() {
    this.setupEventListeners();
    await this.loadData();
    this.showPage("catalog");
  }

  setupEventListeners() {
    // Header buttons
    document.getElementById("add-creator-btn").addEventListener("click", () => {
      this.showCreatorForm();
    });

    document.getElementById("update-creator-btn").addEventListener("click", () => {
      this.showCreatorUpdateForm();
    });

    document.getElementById("delete-creator-btn").addEventListener("click", () => {
      this.showCreatorDeleteForm();
    });

    document.getElementById("add-course-btn").addEventListener("click", () => {
      this.showCourseForm();
    });

    // Back buttons
    document.getElementById("back-to-catalog").addEventListener("click", () => {
      this.showPage("catalog");
    });

    // Search and filters
    document.getElementById("search-input").addEventListener("input", () => {
      this.filterCourses();
    });

    document.getElementById("type-filter").addEventListener("change", () => {
      this.filterCourses();
    });

    // Course detail actions
    document.getElementById("edit-course-btn").addEventListener("click", () => {
      this.editCourse();
    });

    document
      .getElementById("delete-course-btn")
      .addEventListener("click", () => {
        this.deleteCourse();
      });

    // Close dynamic content when clicking outside
    document
      .getElementById("dynamic-content")
      .addEventListener("click", (e) => {
        if (e.target.id === "dynamic-content") {
          this.hideDynamicContent();
        }
      });
  }

  async loadData() {
    try {
      this.showLoading(true);

      const [coursesResponse, creatorsResponse] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/creators"),
      ]);

      if (!coursesResponse.ok || !creatorsResponse.ok) {
        throw new Error("Failed to load data");
      }

      this.courses = await coursesResponse.json();
      this.creators = await creatorsResponse.json();

      this.renderCourses();
    } catch (error) {
      console.error("Error loading data:", error);
      this.showToast("Failed to load data", "error");
    } finally {
      this.showLoading(false);
    }
  }

  showPage(page) {
    // Hide all pages
    document.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active");
    });

    // Show the selected page
    document.getElementById(`${page}-page`).classList.add("active");
    this.currentPage = page;

    // Load data if needed
    if (page === "catalog" && this.courses.length === 0) {
      this.loadData();
    }
  }

  renderCourses() {
    const grid = document.getElementById("courses-grid");
    grid.innerHTML = "";

    this.courses.forEach((course) => {
      const card = this.createCourseCard(course);
      grid.appendChild(card);
    });
  }

  createCourseCard(course) {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
            <div class="course-card-header">
                <h3 class="course-title">${this.escapeHtml(course.title)}</h3>
                <div class="course-meta">
                    <span class="course-type ${course.isFree ? "course-free" : ""}">
                        ${course.isFree ? "Free" : "Paid"} • ${this.escapeHtml(course.contentType)}
                    </span>
                </div>
            </div>
            <div class="course-card-body">
                <p class="course-description">${this.escapeHtml(course.description)}</p>
                <p class="course-creator">by ${this.escapeHtml(course.creatorName || "Unknown Creator")}</p>
            </div>
        `;

    card.addEventListener("click", () => {
      this.showCourseDetail(course);
    });

    return card;
  }

  async showCourseDetail(course) {
    try {
      this.showLoading(true);

      const response = await fetch(`/api/courses/${course._id}`);
      if (!response.ok) {
        throw new Error("Failed to load course details");
      }

      const courseDetail = await response.json();
      this.currentCourse = courseDetail;
      this.renderCourseDetail(courseDetail);
      this.showPage("course-detail");
    } catch (error) {
      console.error("Error loading course detail:", error);
      this.showToast("Failed to load course details", "error");
    } finally {
      this.showLoading(false);
    }
  }

  renderCourseDetail(course) {
    const content = document.getElementById("course-detail-content");

    // Find the creator from the creators list
    const creator = this.creators.find(
      (c) => c.name === course.creatorName,
    ) || {
      name: course.creatorName || "Unknown Creator",
      title: "N/A",
      bio: "No bio available.",
    };

    content.innerHTML = `
            <div class="course-detail">
                <h1 class="course-detail-title">${this.escapeHtml(course.title)}</h1>
                <div class="course-detail-meta">
                    <span class="course-type ${course.isFree ? "course-free" : ""}">
                        ${course.isFree ? "Free" : "Paid"} • ${this.escapeHtml(course.contentType)}
                    </span>
                    <span class="course-creator">by ${this.escapeHtml(creator ? creator.name : "Unknown Creator")}, ${this.escapeHtml(creator ? creator.title : "")}</span>
                </div>
                
                ${
                  course.content
                    ? `
                    <div class="course-content">
                        ${this.renderContent(course.content, course.contentType)}
                    </div>
                `
                    : ""
                }
                
                <div class="course-description">
                    <h3>Description</h3>
                    <p>${this.escapeHtml(course.description)}</p>
                </div>
            </div>
        `;
  }

  renderContent(content, contentType) {
    if (contentType === "video" && content.includes("youtube.com")) {
      const videoId = this.extractYouTubeId(content);
      if (videoId) {
        return `
                    <div class="video-container">
                        <iframe 
                            width="100%" 
                            height="400" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
      }
    }
    return `<div class="content-text">${this.escapeHtml(content)}</div>`;
  }

  extractYouTubeId(url) {
    const regExp =
      /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  showCreatorForm() {
    const dynamicContent = document.getElementById("dynamic-content");
    dynamicContent.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <button id="close-creator-form" class="btn btn-secondary">×</button>
                    <h2>Add New Creator</h2>
                </div>
                
                <form id="creator-form" class="creator-form">
                    <div class="form-group">
                        <label for="creator-name">Name *</label>
                        <input type="text" id="creator-name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="creator-title">Title *</label>
                        <input type="text" id="creator-title" name="title" required placeholder="e.g., Senior Software Engineer at TechCorp">
                    </div>
                    
                    <div class="form-group">
                        <label for="creator-bio">Bio</label>
                        <textarea id="creator-bio" name="bio" rows="4" placeholder="Expert in cloud computing and backend development with 10+ years of experience."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Add Creator</button>
                        <button type="button" id="cancel-creator-form" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        `;

    // Add event listeners for the new form
    document
      .getElementById("close-creator-form")
      .addEventListener("click", () => {
        this.hideDynamicContent();
      });

    document
      .getElementById("cancel-creator-form")
      .addEventListener("click", () => {
        this.hideDynamicContent();
      });

    document.getElementById("creator-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleCreatorSubmit();
    });

    dynamicContent.classList.remove("hidden");
  }

  async showCourseForm(course = null) {
    const isEdit = course !== null;

    // Ensure creators are loaded
    if (this.creators.length === 0) {
      this.showLoading(true);
      try {
        const response = await fetch("/api/creators");
        if (response.ok) {
          this.creators = await response.json();
        }
      } catch (error) {
        console.error("Error loading creators:", error);
        this.showToast("Failed to load creators", "error");
        return;
      } finally {
        this.showLoading(false);
      }
    }

    const dynamicContent = document.getElementById("dynamic-content");
    dynamicContent.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <button id="close-course-form" class="btn btn-secondary">×</button>
                    <h2>${isEdit ? "Edit Course" : "Create a New Course"}</h2>
                </div>
                
                <form id="course-form" class="course-form">
                    <input type="hidden" id="course-id" name="courseId" value="${course ? course._id : ""}">
                    
                    <div class="form-group">
                        <label for="course-title">Title *</label>
                        <input type="text" id="course-title" name="title" value="${course ? this.escapeHtml(course.title) : ""}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="course-description">Description *</label>
                        <textarea id="course-description" name="description" rows="4" required>${course ? this.escapeHtml(course.description) : ""}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="course-creator">Select Creator *</label>
                        <select id="course-creator" name="creatorName" required>
                            <option value="">Choose a creator...</option>
                            ${this.creators
                              .map(
                                (creator) =>
                                  `<option value="${this.escapeHtml(creator.name)}" ${course && course.creatorName === creator.name ? "selected" : ""}>${this.escapeHtml(creator.name)} - ${this.escapeHtml(creator.title)}</option>`,
                              )
                              .join("")}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="course-content">Content URL</label>
                        <input type="url" id="course-content" name="content" value="${course ? this.escapeHtml(course.content || "") : ""}" placeholder="https://youtube.com/...">
                    </div>
                    
                    <div class="form-group">
                        <label for="course-type">Content Type</label>
                        <select id="course-type" name="contentType">
                            <option value="video" ${course && course.contentType === "video" ? "selected" : ""}>Video</option>
                            <option value="article" ${course && course.contentType === "article" ? "selected" : ""}>Article</option>
                            <option value="tutorial" ${course && course.contentType === "tutorial" ? "selected" : ""}>Tutorial</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="course-free">
                            <input type="checkbox" id="course-free" name="isFree" ${course && course.isFree ? "checked" : ""}>
                            Is this course free?
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${isEdit ? "Update Course" : "Create Course"}</button>
                        <button type="button" id="cancel-course-form" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        `;

    // Add event listeners for the new form
    document
      .getElementById("close-course-form")
      .addEventListener("click", () => {
        this.hideDynamicContent();
      });

    document
      .getElementById("cancel-course-form")
      .addEventListener("click", () => {
        this.hideDynamicContent();
      });

    document.getElementById("course-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleCourseSubmit();
    });

    dynamicContent.classList.remove("hidden");
  }

  hideDynamicContent() {
    document.getElementById("dynamic-content").classList.add("hidden");
  }

  async editCourse() {
    if (!this.currentCourse) return;
    this.showCourseForm(this.currentCourse);
  }

  async deleteCourse() {
    if (!this.currentCourse) return;

    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      this.showLoading(true);

      const response = await fetch(`/api/courses/${this.currentCourse._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      this.showToast("Course deleted successfully!", "success");
      await this.loadData();
      this.showPage("catalog");
    } catch (error) {
      console.error("Error deleting course:", error);
      this.showToast("Failed to delete course", "error");
    } finally {
      this.showLoading(false);
    }
  }

  async handleCourseSubmit() {
    const form = document.getElementById("course-form");
    const formData = new FormData(form);

    const courseData = {
      title: formData.get("title"),
      description: formData.get("description"),
      creatorName: formData.get("creatorName"),
      contentType: formData.get("contentType"),
      isFree: formData.get("isFree") === "on",
      content: formData.get("content"),
    };

    const courseId = formData.get("courseId");
    const isEdit = courseId && courseId !== "";

    try {
      this.showLoading(true);

      const url = isEdit ? `/api/courses/${courseId}` : "/api/courses";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || `Failed to ${isEdit ? "update" : "create"} course`,
        );
      }

      this.showToast(
        `Course ${isEdit ? "updated" : "created"} successfully!`,
        "success",
      );
      this.hideDynamicContent();
      await this.loadData();
      this.showPage("catalog");
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} course:`, error);
      this.showToast(error.message, "error");
    } finally {
      this.showLoading(false);
    }
  }

  async handleCreatorSubmit() {
    const form = document.getElementById("creator-form");
    const formData = new FormData(form);

    const creatorData = {
      name: formData.get("name"),
      title: formData.get("title"),
      bio: formData.get("bio"),
    };

    try {
      this.showLoading(true);

      const response = await fetch("/api/creators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creatorData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create creator");
      }

      this.showToast("Creator added successfully!", "success");
      this.hideDynamicContent();
      await this.loadData(); // Refresh the entire page data
      this.showPage("catalog");
    } catch (error) {
      console.error("Error creating creator:", error);
      this.showToast(error.message, "error");
    } finally {
      this.showLoading(false);
    }
  }

  async showCreatorUpdateForm() {
    // Ensure creators are loaded
    if (this.creators.length === 0) {
      this.showLoading(true);
      try {
        const response = await fetch("/api/creators");
        if (response.ok) {
          this.creators = await response.json();
        }
      } catch (error) {
        console.error("Error loading creators:", error);
        this.showToast("Failed to load creators", "error");
        return;
      } finally {
        this.showLoading(false);
      }
    }

    const dynamicContent = document.getElementById("dynamic-content");
    dynamicContent.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <button id="close-creator-form" class="btn btn-secondary">×</button>
                    <h2>Update Creator</h2>
                </div>
                
                <form id="creator-update-form" class="creator-form">
                    <div class="form-group">
                        <label for="creator-select">Select Creator *</label>
                        <select id="creator-select" name="creatorId" required>
                            <option value="">Choose a creator...</option>
                            ${this.creators
                              .map(
                                (creator) =>
                                  `<option value="${creator._id}">${this.escapeHtml(creator.name)} - ${this.escapeHtml(creator.title)}</option>`,
                              )
                              .join("")}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="creator-name">Name *</label>
                        <input type="text" id="creator-name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="creator-title">Title *</label>
                        <input type="text" id="creator-title" name="title" required placeholder="e.g., Senior Software Engineer at TechCorp">
                    </div>
                    
                    <div class="form-group">
                        <label for="creator-bio">Bio</label>
                        <textarea id="creator-bio" name="bio" rows="4" placeholder="Expert in cloud computing and backend development with 10+ years of experience."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Update Creator</button>
                        <button type="button" id="cancel-creator-form" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        `;

    document.getElementById("creator-select").addEventListener("change", (e) => {
      const selectedCreator = this.creators.find(c => c._id === e.target.value);
      if (selectedCreator) {
        document.getElementById("creator-name").value = selectedCreator.name;
        document.getElementById("creator-title").value = selectedCreator.title;
        document.getElementById("creator-bio").value = selectedCreator.bio || "";
      }
    });

    document.getElementById("close-creator-form").addEventListener("click", () => {
      this.hideDynamicContent();
    });

    document.getElementById("cancel-creator-form").addEventListener("click", () => {
      this.hideDynamicContent();
    });

    document.getElementById("creator-update-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleCreatorUpdate();
    });

    dynamicContent.classList.remove("hidden");
  }

  async showCreatorDeleteForm() {
    // Ensure creators are loaded
    if (this.creators.length === 0) {
      this.showLoading(true);
      try {
        const response = await fetch("/api/creators");
        if (response.ok) {
          this.creators = await response.json();
        }
      } catch (error) {
        console.error("Error loading creators:", error);
        this.showToast("Failed to load creators", "error");
        return;
      } finally {
        this.showLoading(false);
      }
    }

    const dynamicContent = document.getElementById("dynamic-content");
    dynamicContent.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <button id="close-creator-form" class="btn btn-secondary">×</button>
                    <h2>Delete Creator</h2>
                </div>
                
                <form id="creator-delete-form" class="creator-form">
                    <div class="form-group">
                        <label for="creator-select">Select Creator to Delete *</label>
                        <select id="creator-select" name="creatorId" required>
                            <option value="">Choose a creator...</option>
                            ${this.creators
                              .map(
                                (creator) =>
                                  `<option value="${creator._id}">${this.escapeHtml(creator.name)} - ${this.escapeHtml(creator.title)}</option>`,
                              )
                              .join("")}
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-danger">Delete Creator</button>
                        <button type="button" id="cancel-creator-form" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        `;

    document.getElementById("close-creator-form").addEventListener("click", () => {
      this.hideDynamicContent();
    });

    document.getElementById("cancel-creator-form").addEventListener("click", () => {
      this.hideDynamicContent();
    });

    document.getElementById("creator-delete-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleCreatorDelete();
    });

    dynamicContent.classList.remove("hidden");
  }

  async handleCreatorUpdate() {
    const form = document.getElementById("creator-update-form");
    const formData = new FormData(form);

    const creatorId = formData.get("creatorId");
    const creatorData = {
      name: formData.get("name"),
      title: formData.get("title"),
      bio: formData.get("bio"),
    };

    try {
      this.showLoading(true);

      const response = await fetch(`/api/creators/${creatorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creatorData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update creator");
      }

      this.showToast("Creator updated successfully!", "success");
      this.hideDynamicContent();
      await this.loadData();
      this.showPage("catalog");
    } catch (error) {
      console.error("Error updating creator:", error);
      this.showToast(error.message, "error");
    } finally {
      this.showLoading(false);
    }
  }

  async handleCreatorDelete() {
    const form = document.getElementById("creator-delete-form");
    const formData = new FormData(form);
    const creatorId = formData.get("creatorId");

    if (!confirm("Are you sure you want to delete this creator? This action cannot be undone.")) {
      return;
    }

    try {
      this.showLoading(true);

      const response = await fetch(`/api/creators/${creatorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete creator");
      }

      this.showToast("Creator deleted successfully!", "success");
      this.hideDynamicContent();
      await this.loadData();
      this.showPage("catalog");
    } catch (error) {
      console.error("Error deleting creator:", error);
      this.showToast(error.message, "error");
    } finally {
      this.showLoading(false);
    }
  }

  filterCourses() {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    const typeFilter = document.getElementById("type-filter").value;

    const filteredCourses = this.courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm);
      const matchesType = !typeFilter || course.contentType === typeFilter;

      return matchesSearch && matchesType;
    });

    this.renderFilteredCourses(filteredCourses);
  }

  renderFilteredCourses(courses) {
    const grid = document.getElementById("courses-grid");
    grid.innerHTML = "";

    if (courses.length === 0) {
      grid.innerHTML = '<p class="text-center">No matching courses found</p>';
      return;
    }

    courses.forEach((course) => {
      const card = this.createCourseCard(course);
      grid.appendChild(card);
    });
  }

  showLoading(show) {
    const loading = document.getElementById("loading");
    if (show) {
      loading.classList.remove("hidden");
    } else {
      loading.classList.add("hidden");
    }
  }

  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TechTroveApp();
});
