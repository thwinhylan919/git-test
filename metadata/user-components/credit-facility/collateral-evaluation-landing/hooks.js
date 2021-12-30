define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function mepartygetCall(payload, config) {
            return Model.mepartyget(payload, config);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.collaterEvaluationLanding = ko.observable();
            params.baseModel.registerElement("segment-container");

            mepartygetCall().then(function (response) {
                params.dashboard.loadComponent("segment-container", {
                    productId: "collateralEvaluation",
                    dataSegments: [
                        "fsgbu-ob-clmo-ds-collateral-evaluation-details",
                        "fsgbu-ob-clmo-ds-collateral-evaluation-ownership-details",
                        "fsgbu-ob-clmo-ds-collateral-evaluation-seniority-details",
                        "fsgbu-ob-clmo-ds-collateral-evaluation-documents-upload"
                    ],
                    data: {
                        module: "OBCFPM",
                        type: "Collateral Evaluation",
                        partyId: response.party.id.value
                    }
                });
            });

            return true;
        }

        return {
            mepartygetCall: mepartygetCall,
            init: init
        };
    };
});