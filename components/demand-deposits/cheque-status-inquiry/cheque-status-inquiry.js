define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/cheque-status-inquiry",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojbutton",
  "ojs/ojdatetimepicker",
  "ojs/ojswitch",
  "ojs/ojselectcombobox",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlistview",
  "ojs/ojradioset",
  "ojs/ojpagingcontrol",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, ChequeStausInquiry, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.dispose = null;
    self.locale = locale;

    self.accountNumber = ko.observable();
    self.additionalDetails = ko.observable();
    self.validInquiry = ko.observable();

    if (self.params.id) {
      self.accountNumber(self.params.id.value);

      self.additionalDetails({
        account: {
          id: self.params.id
        }
      });
    }

    self.chequeNo = ko.observable();

    self.chequeNo({
      startChequeNumber: null,
      endChequeNumber: null
    });

    self.fromDate = ko.observable();
    self.todayDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
    self.toDate = ko.observable();
    self.chequeStatusOptions = ko.observableArray();
    self.selectedStatusValue = ko.observableArray([]);
    self.chequeStatus = ko.observableArray([]);
    rootParams.dashboard.headerName(self.locale.compName.compName);
    self.showStatusSection = ko.observable(false);
    self.innerStatusVisible = ko.observable(false);
    self.chequeStatusLoaded = ko.observable(false);
    self.showNumberSection = ko.observable(true);
    self.statusEnumLoaded = ko.observable(false);
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerComponent("responsive-select", "inputs");

    self.columnNames = ko.observableArray([{
      headerText: self.locale.chequeStatusInquiry.chequeNumber,
      field: "chequeNumber"
    }, {
      headerText: self.locale.chequeStatusInquiry.status,
      field: "chequeStatus"
    }, {
      headerText: self.locale.chequeStatusInquiry.reason,
      field: "reason",
      headerClassName: self.selectedStatusValue()[0] === "N" ? "hide" : "",
      className: self.selectedStatusValue()[0] === "N" ? "hide" : ""
    }, {
      headerText: self.locale.chequeStatusInquiry.amount,
      field: "chequeAmount",
      renderer: oj.KnockoutTemplateUtils.getRenderer("cheque_amount", true),
      headerClassName: self.selectedStatusValue()[0] === "N" ? "hide" : "",
      className: self.selectedStatusValue()[0] === "N" ? "hide" : ""
    }]);

    self.handleStatusInquiryChange = function (event) {
      self.chequeStatusLoaded(false);

      if (event.detail.value === "Number") {
        self.fromDate(null);
        self.toDate(null);
        self.chequeNo().startChequeNumber = null;
        self.chequeNo().endChequeNumber = null;
        self.selectedStatusValue([]);
        self.showNumberSection(true);
        self.innerStatusVisible(false);
        self.showStatusSection(false);
      } else if (event.detail.value === "Range") {
        self.chequeNo().startChequeNumber = null;
        self.chequeNo().endChequeNumber = null;
        self.fromDate(null);
        self.toDate(null);
        self.selectedStatusValue([]);
        self.showNumberSection(false);
        self.innerStatusVisible(false);
        self.showStatusSection(false);
      } else if (event.detail.value === "Status") {
        self.chequeNo().startChequeNumber = null;
        self.chequeNo().endChequeNumber = null;
        self.fromDate(null);
        self.toDate(null);
        self.showStatusSection(true);
      }
    };

    ChequeStausInquiry.getStatusEnum().done(function (data) {
      const array = $.map(data.enumRepresentations[0].data, function (options) {
        const obj = {
          value: options.code,
          label: options.description
        };

        return obj;
      });

      self.chequeStatusOptions(array);
      self.statusEnumLoaded(true);
    });

    self.getChequeSatus = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("chequeStatus"))) {
        return;
      }

      self.chequeStatusLoaded(false);

      ChequeStausInquiry.getChequeSatus(self.accountNumber(), self.selectedStatusValue()[0], self.chequeNo().startChequeNumber, self.chequeNo().endChequeNumber, self.fromDate(), self.toDate()).done(function (data) {
        self.chequeStatusLoaded(false);
        self.chequeStatus([]);
        self.chequeStatus().length = 0;

        for (let i = 0; i < data.issuedChequeDetails.length; i++) {
          let reason = "";

          if (data.issuedChequeDetails[i].reason) {
            reason = data.issuedChequeDetails[i].reason;
          }

          self.chequeStatus.push({
            chequeNumber: data.issuedChequeDetails[i].chequeNumber,
            reason: reason,
            chequeStatus: locale.chequeStatusInquiry.statusType[data.issuedChequeDetails[i].chequeStatus],
            chequeAmount: data.issuedChequeDetails[i].chequeAmount
          });
        }

        self.chequeStatusLoaded(true);
      });
    };

    self.datasource = new oj.ArrayTableDataSource(self.chequeStatus(), {
      idAttribute: "chequeNumber"
    });

    self.pagingDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.chequeStatus, {
      idAttribute: "chequeNumber"
    }));

    self.statusChange = function (event) {
      if (event.detail.value) {
        self.chequeStatusLoaded(false);
        self.fromDate(null);
        self.toDate(null);

        if (event.detail.value === "N" || event.detail.value === "C") {
          self.innerStatusVisible(false);
        } else {
          self.innerStatusVisible(true);
        }
      }
    };
  };
});
