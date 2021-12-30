define([
    "knockout",
    "jquery",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojprogress",
    "ojs/ojinputnumber",
    "ojs/ojdatetimepicker"

], function (ko) {
    "use strict";

    return function (params) {

        ko.utils.extend(self, params.rootModel);

        params.baseModel.registerElement("segment-container");

        const flag={
            addFacilityFlag:ko.observable(false),
            addSubFacilityFlag: ko.observable(false),
            updateFlag: ko.observable(false),
            module:"OBCFPM"

        },
         parameters = {
            productId: "facility",
            dataSegments: [ "fsgbu-ob-clmo-ds-facility-application-create","fsgbu-ob-clmo-ds-collaterals","fsgbu-ob-clmo-ds-upload-documents"],
            data:flag
          };

          params.dashboard.loadComponent("segment-container", parameters);

    };
});
