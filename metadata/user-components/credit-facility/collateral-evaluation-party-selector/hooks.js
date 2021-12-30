define(["./model"], function (Model) {
    "use strict";

    return function () {
        let self,
         params;

                function mepartygetCall() {
            return Model.mepartyget();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.selectedParty = params.rootModel.selectedParty;

            self.pageRendered = function () {
                return true;
            };

            mepartygetCall().then(function (response) {
                self.selectedParty(response.party.personalDetails.fullName);
            });

            return true;
        }

        return {
            mepartygetCall: mepartygetCall,
            init: init
        };
    };
});