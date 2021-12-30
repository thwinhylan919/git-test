define([
    "./model",
    "knockout",
    "ojL10n!resources/nls/application-tracker-documents",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function(Model, ko, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.letterofcreditsletterOfCreditIdgetVar = ko.observable();
        self.letterofcreditsletterOfCreditIdgetletterOfCreditId = ko.observable();
        self.letterofcreditsletterOfCreditIdgetversionNo = ko.observable();
        self.letterofcreditsletterOfCreditIdgetforBillsCreation = ko.observable();
        self.contentscontentIdgetVar = ko.observable();
        self.contentscontentIdgetcontentId = ko.observable();
        self.contentscontentIdgetalt = ko.observable();
        self.contentscontentIdgetownerId = ko.observable();
        self.contentscontentIdgetapplicationId = ko.observable();
        self.contentscontentIdgettransactionType = ko.observable();
        self.contentscontentIdgettoBeDownloaded = ko.observable();
        self.tradeApplicationsapplicationIddocumentsgetVar = ko.observable();
        self.tradeApplicationsapplicationIddocumentsgetapplicationId = ko.observable();
        params.baseModel.registerElement("help");
        self.appTrackerDocuments = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.documents = ko.observableArray([]);
        self.letterofcreditsletterOfCreditIdgetVar = ko.observable();
        self.previousData = ko.observable();
        self.previousData(params.rootModel.params);
        self.letterofcreditsletterOfCreditIdgetVar(self.previousData().letterOfCreditDetails);
        self.dataLoaded(true);

        self.tradeApplicationsapplicationIddocumentsgetapplicationId(self.previousData().applicationDetails.applicationNumber);

        Model.tradeApplicationsapplicationIddocumentsget(self.tradeApplicationsapplicationIddocumentsgetapplicationId()).then(function(response) {
            self.documents(response);
        });

        self.onClickDocumentName66 = function(data) {
            self.contentscontentIdgetcontentId(data.contentId.value);
            self.contentscontentIdgettransactionType("LC");
            self.contentscontentIdgetalt("media");
            self.contentscontentIdgettoBeDownloaded("true");

            Model.contentscontentIdget(self.contentscontentIdgetcontentId(), self.contentscontentIdgetalt(), self.contentscontentIdgetownerId(), self.contentscontentIdgetapplicationId(), self.contentscontentIdgettransactionType(), self.contentscontentIdgettoBeDownloaded());
        };
    };
});