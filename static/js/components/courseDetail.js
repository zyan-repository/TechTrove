export default class CourseDetail {
  constructor(course, creator) {
    this.course = course;
    this.creator = creator;
  }

  render() {
    const container = document.createElement("div");
    container.className = "course-detail";
    container.innerHTML = this.getDetailHTML();
    return container;
  }

  getDetailHTML() {
    const typeClass = this.course.isFree ? "course-free" : "";
    return `
        <div class="course-detail-header">
            <h2 class="course-detail-title">${this.course.title}</h2>
            <div class="course-detail-meta">
                <span class="course-type ${typeClass}">
                    ${this.course.isFree ? "Free" : "Paid"} • ${this.course.contentType}
                </span>
                <span class="course-creator">by ${this.creator.name}</span>
            </div>
        </div>
        
        <div class="course-detail-body">
            <div class="course-detail-description">
                <h3>Course Description</h3>
                <p>${this.course.description}</p>
            </div>
            
            ${
              this.course.content
                ? `
                <div class="course-detail-content">
                    <h3>Course Content</h3>
                    <div class="content-text">${this.course.content}</div>
                </div>
            `
                : ""
            }
            
            <div class="course-detail-creator">
                <h3>About the Creator</h3>
                <div class="creator-info">
                    <div class="creator-avatar">
                        ${this.creator.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="creator-details">
                        <h4>${this.creator.name}</h4>
                        <p class="creator-title">${this.creator.title}</p>
                        ${this.creator.bio ? `<p class="creator-bio">${this.creator.bio}</p>` : ""}
                    </div>
                </div>
            </div>
        </div>
    `;
  }
}
