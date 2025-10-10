export default class CourseCard {
  constructor(course, creators) {
    this.course = course;
    this.creators = creators;
  }

  render() {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = this.getCardHTML();

    card.addEventListener("click", () => {
      this.onCardClick();
    });

    return card;
  }

  getCardHTML() {
    const creator = this.getCreator();
    const typeClass = this.course.isFree ? "course-free" : "";

    return `
            <div class="course-card-header">
                <h3 class="course-title">${this.course.title}</h3>
                <div class="course-meta">
                    <span class="course-type ${typeClass}">
                        ${this.course.isFree ? "Free" : "Paid"} • ${this.course.contentType}
                    </span>
                </div>
            </div>
            <div class="course-card-body">
                <p class="course-description">${this.course.description}</p>
                <p class="course-creator">by ${creator.name}</p>
            </div>
        `;
  }

  getCreator() {
    return (
      this.creators.find((c) => c._id === this.course.creatorId) || {
        name: "Unknown Creator",
      }
    );
  }

  onCardClick() {
    const event = new CustomEvent("courseSelected", {
      detail: { course: this.course },
    });
    document.dispatchEvent(event);
  }
}
