define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/credit-line-limit",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojselectcombobox",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (oj, ko, CreditLineModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this;

    self.resourceBundle = resourceBundle;
    self.partyId = ko.observable();
    self.customerIdArray = ko.observableArray();
    self.validationTracker = ko.observable();
    self.dataSourceCreated = ko.observable(false);
    self.dataSource = ko.observable();
    self.listCreditLines = ko.observableArray();
    self.customerName = ko.observable();
    self.overallLimit = ko.observable();
    self.lineLimitValidGroup = ko.observable();
    self.lineLimitTracker = ko.observable();
    ko.utils.extend(self, params.rootModel);
    params.dashboard.headerName(self.resourceBundle.heading.lineLimit);
    params.baseModel.registerComponent("view-line-limit", "credit-line-limit");

    CreditLineModel.fetchParty().done(function (data) {
      CreditLineModel.fetchPartyRelations().done(function (partyData) {
        const parties = [],
          mappedParties = partyData.partyToPartyRelationship;

        if (mappedParties.length > 0) {
          parties.push({
            value: "ALL",
            label: self.resourceBundle.labels.all
          });
        }

        parties.push({
          label: data.party.id.displayValue,
          value: data.party.id.value
        });

        for (let i = 0; i < mappedParties.length; i++) {
          parties.push({
            value: mappedParties[i].relatedParty.value,
            label: mappedParties[i].relatedParty.displayValue
          });
        }

        self.customerIdArray(parties);
      });
    });

    self.onLimitSelected = function (data) {
      CreditLineModel.getLimitDetails(data.partyId.value, data.line_id).done(function (data) {
        const parameters = {
          mode: "VIEW",
          lineLimitDetails: data.lineLimitsDTO
        };

        params.dashboard.loadComponent("view-line-limit", parameters, self);
      });
    };

    function fetchPartyDetails(partyId) {
      CreditLineModel.fetchPartyDetails(partyId).done(function (data) {
        if (data.party) {
          self.customerName(data.party.personalDetails.fullName);
        }
      });
    }

    self.partyIdSubscribe = self.partyId.subscribe(function (newValue) {
      self.dataSourceCreated(false);

      if (newValue !== "ALL") {
        fetchPartyDetails(newValue);
      }
    });

    function setSubLineDTOs(subLinesDTOs, serialNumber) {
      for (let i = 0; i < subLinesDTOs.length; i++) {
        self.listCreditLines.push({
          main_line: params.baseModel.format(self.resourceBundle.lineName, {
            mainLine: subLinesDTOs[i].lineName,
            serialNumber: serialNumber
          }),
          line_id: params.baseModel.format(self.resourceBundle.lineId, {
            lineId: subLinesDTOs[i].lineId,
            serialNumber: subLinesDTOs[i].serialNumber
          }),
          start_date: subLinesDTOs[i].lineStartDate,
          expiry_date: subLinesDTOs[i].lineExpiryDate,
          line_amount: params.baseModel.formatCurrency(subLinesDTOs[i].totalLimit.amount, subLinesDTOs[i].totalLimit.currency),
          utilized_amount: params.baseModel.formatCurrency(subLinesDTOs[i].utilizedLimit.amount, subLinesDTOs[i].utilizedLimit.currency),
          outstanding_amount: params.baseModel.formatCurrency(subLinesDTOs[i].outstandingAmount.amount, subLinesDTOs[i].outstandingAmount.currency),
          revolving_values: self.resourceBundle.labels[subLinesDTOs[i].revolvingValues],
          partyId: subLinesDTOs[i].partyId,

          main_line_field: subLinesDTOs[i].lineName ? subLinesDTOs[i].lineName : "",
          line_id_field: subLinesDTOs[i].lineId ? subLinesDTOs[i].lineId : "",
          start_date_field: subLinesDTOs[i].lineStartDate ? subLinesDTOs[i].lineStartDate : "",
          expiry_date_field: subLinesDTOs[i].lineExpiryDate ? subLinesDTOs[i].lineExpiryDate : "",
          line_amount_field: subLinesDTOs[i].totalLimit ? subLinesDTOs[i].totalLimit.amount : 0,
          utilized_amount_field: subLinesDTOs[i].utilizedLimit ? subLinesDTOs[i].utilizedLimit.amount : 0,
          outstanding_amount_field: subLinesDTOs[i].outstandingAmount ? subLinesDTOs[i].outstandingAmount.amount : 0
        });

        if (subLinesDTOs[i].subLinesDTOs.length > 0) {
          setSubLineDTOs(subLinesDTOs[i].subLinesDTOs, subLinesDTOs[i].serialNumber);
        }
      }
    }

    self.reset = function () {
      self.partyId([]);
      self.dataSourceCreated(false);
    };

    self.getCreditLimits = function () {
      const tracker = document.getElementById("lineLimitTracker");

      if (tracker.valid === "valid") {
        self.dataSourceCreated(false);
        self.listCreditLines.removeAll();
        self.overallLimit(null);

        CreditLineModel.getCreditLimits(self.partyId()).done(function (data) {
          self.listCreditLines.removeAll();
          data.lineLimitsDTOs = params.baseModel.sortLib(data.lineLimitsDTOs, ["expiryDate"], ["desc"]);

          if (data.lineLimitsDTOs.length > 0) {
            if (data.lineLimitsDTOs[0].overallLimit) { self.overallLimit(params.baseModel.formatCurrency(data.lineLimitsDTOs[0].overallLimit.amount, data.lineLimitsDTOs[0].overallLimit.currency)); }
          }

          for (let i = 0; i < data.lineLimitsDTOs.length; i++) {
            self.listCreditLines.push({
              main_line: data.lineLimitsDTOs[i].lineName,
              line_id: params.baseModel.format(self.resourceBundle.lineId, {
                lineId: data.lineLimitsDTOs[i].lineId,
                serialNumber: data.lineLimitsDTOs[i].serialNumber

              }),
              start_date: data.lineLimitsDTOs[i].lineStartDate,
              expiry_date: data.lineLimitsDTOs[i].lineExpiryDate,
              line_amount: params.baseModel.formatCurrency(data.lineLimitsDTOs[i].totalLimit.amount, data.lineLimitsDTOs[i].totalLimit.currency),
              utilized_amount: params.baseModel.formatCurrency(data.lineLimitsDTOs[i].utilizedLimit.amount, data.lineLimitsDTOs[i].utilizedLimit.currency),
              outstanding_amount: params.baseModel.formatCurrency(data.lineLimitsDTOs[i].outstandingAmount.amount, data.lineLimitsDTOs[i].outstandingAmount.currency),
              revolving_values: self.resourceBundle.labels[data.lineLimitsDTOs[i].revolvingValues],
              partyId: data.lineLimitsDTOs[i].partyId,

              main_line_field: data.lineLimitsDTOs[i].lineName ? data.lineLimitsDTOs[i].lineName : "",
              line_id_field: data.lineLimitsDTOs[i].lineId ? data.lineLimitsDTOs[i].lineId : "",
              start_date_field: data.lineLimitsDTOs[i].lineStartDate ? data.lineLimitsDTOs[i].lineStartDate : "",
              expiry_date_field: data.lineLimitsDTOs[i].lineExpiryDate ? data.lineLimitsDTOs[i].lineExpiryDate : "",
              line_amount_field: data.lineLimitsDTOs[i].totalLimit ? data.lineLimitsDTOs[i].totalLimit.amount : 0,
              utilized_amount_field: data.lineLimitsDTOs[i].utilizedLimit ? data.lineLimitsDTOs[i].utilizedLimit.amount : 0,
              outstanding_amount_field: data.lineLimitsDTOs[i].outstandingAmount ? data.lineLimitsDTOs[i].outstandingAmount.amount : 0
            });

            if (data.lineLimitsDTOs[i].subLinesDTOs.length > 0) {
              setSubLineDTOs(data.lineLimitsDTOs[i].subLinesDTOs, data.lineLimitsDTOs[i].serialNumber);
            }
          }

          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listCreditLines(), {
            idAttribute: ["line_id"]
          })));

          self.dataSourceCreated(true);
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };

  vm.prototype.dispose = function () {
    this.partyIdSubscribe.dispose();
  };

  return vm;
});