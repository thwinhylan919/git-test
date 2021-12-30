define([
  "ojs/ojcore",
  "knockout",
    "./model",
  "ojL10n!resources/nls/discrepancies",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojvalidation",
  "ojs/ojradioset",
  "ojs/ojknockout-validation"
], function(oj, ko, ViewDiscrepanciesModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.getNewdiscrepancyModel = function() {
      const koDiscrepancyModel = ViewDiscrepanciesModel.getNewdiscrepancyModel();

      return koDiscrepancyModel;
    };

    const discrepancies = self.getNewdiscrepancyModel().discrepancies;

    ko.utils.extend(self, params.rootModel);

    self.resourceBundle = resourceBundle;
    self.billDetails = self.params.billDetails;
    self.initiateButtonEnabled = self.params.initiateButtonEnabled !== false;
    self.mode = ko.observable();
    self.billReferenceNumber = self.params.billReferenceNumber;
    self.discrepanciesData = ko.observable();
    params.dashboard.headerName(self.resourceBundle.heading.billsCustomerAcceptance);
    self.validationTracker = ko.observable();
    self.branchCode = ko.observable();
    self.resolvedDate = ko.observable();
    self.resolved = ko.observable();
    params.baseModel.registerElement("confirm-screen");
    self.approvalFlag = ko.observable(false);

    self.getRowId = function(rowIndex) {
      return ++rowIndex;
    };

    if (self.params.mode === "VIEW") {
      self.branchCode(self.billReferenceNumber.substring(0, 3));

      ViewDiscrepanciesModel.fetchBranchDate(self.branchCode()).done(function(res) {
        if (res.branchDate) {
          self.resolvedDate(res.branchDate);
        }

        if (res.status.result === "SUCCESSFUL") {
          if (self.billDetails && self.billDetails.length > 0) {
            for (let i = 0; i < self.billDetails.length; i++) {
              discrepancies.discrepancyDTO.push({
                discrepancyCode: self.billDetails[i].discrepancyCode,
                id: self.billReferenceNumber,
                description: self.billDetails[i].description,
                resolved: self.billDetails[i].resolved.toString(),
                resolvedDate: self.billDetails[i].resolved.toString() === "false" ? null : res.branchDate,
                receivedDate: self.billDetails[i].receivedDate,
                counterPartyName: self.billDetails[i].counterPartyName,
                amount: self.billDetails[i].amount
              });
            }

            self.discrepanciesData(new oj.ArrayTableDataSource(discrepancies.discrepancyDTO));
          }
        }
      });

      self.initiateCustomerAcceptance = function() {
        ViewDiscrepanciesModel.initiateCustomerAcceptance(self.billReferenceNumber, ko.mapping.toJSON(discrepancies)).done(function(data, status, jqXhr) {
          const confirmScreenDetailsArray = [
            [{
                label: self.resourceBundle.viewBills.labels.billNo,
                value: self.billReferenceNumber
              },
              {
                label: self.resourceBundle.viewBills.labels.billAmount,
                value: params.baseModel.formatCurrency(self.billDetails[0].amount.amount, self.billDetails[0].amount.currency)
              }
            ],
            [{
              label: self.resourceBundle.viewBills.general.drawerName,
              value: self.billDetails[0].counterPartyName
            }]
          ];

        let hostReferenceNumber = null;

        if (data.customerAcceptance && data.customerAcceptance.applicationNumber) {
          hostReferenceNumber = data.customerAcceptance.applicationNumber;
        }
        else if (data.customerAcceptance && data.customerAcceptance.id) {
          hostReferenceNumber = data.customerAcceptance.id;
        } else {
          hostReferenceNumber = null;
        }

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            hostReferenceNumber: hostReferenceNumber,
            transactionName: self.resourceBundle.labels.customerAcceptanceInitiation,
            confirmScreenExtensions: {
              isSet: true,
              taskCode: "TF_N_CAB",
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/trade-finance"
            }
          }, self);
        });
      };

      self.goBack = function() {
             history.back();

      };

      self.onChangeHandler = function(event) {
        if (event.detail.value) {
          const discrepancyCode = event.target.id;

          discrepancies.discrepancyDTO.forEach(function(entry) {
            if (entry.discrepancyCode === discrepancyCode) {
              if (event.detail.value === "false") {
                entry.resolvedDate = null;
                entry.resolved = false;
              } else {
                entry.resolvedDate = self.resolvedDate();
                entry.resolved = true;
              }
            }
          });
        }
      };
    }

    if (self.params.transactionId && self.params.mode === "approval") {
      self.mode("REVIEW");
      self.approvalFlag(true);

      const listDescrepancies = [];

      self.discrepancyDetails = self.params.data;
      self.billReferenceNumber = ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[0].id);

      if (self.discrepancyDetails && self.discrepancyDetails.discrepancyDTO.length > 0) {
        for (let i = 0; i < self.discrepancyDetails.discrepancyDTO.length; i++) {
          listDescrepancies.push({
            discrepancyCode: ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].discrepancyCode),
            id: ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].id),
            description: ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].description),
            resolved: ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].resolved).toString(),
            receivedDate: ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].receivedDate),
            resolvedDate: ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].resolved).toString() === "false" ? null : ko.utils.unwrapObservable(self.discrepancyDetails.discrepancyDTO[i].resolvedDate)
          });
        }

        self.discrepanciesData(new oj.ArrayTableDataSource(listDescrepancies));
      }
    }
  };
});