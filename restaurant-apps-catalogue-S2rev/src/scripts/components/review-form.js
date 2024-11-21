class ReviewForm extends HTMLElement {
  constructor() {
    super();
    this._restaurantId = '';
    this._onReviewSubmitted = null;
  }

  set restaurantId(id) {
    this._restaurantId = id;
    this.render();
  }

  set onReviewSubmitted(callback) {
    this._onReviewSubmitted = callback;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="review-form">
          <h3>Tambah Review</h3>
          <form id="reviewForm">
            <div class="form-group">
              <label for="reviewName">Nama</label>
              <input 
                type="text" 
                id="reviewName" 
                name="name" 
                required
                minlength="3"
                placeholder="Masukkan nama Anda"
              >
            </div>
            <div class="form-group">
              <label for="reviewText">Review</label>
              <textarea 
                id="reviewText" 
                name="review" 
                required
                minlength="5"
                placeholder="Bagikan pengalaman Anda"
              ></textarea>
            </div>
            <button type="submit" class="submit-review" id="submitReview">
              Kirim Review
            </button>
          </form>
        </div>
      `;

    this._initializeForm();
  }

  async _initializeForm() {
    const form = this.querySelector('#reviewForm');
    const submitButton = this.querySelector('#submitReview');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = this.querySelector('#reviewName');
      const reviewInput = this.querySelector('#reviewText');

      submitButton.disabled = true;
      submitButton.textContent = 'Mengirim...';

      try {
        const response = await fetch(
          'https://restaurant-api.dicoding.dev/review',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this._restaurantId,
              name: nameInput.value,
              review: reviewInput.value,
            }),
          }
        );

        const responseData = await response.json();

        if (responseData.error) {
          throw new Error(responseData.message);
        }

        form.reset();

        if (this._onReviewSubmitted) {
          this._onReviewSubmitted(responseData.customerReviews);
        }

        this._showMessage('Review berhasil ditambahkan!', 'success');
      } catch (error) {
        console.error('Error submitting review:', error);
        this._showMessage(
          'Gagal menambahkan review. Silakan coba lagi.',
          'error'
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim Review';
      }
    });
  }

  _showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;

    const form = this.querySelector('.review-form');
    form.insertBefore(messageElement, form.firstChild);

    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}

customElements.define('review-form', ReviewForm);
