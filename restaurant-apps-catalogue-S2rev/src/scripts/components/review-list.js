class ReviewList extends HTMLElement {
  constructor() {
    super();
    this._reviews = [];
  }

  set reviews(reviews) {
    this._reviews = reviews;
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="review-list">
          <h3>Review Pelanggan</h3>
          ${
            this._reviews.length > 0
              ? this._reviews
                  .map(
                    (review) => `
            <div class="review-item">
              <div class="review-header">
                <span class="review-name">${review.name}</span>
                <span class="review-date">${review.date}</span>
              </div>
              <p class="review-text">${review.review}</p>
            </div>
          `
                  )
                  .join("")
              : '<p class="no-reviews">Belum ada review</p>'
          }
        </div>
      `;
  }
}

customElements.define("review-list", ReviewList);
