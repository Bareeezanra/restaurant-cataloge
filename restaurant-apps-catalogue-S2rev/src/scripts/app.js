import routes from './routes/routes';
import UrlParser from './routes/url-parser';
import './components/review-form';
import './components/review-list';

class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    if (this._button && this._drawer) {
      this._button.addEventListener('click', (event) => {
        event.stopPropagation();
        this._toggleDrawer();
      });

      document.body.addEventListener('click', () => {
        this._closeDrawer();
      });
    }
  }

  _toggleDrawer() {
    if (this._drawer) this._drawer.classList.toggle('open');
  }

  _closeDrawer() {
    if (this._drawer) this._drawer.classList.remove('open');
  }

  async renderPage() {
    try {
      if (!this._content) {
        throw new Error('Content element tidak ditemukan');
      }

      const url = UrlParser.parseActiveUrlWithCombiner();
      console.log('Current URL:', url);

      if (!url || url === '') {
        window.location.hash = '#/';
        return;
      }

      const page = routes[url];
      console.log('Found page handler:', page);

      if (!page) {
        console.log('Available routes:', Object.keys(routes));
        throw new Error(`Halaman untuk URL "${url}" tidak ditemukan`);
      }

      this._content.innerHTML = await page.render();
      await page.afterRender();

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error rendering page:', error);
      this._content.innerHTML = `
        <div class="error">
          <h2>Terjadi Kesalahan</h2>
          <p>${error.message}</p>
          <button onclick="window.location.hash = '#/'">Kembali ke Beranda</button>
        </div>
      `;
    }

    const url = window.location.hash;

    // Hapus kelas home dari body
    document.body.classList.remove('home');

    // Tambahkan kelas home hanya jika di halaman home
    if (url === '' || url === '#/' || url === '#/home') {
      document.body.classList.add('home');
    }
  }
}

export default App;
