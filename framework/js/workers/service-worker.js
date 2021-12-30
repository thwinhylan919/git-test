(function() {
    "use strict";

    const workerScript = document.currentScript && document.currentScript.dataset.serviceWorker,
        notSupportedBrowser = /^(((?!chrome|android).)*safari)|Edge\//i.test(navigator.userAgent);

    if (workerScript && navigator.serviceWorker && !notSupportedBrowser) {
        require(["framework/js/configurations/config"], function(SystemConfiguration) {
            if (SystemConfiguration.serviceWorker.enabled) {
                window.addEventListener("load", function() {
                    navigator.serviceWorker.register(workerScript);
                });
            }
        });
    }
})();