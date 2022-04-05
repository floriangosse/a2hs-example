((globals) => {
    const displayModeStandalonElement = document.querySelector('.js-display-mode-standalone');
    const runningAsAppElement = document.querySelector('.js-running-as-app');

    displayModeStandalonElement.textContent = isLaunchedFromHomeScreen() ? 'Yes' : 'No';
    runningAsAppElement.textContent = startedWithAsAppParam() ? 'Yes' : 'No';


    function isLaunchedFromHomeScreen() {
        return window.matchMedia('(display-mode: standalone)').matches;
    }

    function startedWithAsAppParam() {
        const params = new URLSearchParams(location.search);

        return params.get('as-app') === 'true';
    }

    const toolsElement = document.querySelector('.js-tools');
    const logElement = document.querySelector('.js-log');

    function log(message) {
        const date = (new Date()).toISOString();

        console.log(message);
        const logLineElement = document.createElement('div');
        logLineElement.classList.add('log-line');
        const logLineDateElement = document.createElement('div');
        logLineDateElement.classList.add('log-line-date');
        const logLineMessageElement = document.createElement('div');
        logLineMessageElement.classList.add('log-line-message');

        logLineDateElement.textContent = date;
        logLineMessageElement.textContent = message;

        logLineElement.appendChild(logLineDateElement);
        logLineElement.appendChild(logLineMessageElement);

        logElement.appendChild(logLineElement);

        logElement.scrollTop = logElement.scrollHeight - logElement.clientHeight;
    }

    let pointerCount = 0;
    let lastPointerUp = null;

    document.addEventListener('pointerup', (event) => {
        const now = performance.now();

        if (lastPointerUp !== null && now - lastPointerUp > 500) {
            pointerCount = 0;
            lastPointerUp = null;
            return;
        }

        event.preventDefault();

        const nextPointerCount = pointerCount + 1;

        if (nextPointerCount === 5) {
            pointerCount = 0;
            lastPointerUp = null;
            toolsElement.hidden = !toolsElement.hidden;
        } else {
            pointerCount = nextPointerCount;
            lastPointerUp = now;
        }
    });

    globals.appLogger = {
        log
    };

})(window);