((appLogger, globals) => {

    const installButton = document.querySelector('.js-install-button');
    const installedContainer = document.querySelector('.js-installed');
    const notInstalledContainer = document.querySelector('.js-not-installed');
    const installInfoReadyElement = document.querySelector('.js-install-info-ready');
    const installInfoNotReadyElement = document.querySelector('.js-install-info-not-ready');

    let deferredPrompt;

    const isInstalled = (new URLSearchParams(location.search)).get('as-app') === 'true';

    if (isInstalled) {
        installedContainer.style.removeProperty('display');
        notInstalledContainer.style.setProperty('display', 'none');
    } else {
        notInstalledContainer.style.removeProperty('display');
        installedContainer.style.setProperty('display', 'none');
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js', {
                scope: './'
            })
                .then((registration) => {
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
                    appLogger.log('User accepted the A2HS prompt');
                } else {
                    appLogger.log('User dismissed the A2HS prompt');
                }

                deferredPrompt = null;
            });
    });
})(window.appLogger, window);