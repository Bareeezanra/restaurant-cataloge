import 'regenerator-runtime';
import '../styles/main.css';
import App from './app';
import SwRegistration from './utils/sw-register';
import WebSocketInitiator from './utils/drawer-initiator';
import CONFIG from './globals/config';

SwRegistration.init();
WebSocketInitiator.init(CONFIG.WEB_SOCKET_SERVER);

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    button: document.querySelector('.menu-icon'),
    drawer: document.querySelector('.menu'),
    content: document.querySelector('#main-content'),
  });

  window.addEventListener('hashchange', () => {
    app.renderPage();
  });

  window.addEventListener('load', async () => {
    app.renderPage();
    await SwRegistration.init();
    WebSocketInitiator.init(CONFIG.WEB_SOCKET_SERVER);
  });

  console.log('JavaScript loaded!');
});

document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.menu');

  menuIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    menuIcon.classList.toggle('active');
    menu.classList.toggle('active');
  });

  document.body.addEventListener('click', () => {
    menuIcon.classList.remove('active');
    menu.classList.remove('active');
  });
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  const mainContent = document.querySelector('#main-content');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="error">
        <h2>Terjadi Kesalahan</h2>
        <p>Mohon muat ulang halaman</p>
      </div>
    `;
  }
});
