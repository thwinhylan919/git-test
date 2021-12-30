define([
    "ojs/ojcore",
    "jquery",
    "knockout",
    "ojL10n!resources/nls/generic",
    "ojs/ojnavigationlist",
    "ojs/ojconveyorbelt",
    "ojs/ojarraytabledatasource"
], function(oj, $, ko, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.navigationLevel = ko.observable("page");
        self.locale = locale;
        self.menuOptions = null;
        self.iconAvailable = rootParams.uiOptions.iconAvailable;
        self.navBarDescription = rootParams.navBarDescription;
        self.navBarId = rootParams.baseModel.incrementIdCount() + "navigation-list";

        self.dataSource = new oj.ArrayTableDataSource(rootParams.menuOptions, {
            idAttribute: "id"
        });

        self.selectedNode = rootParams.uiOptions.defaultOption;

        self.styleClass = function() {
            const $element = $("oj-navigation-list[data-id='" + self.navBarId + "']");

            $element.addClass(rootParams.uiOptions.fullWidth ? "" : "oj-sm-condense");

            switch (rootParams.uiOptions.menuFloat) {
                case "center":
                    $element.addClass("center");
                    break;
                case "left":
                    $element.addClass("pull-left");
                    break;
                case "right":
                    $element.addClass("pull-right");
                    break;
            }
        };

        self.type = rootParams.uiOptions.type ? rootParams.uiOptions.type : "top";
        self.onBeforeSelection = rootParams.uiOptions.onBeforeSelect;

        if (rootParams.scrollIntoView) {
            oj.Context.getContext(document.querySelector("oj-navigation-list[data-id='" + self.navBarId + "']"))
                .getBusyContext().whenReady().then(function() {
                    setTimeout(function() {
                        document.querySelector("#" + ko.utils.unwrapObservable(self.selectedNode)).scrollIntoView(false);
                    }, 500);
                });
        }
    };
});