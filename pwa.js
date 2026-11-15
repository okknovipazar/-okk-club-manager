(() => {
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const bar = document.createElement('aside');
  bar.className = 'pwa-tools';
  bar.setAttribute('aria-label', 'Instalacija aplikacije');
  bar.innerHTML = '<button type="button">Instaliraj aplikaciju</button><p hidden></p>';
  const button = bar.querySelector('button'), help = bar.querySelector('p');
  document.body.prepend(bar);
  bar.hidden = !!installed();
  const offline = document.createElement('div');
  offline.className = 'pwa-offline';
  offline.setAttribute('role','status');
  offline.textContent = 'Nema internet veze. Podaci možda nisu ažurni. Povežite se pre unosa ili izmene podataka, pa osvežite stranicu.';
  document.body.prepend(offline);
  const network = () => { offline.hidden = navigator.onLine; };
  network(); addEventListener('online', network); addEventListener('offline', network);
  let prompt;
  addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); prompt = event; bar.hidden = !!installed();
  });
  button.addEventListener('click', async () => {
    if (prompt) {
      const current = prompt; prompt = null;
      try { await current.prompt(); const choice = await current.userChoice; if (choice.outcome === 'accepted') bar.hidden = true; } catch { showHelp(); }
    } else showHelp();
  });
  function showHelp() {
    help.hidden = false;
    help.textContent = /iPad|iPhone|iPod/.test(navigator.userAgent)
      ? 'U Safariju izaberite Podeli → Dodaj na početni ekran.'
      : 'Otvorite ovu adresu u Chrome-u, pa u meniju ⋮ izaberite „Instaliraj aplikaciju” ili „Dodaj na početni ekran”.';
  }
  addEventListener('appinstalled', () => { prompt = null; bar.hidden = true; });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => { /* The online app remains available. */ });
})();
