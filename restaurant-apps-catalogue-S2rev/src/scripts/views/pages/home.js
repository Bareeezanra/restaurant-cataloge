import { createRestaurantItemTemplate } from '../../templates/template-creator';
import RestaurantSource from '../../data/restaurant-source';

const Home = {
  async render() {
    return `
      <div class="main-content">
        <h2>Explore Restaurants</h2>
        <div id="restaurants" class="restaurant-list"></div>
      </div>
    `;
  },

  async afterRender() {
    try {
      const restaurantsContainer = document.querySelector('#restaurants');
      if (!restaurantsContainer) {
        throw new Error('Container restaurants tidak ditemukan');
      }

      const restaurants = await RestaurantSource.listRestaurants();
      restaurantsContainer.innerHTML = '';

      if (!restaurants || restaurants.length === 0) {
        restaurantsContainer.innerHTML = `
          <div class="restaurant-item__not__found">
            <p>No restaurants found</p>
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
      if (restaurantsContainer) {
        restaurantsContainer.innerHTML = `
          <div class="error-state">
            <p>Error loading restaurants. Please try again later.</p>
          </div>
        `;
      }
    }
  },
};

export default Home;
