export default class CourseForm {
  constructor(creators) {
    this.creators = creators;
    this.form = document.getElementById("course-form");
    this.setupEventListeners();
    this.populateCreatorSelect();
  }

  setupEventListeners() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancel-course");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.resetForm();
        this.onCancel();
      });
    }
  }

  populateCreatorSelect() {
    const creatorSelect = document.getElementById("course-creator");
    if (!creatorSelect) return;

    // Clear existing options except the first one
    while (creatorSelect.children.length > 1) {
      creatorSelect.removeChild(creatorSelect.lastChild);
    }

    this.creators.forEach((creator) => {
      const option = document.createElement("option");
      option.value = creator._id;
      option.textContent = creator.name;
      creatorSelect.appendChild(option);
    });
  }

  async handleSubmit() {
    const formData = this.getFormData();

    if (!this.validateForm(formData)) {
      return;
    }

    try {
      this.showLoading(true);

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create course");
      }

      const newCourse = await response.json();
      this.onCourseCreated(newCourse);
      this.resetForm();
      this.showSuccess("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      this.showError(error.message);
    } finally {
      this.showLoading(false);
    }
  }

  getFormData() {
    const formData = new FormData(this.form);

    return {
      title: formData.get("title"),
      description: formData.get("description"),
      creatorId: formData.get("creatorId"),
      contentType: formData.get("contentType"),
      isFree: formData.get("isFree") === "on",
      content: formData.get("content"),
    };
  }

  validateForm(data) {
    const errors = [];

    if (!data.title || data.title.trim() === "") {
      errors.push("Course title cannot be empty");
    }

    if (!data.description || data.description.trim() === "") {
      errors.push("Course description cannot be empty");
    }

    if (!data.creatorId) {
      errors.push("Please select a creator");
    }

    if (errors.length > 0) {
      this.showError(errors.join(", "));
      return false;
    }

    return true;
  }

  resetForm() {
    this.form.reset();
  }

  showLoading(show) {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = show;
      submitBtn.textContent = show ? "Creating..." : "Create Course";
    }
  }

  showSuccess(message) {
    this.showToast(message, "success");
  }

  showError(message) {
    this.showToast(message, "error");
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

  onCourseCreated(course) {
    const event = new CustomEvent("courseCreated", {
      detail: { course },
    });
    document.dispatchEvent(event);
  }

  onCancel() {
    const event = new CustomEvent("formCancelled");
    document.dispatchEvent(event);
  }
}
