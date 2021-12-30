define([
    "knockout",

    "./model",
    "ojL10n!resources/nls/demand-deposit-service-request"
], function(ko, ServiceRequestModel, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.locale = locale;
        self.menuSelection = ko.observable();
        self.menuCountOptions = ko.observableArray();
        self.openRequestArray = ko.observableArray();
        self.closedRequestArray = ko.observableArray();
        self.openRequests = ko.observable(false);
        self.closedRequests = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerElement("date-box");
        rootParams.baseModel.registerComponent("service-requests-base-main", "service-requests");
        rootParams.baseModel.registerComponent("service-requests-track", "service-requests");

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: true,
            defaultOption: self.menuSelection
        };

        self.menuSelection.subscribe(function(newvalue) {
            if (newvalue === "PE") {
                self.openRequests(true);
                self.closedRequests(false);
            } else {
                self.openRequests(false);
                self.closedRequests(true);
            }
        });

        function getRequest(data) {
            const requestList = data.list;
            let pendingCount = 0,
                closedCount = 0;

            ko.utils.arrayForEach(requestList, function(item) {
                if (item.status === "PE") {
                    pendingCount++;
                    self.openRequestArray.push(item);
                } else if (item.status === "CO") {
                    closedCount++;
                    self.closedRequestArray.push(item);
                }
            });

            self.menuCountOptions([{
                label: rootParams.baseModel.format(self.locale.serviceRequest.openRequestsCount, {
                    count: pendingCount
                }),
                id: "PE"
            }, {
                label: rootParams.baseModel.format(self.locale.serviceRequest.closedRequestsCount, {
                    count: closedCount
                }),
                id: "CO"
            }]);
        }

        self.menuSelection("PE" || self.menuCountOptions()[0].id);

        function setData() {
            ServiceRequestModel.fetchAccountInfo().then(function(data) {
                getRequest(data);
            });
        }

        setData();
    };
});