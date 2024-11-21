const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url);
  },

  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return {
      resource: urlsSplits[1] || null,
      id: urlsSplits[2] || null,
      verb: urlsSplits[3] || null,
    };
  },

  _urlCombiner(splitedUrl) {
    if (!splitedUrl.resource) return '/';

    if (splitedUrl.resource === 'home') return '/home';

    if (splitedUrl.resource === 'detail' && splitedUrl.id) {
      return '/detail/:id';
    }

    if (splitedUrl.resource === 'favorite') return '/favorite';

    return '/';
  },
};

export default UrlParser;
