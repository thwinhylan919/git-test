define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/mutual-funds-news",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, Model, resourceBundle) {
    "use strict";

    return function () {
        const self = this;

        self.nls = resourceBundle;

        self.newsData = [];

        let i;

        self.newsLoaded = ko.observable(false);

        Model.fetchNews().done(function (data) {
            for (i = 0; i < data.newsdtos.length; i++) {
                self.newsData.push({
                    itemId: data.newsdtos[i].itemId,
                    heading: data.newsdtos[i].heading,
                    url: data.newsdtos[i].url
                });
            }

            self.dataSource = new oj.ArrayTableDataSource(self.newsData, {
                idAttribute: "itemId"
            });

            self.newsLoaded(true);
        });
    };
});