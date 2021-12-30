define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/offers",
    "load!./offers.json",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function(oj, ko, ResourceBundle, offersJSON) {
    "use strict";

    return function() {
        const self = this;

        self.resource = ResourceBundle;
        self.offers = ko.observableArray();

        self.dataSource = new oj.ArrayTableDataSource(self.offers, {
            idAttribute: "id"
        });

        self.offers(offersJSON.offers);
    };
});