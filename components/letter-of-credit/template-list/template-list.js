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
], function(oj, ko, TemplateModel, resourceBundle) {
  "use strict";

  return function(params) {
    let i;
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.dataSourceCreated = ko.observable(false);
    self.transactionType = params.transactionType;

    self.templateDatasource = ko.observableArray().extend({
      loaded: false
    });

    self.templateList = ko.observableArray();
    params.baseModel.registerElement("search-box");
    self.mode = ko.observable("TEMPLATE");
    self.updateTemplate = ko.observable(false);
    self.letterOfCreditDetails = ko.observable();

    function capitalize(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
    }

    self.getTemplates = function() {
      let url;

      if (self.transactionType() === "SHIPPING_GUARANTEE") {
        url = "shippingGuarantees/templates";
      } else {
        url = "letterofcredits/templates";
      }

      TemplateModel.getTemplates(url).done(function(data) {
        self.templateList.removeAll();

        if (data.letterOfCreditDTOs) {
          data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["lastUpdatedDate"], ["desc"]);

          for (i = 0; i < data.letterOfCreditDTOs.length; i++) {
            self.templateList.push({
              template_name: data.letterOfCreditDTOs[i].name,
              beneficiary: data.letterOfCreditDTOs[i].counterPartyName,
              product: data.letterOfCreditDTOs[i].productName,
              customer_id: data.letterOfCreditDTOs[i].userName,
              created_on: data.letterOfCreditDTOs[i].applicationDate,
              updated_on: data.letterOfCreditDTOs[i].lastUpdatedDate,
              access_type: capitalize(data.letterOfCreditDTOs[i].visibility),
              templateId: data.letterOfCreditDTOs[i].id
            });
          }
        } else if (data.shippingGuarantees) {
          data.shippingGuarantees = params.baseModel.sortLib(data.shippingGuarantees, ["lastUpdatedDate"], ["desc"]);

          for (i = 0; i < data.shippingGuarantees.length; i++) {
            self.templateList.push({
              template_name: data.shippingGuarantees[i].name,
              beneficiary: data.shippingGuarantees[i].counterPartyName,
              product: data.shippingGuarantees[i].productName,
              customer_id: data.shippingGuarantees[i].userName,
              created_on: data.shippingGuarantees[i].applicationDate,
              updated_on: data.shippingGuarantees[i].lastUpdatedDate,
              access_type: capitalize(data.shippingGuarantees[i].visibility),
              templateId: data.shippingGuarantees[i].id
            });
          }
        }

        self.templateDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.templateList(), {
          idAttribute: ["template_name"]
        })));

        self.dataSourceCreated(true);
      });
    };

    self.getTemplates();

    self.onTemplateNameSelected = function(selectedData) {

      if (self.transactionType() === "SHIPPING_GUARANTEE") {
        TemplateModel.getTemplateForSG(selectedData.templateId).done(function(data) {
          const dataToBePassed = data.shippingGuarantee;

          if (dataToBePassed.draftsRequired) {
            for (i = 0; i < dataToBePassed.billingDrafts.length; i++) {
              if (!dataToBePassed.billingDrafts[i].otherInformation) {
                dataToBePassed.billingDrafts[i].otherInformation = null;
              }
            }
          }

          if (dataToBePassed.currentUser) {
            self.updateTemplate(true);
          } else {
            self.updateTemplate(false);
          }

          const parameters = {
            mode: "EDIT",
            letterOfCreditDetails: dataToBePassed,
            updateTemplate: self.updateTemplate
          };

          params.dashboard.loadComponent("initiate-shipping-guarantee", parameters);
        });
      } else {
        TemplateModel.getTemplateForLC(selectedData.templateId).done(function(data) {
          const dataToBePassed = data.letterOfCredit;

          if (dataToBePassed.draftsRequired) {
            for (i = 0; i < dataToBePassed.billingDrafts.length; i++) {
              if (!dataToBePassed.billingDrafts[i].otherInformation) {
                dataToBePassed.billingDrafts[i].otherInformation = null;
              }
            }
          }

          if (dataToBePassed.currentUser) {
            self.updateTemplate(true);
          } else {
            self.updateTemplate(false);
          }

          const parameters = {
            mode: "EDIT",
            letterOfCreditDetails: dataToBePassed,
            updateTemplate: self.updateTemplate
          };

          params.dashboard.loadComponent("initiate-lc", parameters);
        });
      }

    };
  };
});
