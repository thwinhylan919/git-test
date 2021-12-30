define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/page-banner",
    "ojs/ojfilmstrip",
    "ojs/ojpagingcontrol"
], function (oj, ko, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.pagingModel = ko.observable(null);

        self.features = [{
                name: "alexa",
                description: "billPayment",
                image: ["alexa"],
                alt: "alexa"
            },
            {
                name: "title",
                description: "netBanking",
                image: ["banner1-2", "banner1"],
                alt: "pageBanner"
            }
        ];

        self.featuresSmd = [{
                name: "alexa",
                description: "billPayment",
                image: ["alexa"],
                alt: "alexa"
            },
            {
                name: "title",
                description: "netBanking",
                image: ["mobile-banner"],
                alt: "pageBanner"
            }
        ];

        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("product-header-text", "widgets/pre-login");

        self.loginClick = function () {
            rootParams.dashboard.loadComponent("login-form", {});
        };

        const filmStrip = document.getElementById("filmStrip"),
            busyContext = oj.Context.getContext(filmStrip).getBusyContext();

        busyContext.whenReady().then(function () {
            // Set the Paging Control pagingModel
            self.pagingModel(filmStrip.getPagingModel());
        });
    };
});