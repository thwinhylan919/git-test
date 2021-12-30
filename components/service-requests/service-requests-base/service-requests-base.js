define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/service-requests-configuration",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function (oj, ko, ResourceBundle) {
  "use strict";

  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.preLoadRootModel = Params.rootModel;
    self.model = Params.model;
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.serviceRequest.header);
    self.transactionName = ko.observable("Maintenance");
    self.backFromDetails = ko.observable(false);
    self.showApprovalButtonset = ko.observable(Params.rootModel.params.showApprovalButtonset);

    if (!self.backFromDetails()) {
      self.pagingDatasource = ko.observable();
      self.serviceRequest = ko.observable();
      self.statusType = ko.observable("PE");
      self.requestType = ko.observable("");
      self.refNumber = ko.observable("");
      self.status = ko.observable("");
      self.severity = ko.observable("");
      self.requestName = ko.observable("");
      self.productName = ko.observable("");
      self.requestCategory = ko.observable("");

      const date = Params.baseModel.getDate(),
        date2 = Params.baseModel.getDate();

      date2.setMonth(date.getMonth() - 1);
      self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(date2));
      self.endDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(date));
      self.startDate(self.startDate().substring(0, self.startDate().indexOf("T")));
      self.endDate(self.endDate().substring(0, self.endDate().indexOf("T")));
      self.firstName = ko.observable("");
      self.lastname = ko.observable("");
      self.partyId = ko.observable("");
      self.userName = ko.observable("");
      self.note = ko.observable("");
    }

    self.defaultListLoaded = ko.observable(false);
    self.listArray = ko.observableArray();
    self.statusTypeLoaded = ko.observable(false);
    self.statusTypeArray = ko.observableArray();
    self.requestTypeLoaded = ko.observable(false);
    self.requestTypeArray = ko.observableArray();
    self.productsArray = ko.observableArray();
    self.productsLoaded = ko.observable(false);
    self.severityLoaded = ko.observable(false);
    self.approveRejectButton = ko.observable(true);
    self.productsArray = ko.observableArray();
    self.requestCategoriesLoaded = ko.observable(true);
    self.categoriesLoaded = ko.observableArray();
    self.severityData = ko.observableArray();
    Params.baseModel.registerComponent("service-requests-main", "service-requests");
    self.payload = ko.observable();

    self.gotoMainScreen = function () {
      Params.dashboard.loadComponent("service-requests-base", {});
    };

    self.goBack = function () {
      self.loadSecondScreen(true);
      Params.dashboard.loadComponent("service-requests-base", {});
    };
  };
});