define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function oobauthenticationreferenceNumberstatusgetCall(referenceNumber, payload, config) {
            return Model.oobauthenticationreferenceNumberstatusget(referenceNumber, payload, config);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.status = ko.observable();
            self.flag = ko.observable("Y");
            self.referenceNumber = ko.observable(params.rootModel.challenge.referenceNo);

            self.pageRendered = function () {
                return true;
            };

            self.completeOOB = function () {
                if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID))) {
                    return;
                }

                const buildingResponseHeader = {};

                buildingResponseHeader.referenceNo = self.referenceNumber();
                params.rootModel.submit2fa(buildingResponseHeader);
                self.flag("N");
            };

            const mins = 5;
            let secs = mins * 60, currentSeconds = 0, currentMinutes = 0;

            self.timer = ko.observable();

            self.timerset = function () {
                function stop() {
                    clearInterval(self.id);
                    self.completeOOB();
                }

                self.id = setInterval(function () {
                    currentMinutes = Math.floor(secs / 60);
                    currentSeconds = secs % 60;

                    if (currentSeconds <= 9) {
                        currentSeconds = "0" + currentSeconds;
                    }

                    secs--;

                    oobauthenticationreferenceNumberstatusgetCall(self.referenceNumber()).then(function (response) {
                        self.oobauthenticationreferenceNumberstatusgetVar(response);
                        self.status(self.oobauthenticationreferenceNumberstatusgetVar().state);
                    });

                    if (self.status() && (self.status() === "A" || self.status() === "R")) {
                        stop();
                    } else if (currentMinutes <= 0 && currentSeconds <= 0) {
                        stop();
                        self.flag("N");
                        params.rootModel.cancelAuthenticationScreen();
                    }

                    self.timer(currentMinutes + ":" + currentSeconds);
                }, 1000);
            };

            self.timerset();

            return true;
        }

        return {
            oobauthenticationreferenceNumberstatusgetCall: oobauthenticationreferenceNumberstatusgetCall,
            init: init
        };
    };
});