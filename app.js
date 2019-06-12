((appLogger, globals) => {

    const installButton = document.querySelector('.js-install-button');
    const installInfoReadyElement = document.querySelector('.js-install-info-ready');
    const installInfoNotReadyElement = document.querySelector('.js-install-info-not-ready');

    let deferredPrompt;

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').then((registration) => {
                appLogger.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
            }, (error) => {
                appLogger.log(`Service worker registration failed: ${error}`);
            });
        });
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();

        deferredPrompt = event;

        appLogger.log('Install prompt event triggered, prevented and catched');

        installButton.disabled = false;
        installInfoReadyElement.style.removeProperty('display');
        installInfoNotReadyElement.style.setProperty('display', 'none');
    });

    window.addEventListener('appinstalled', () => {
        appLogger.log('App installed');
    });

    installButton.addEventListener('click', (event) => {
        event.preventDefault();

        appLogger.log(`User clicked "${installButton.textContent}" button`);

        deferredPrompt.prompt();

        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    log('User accepted the A2HS prompt');
                } else {
                    log('User dismissed the A2HS prompt');
                }

                deferredPrompt = null;
            });
    });
})(window.appLogger, window);