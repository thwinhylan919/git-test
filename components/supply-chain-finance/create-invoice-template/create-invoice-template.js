define([
  "ojL10n!resources/nls/create-invoice-template",
  "./model",
  "ojs/ojcore",
  "jquery",
  "knockout",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(resourceBundle, Model, oj, $, ko) {
  "use strict";

  return function(params) {
    const self = this;

    self.nls = resourceBundle;
    self.invoiceList = [];
    params.dashboard.headerName(self.nls.componentHeader);
    self.dataSource73 = ko.observable();
    params.baseModel.registerElement("help");
    params.baseModel.registerElement("search-box");

    self.templatesLoaded = ko.observable(false);
    self.templatesGetVar = ko.observableArray();

    Model.invoiceTemplatesget().then(function(response) {
      self.templatesGetVar(response.invoicetemplatedtos);

      self.templatesGetVar().forEach(function(template) {
        template.noOfInvoices = template.invoices.length;
      });

      self.templatesLoaded(true);
    });

    self.dataSource73(new oj.ArrayTableDataSource(self.templatesGetVar, {
      idAttribute: "templateId"
    }));

    self.onClickCancel = function() {
      params.dashboard.switchModule("supply-chain-finance");
    };

    self.onClicktemplateId47 = function(data) {
      if (!params.formDataSaved) {
        params.rootModel.templateInvoiceList().length = 0;
        params.rootModel.templateInvoiceList(data);
        params.rootModel.clearData(true);
        params.rootModel.menuSelection("new_invoice");
      } else {
        self.invoiceList.length = 0;
        self.invoiceList = data;
        $("#dataDecision").trigger("openModal");
      }
    };

    self.closeHandler = function() {
      $("#dataDecision").hide();
    };

    self.onClickYes = function() {
      params.rootModel.templateInvoiceList().length = 0;
      params.rootModel.templateInvoiceList(self.invoiceList);
      params.rootModel.menuSelection("new_invoice");
      params.rootModel.clearData(true);
    };

    self.onClickNo = function() {
      params.rootModel.templateInvoiceList().length = 0;
      params.rootModel.templateInvoiceList(self.invoiceList);
      params.rootModel.menuSelection("new_invoice");
      params.rootModel.clearData(false);
    };

    self.onClickCancelPopUp = function() {
      $("#dataDecision").hide();
    };

  };
});
