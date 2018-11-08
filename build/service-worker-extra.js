self.addEventListener('notificationclick', (event) => {
  const { action } = event;
  if (action === 'reload') {
    self.clients.matchAll().then(windowClients => {
      windowClients.forEach(windowClient => {
        windowClient.postMessage({ action });
      });
    })
  }
}, false);
