import CONFIG from '../globals/config';

const CacheHelper = {
  async cachingAppShell(requests) {
    const cache = await caches.open('restaurant-catalogue-v1');
    await cache.addAll(requests);
  },

  async deleteOldCache() {
    const cacheNames = await caches.keys();
    const promiseDeleteOldCache = cacheNames
      .filter((name) => name !== 'restaurant-catalogue-v1')
      .map((filteredName) => caches.delete(filteredName));

    await Promise.all(promiseDeleteOldCache);
  },

  async revalidateCache(request) {
    try {
      const response = await caches.match(request);
      if (response) {
        this._fetchRequest(request);
        return response;
      }
      return this._fetchRequest(request);
    } catch (error) {
      return this._fetchRequest(request);
    }
  },

  async _fetchRequest(request) {
    try {
      const response = await fetch(request);

      if (!response || response.status !== 200) {
        return response;
      }

      await this._addCache(request, response.clone());
      return response;
    } catch (error) {
      return error;
    }
  },

  async _addCache(request, response) {
    const cache = await caches.open('restaurant-catalogue-v1');
    await cache.put(request, response);
  },

  async _openCache() {
    return caches.open(CONFIG.CACHE_NAME);
  },
};

export default CacheHelper;
