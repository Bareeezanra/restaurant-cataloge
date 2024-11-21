import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import { createRestaurantItemTemplate } from '../../templates/template-creator';

const Favorite = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading">Favorite Restaurants</h2>
        <div id="restaurants" class="restaurants">
        </div>
      </div>
    `;
  },

  async afterRender() {
    try {
      const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
      const restaurantsContainer = document.querySelector('#restaurants');

      restaurantsContainer.innerHTML = '';

      if (!restaurants || restaurants.length === 0) {
        restaurantsContainer.innerHTML = `
          <div class="restaurant-item__not__found">
            <div class="empty-favorite">
              <i class="fa fa-heart-o fa-3x" aria-hidden="true"></i>
              <h3>No Favorite Restaurants Found</h3>
              <p>Click the heart button on any restaurant to add it to your favorites!</p>
              <a href="#/home" class="back-to-home">Explore Restaurants</a>
            </div>
          </div>
        `;
        return;
      }

      restaurants.forEach((restaurant) => {
        restaurantsContainer.innerHTML +=
          createRestaurantItemTemplate(restaurant);
      });
    } catch (error) {
      console.error('Error:', error);
      const restaurantsContainer = document.querySelector('#restaurants');
      restaurantsContainer.innerHTML = `
        <div class="restaurant-item__not__found">
          <div class="error-state">
            <i class="fa fa-exclamation-triangle fa-3x" aria-hidden="true"></i>
            <h3>Oops! Something went wrong</h3>
            <p>Failed to load favorite restaurants. Please try again later.</p>
          </div>
        </div>
      `;
    }
  },
};

export default Favorite;
