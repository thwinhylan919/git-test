define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function letterofcreditsletterOfCreditIdgetCall(letterOfCreditId, versionNo, forBillsCreation) {
            return Model.letterofcreditsletterOfCreditIdget(letterOfCreditId, versionNo, forBillsCreation);
        }

                function contentscontentIdgetCall(contentId, alt, ownerId, applicationId, transactionType, toBeDownloaded) {
            return Model.contentscontentIdget(contentId, alt, ownerId, applicationId, transactionType, toBeDownloaded);
        }

        function tradeApplicationsapplicationIddocumentsgetCall(applicationId) {
            return Model.tradeApplicationsapplicationIddocumentsget(applicationId);
        }

                function onClickDocumentName66(data) {
            self.contentscontentIdgetcontentId(data.contentId.value);
            self.contentscontentIdgettransactionType("LC");
            self.contentscontentIdgetalt("media");
            self.contentscontentIdgettoBeDownloaded("true");

            contentscontentIdgetCall(self.contentscontentIdgetcontentId(), self.contentscontentIdgetalt(), self.contentscontentIdgetownerId(), self.contentscontentIdgetapplicationId(), self.contentscontentIdgettransactionType(), self.contentscontentIdgettoBeDownloaded()).then(function (response) {
                self.contentscontentIdgetVar(response);
            });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.appTrackerDocuments = ko.observable();
            self.dataLoaded = ko.observable(false);
            self.documents = ko.observableArray([]);
            self.letterofcreditsletterOfCreditIdgetVar = ko.observable();
            self.previousData = ko.observable();
            self.previousData(params.rootModel.params);
            self.letterofcreditsletterOfCreditIdgetVar(self.previousData().letterOfCreditDetails);
            self.dataLoaded(true);

           self.tradeApplicationsapplicationIddocumentsgetapplicationId(self.previousData().applicationDetails.applicationNumber);

           tradeApplicationsapplicationIddocumentsgetCall(self.tradeApplicationsapplicationIddocumentsgetapplicationId()).then(function(response){
            self.documents(response);
         });

            return true;
        }

        return {
            letterofcreditsletterOfCreditIdgetCall: letterofcreditsletterOfCreditIdgetCall,
            contentscontentIdgetCall: contentscontentIdgetCall,
            tradeApplicationsapplicationIddocumentsgetCall: tradeApplicationsapplicationIddocumentsgetCall,
            onClickDocumentName66: onClickDocumentName66,
            init: init
        };
    };
});