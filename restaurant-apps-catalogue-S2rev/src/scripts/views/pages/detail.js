import CONFIG from '../../globals/config';
import UrlParser from '../../routes/url-parser';
import RestaurantSource from '../../data/restaurant-source';
import LikeButtonPresenter from '../../utils/like-button-presenter';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import '../../components/review-form';
import '../../components/review-list';

const Detail = {
  async render() {
    return `
      <div class="restaurant-detail" id="restaurant"></div>
      <div id="reviewContainer"></div>
      <div id="likeButtonContainer"></div>
    `;
  },

  async afterRender() {
    try {
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      if (!url.id) {
        throw new Error('Restaurant ID tidak ditemukan');
      }

      const restaurant = await RestaurantSource.detailRestaurant(url.id);
      if (!restaurant) {
        throw new Error('Restaurant data tidak ditemukan');
      }

      const restaurantContainer = document.querySelector('#restaurant');
      if (!restaurantContainer) {
        throw new Error('Container restaurant tidak ditemukan');
      }

      restaurantContainer.innerHTML = this._createDetailTemplate(restaurant);

      this._initializeReviewComponents(restaurant);

      await this._initializeLikeButton(restaurant);
    } catch (error) {
      console.error('Error:', error);
      const restaurantContainer = document.querySelector('#restaurant');
      if (restaurantContainer) {
        restaurantContainer.innerHTML = `
          <div class="error-state">
            <h3>Error</h3>
            <p>${
  error.message || 'Terjadi kesalahan saat memuat detail restaurant'
}</p>
            <a href="#/" class="back-button">Kembali ke Beranda</a>
          </div>
        `;
      }
    }
  },

  _createDetailTemplate(restaurant) {
    if (!restaurant) return '';

    return `
    <article class="restaurant-detail__content">
      <div class="restaurant-detail__header">
        <img 
          src="${CONFIG.BASE_IMAGE_URL}${restaurant.pictureId}" 
          alt="${restaurant.name}" 
          class="restaurant-detail__image"
          onerror="this.src='./images/placeholder.jpg'"
        >
        <div class="restaurant-detail__info">
          <h1 class="restaurant-detail__title">${
  restaurant.name || 'Unnamed Restaurant'
}</h1>
          <div class="restaurant-detail__metadata">
            <div class="restaurant-detail__rating">
              <span>⭐</span>
              <span>${restaurant.rating || 'N/A'}</span>
            </div>
            <div class="restaurant-detail__city">
              <span>📍</span>
              <span>${restaurant.city || 'N/A'}</span>
            </div>
            <div class="restaurant-detail__address">
              <span>🏠</span>
              <span>${restaurant.address || 'N/A'}</span>
            </div>
          </div>
          <p class="restaurant-detail__description">${
  restaurant.description || 'No description available'
}</p>
        </div>
      </div>

      <div class="restaurant-detail__menu">
        <div class="menu-foods">
          <h2>Menu Makanan</h2>
          <ul>
            ${
  restaurant.menus?.foods
    ?.map((food) => `<li>${food.name}</li>`)
    .join('') || '<li>Tidak ada menu makanan</li>'
}
          </ul>
        </div>
        <div class="menu-drinks">
          <h2>Menu Minuman</h2>
          <ul>
            ${
  restaurant.menus?.drinks
    ?.map((drink) => `<li>${drink.name}</li>`)
    .join('') || '<li>Tidak ada menu minuman</li>'
}
          </ul>
        </div>
      </div>

      <div class="restaurant-detail__reviews">
        <h2>Review Pelanggan</h2>
        <div class="review-list">
          ${
  restaurant.customerReviews?.length > 0
    ? restaurant.customerReviews
      .map(
        (review) => `
                <div class="review-item">
                  <div class="review-header">
                    <span class="review-name">${
  review.name || 'Anonymous'
}</span>
                    <span class="review-date">${review.date || 'N/A'}</span>
                  </div>
                  <p class="review-text">${
  review.review || 'No review content'
}</p>
                </div>
              `
      )
      .join('')
    : '<div class="review-item">Belum ada review</div>'
}
        </div>
      </div>
    </article>
  `;
  },

  async _initializeLikeButton(restaurant) {
    try {
      const likeButtonContainer = document.querySelector(
        '#likeButtonContainer'
      );
      if (!likeButtonContainer) {
        throw new Error('Like button container tidak ditemukan');
      }

      await LikeButtonPresenter.init({
        likeButtonContainer,
        favoriteRestaurants: FavoriteRestaurantIdb,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          pictureId: restaurant.pictureId,
          city: restaurant.city,
          rating: restaurant.rating,
        },
      });
    } catch (error) {
      console.error('Error initializing like button:', error);
    }
  },

  _initializeReviewComponents(restaurant) {
    const reviewContainer = document.querySelector('#reviewContainer');

    const reviewForm = document.createElement('review-form');
    reviewForm.restaurantId = restaurant.id;

    const reviewList = document.createElement('review-list');
    reviewList.reviews = restaurant.customerReviews;

    reviewForm.onReviewSubmitted = (updatedReviews) => {
      reviewList.reviews = updatedReviews;
    };

    reviewContainer.appendChild(reviewForm);
    reviewContainer.appendChild(reviewList);
  },
};

export default Detail;
