define([
    "ojL10n!resources/nls/view-finance-details",
    "knockout",
    "ojs/ojcore",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol"
], function (resourceBundle, ko, oj, Model) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.noData = "-";
        self.invoiceDataLoaded = ko.observable(false);
        self.invoiceStatusArray = ko.observableArray();
        self.invoices = ko.observableArray();

        Model.invoiceStatusget().then(function (response) {
            for (let i = 0; i < response.enumRepresentations[0].data.length; i++) {
                self.invoiceStatusArray().push({
                    description: response.enumRepresentations[0].data[i].description,
                    code: response.enumRepresentations[0].data[i].code
                });
            }

            for (let j = 0; j < params.rootModel.invoices.length; j++) {
                for (let k = 0; k < self.invoiceStatusArray().length; k++) {
                    if (params.rootModel.invoices[j].invoiceStatus === self.invoiceStatusArray()[k].code) {
                        params.rootModel.invoices[j].invoiceStatusDescription = self.invoiceStatusArray()[k].description;
                        break;
                    }
                }
            }

            self.invoices(params.rootModel.invoices);
            self.invoiceDataLoaded(true);
        });

        self.dataSource14 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.invoices, {
            idAttribute: "invoiceId"
        }));
    };
});