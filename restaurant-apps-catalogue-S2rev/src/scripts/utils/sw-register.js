import * as WorkboxWindow from 'workbox-window';

const SwRegistration = {
  async init() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported in this browser');
      return;
    }

    const wb = new WorkboxWindow.Workbox('./service-worker.js');

    try {
      const registration = await wb.register();
      console.log('Service Worker registered successfully', registration);

      wb.addEventListener('waiting', () => {
        if (confirm('New content is available! Click OK to update')) {
          wb.messageSkipWaiting();
          window.location.reload();
        }
      });

      wb.addEventListener('activated', (event) => {
        if (!event.isUpdate) {
          console.log('Service Worker activated for the first time!');
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  },
};

export default SwRegistration;
