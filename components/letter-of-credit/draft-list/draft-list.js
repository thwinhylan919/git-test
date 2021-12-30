define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/letter-of-credit-search",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable"
], function(oj, ko, DraftModel, resourceBundle) {
  "use strict";

  return function(params) {
    let i;
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.dataSourceCreated = ko.observable(false);
    self.updateDraft = ko.observable(false);
    self.dataSource = ko.observableArray();
    self.draftList = ko.observableArray();
    params.baseModel.registerElement("search-box");
    params.baseModel.registerComponent("lc-nav-bar", "letter-of-credit");
    self.mode = ko.observable("DRAFT");
    self.transactionType = params.transactionType;

    self.getDrafts = function() {
      let url;

      if (self.transactionType() === "SHIPPING_GUARANTEE") {
        url = "shippingGuarantees/draft";
      } else {
        url = "letterofcredits/drafts";
      }

      DraftModel.getDrafts(url).done(function(data) {
        self.draftList.removeAll();

        if (data.letterOfCreditDTOs) {
          data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["lastUpdatedDate"], ["desc"]);

          for (let i = 0; i < data.letterOfCreditDTOs.length; i++) {
            self.draftList.push({
              draft_name: data.letterOfCreditDTOs[i].name,
              created_on: data.letterOfCreditDTOs[i].lastUpdatedDate,
              draftId: data.letterOfCreditDTOs[i].id
            });
          }
        } else if (data.shippingGuarantees) {
          data.shippingGuarantees = params.baseModel.sortLib(data.shippingGuarantees, ["lastUpdatedDate"], ["desc"]);

          for (let i = 0; i < data.shippingGuarantees.length; i++) {
            self.draftList.push({
              draft_name: data.shippingGuarantees[i].name,
              created_on: data.shippingGuarantees[i].lastUpdatedDate,
              draftId: data.shippingGuarantees[i].id
            });
          }
        }

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.draftList(), {
          idAttribute: ["draft_name"]
        })));

        self.dataSourceCreated(true);
      });
    };

    self.getDrafts();

    self.onDraftSelected = function(selectedData) {
      if (self.transactionType() === "SHIPPING_GUARANTEE") {
        DraftModel.getDraftSG(selectedData.draftId).done(function(data) {
        const dataToBePassed = data.shippingGuarantee;

        if (dataToBePassed.draftsRequired) {
          for (i = 0; i < dataToBePassed.billingDrafts.length; i++) {
            if (!dataToBePassed.billingDrafts[i].otherInformation) {
              dataToBePassed.billingDrafts[i].otherInformation = null;
            }
          }
        }

        self.updateDraft(true);

        const parameters = {
          mode: "EDIT",
          letterOfCreditDetails: dataToBePassed,
          updateDraft: self.updateDraft
        };

        params.dashboard.loadComponent("initiate-shipping-guarantee", parameters);
      });
      }else {
        DraftModel.getDraftLC(selectedData.draftId).done(function(data) {
        const dataToBePassed = data.letterOfCredit;

        if (dataToBePassed.draftsRequired) {
          for (i = 0; i < dataToBePassed.billingDrafts.length; i++) {
            if (!dataToBePassed.billingDrafts[i].otherInformation) {
              dataToBePassed.billingDrafts[i].otherInformation = null;
            }
          }
        }

        self.updateDraft(true);

        const parameters = {
          mode: "EDIT",
          letterOfCreditDetails: dataToBePassed,
          updateDraft: self.updateDraft
        };

        params.dashboard.loadComponent("initiate-lc", parameters);
      });
      }

    };
  };
});
