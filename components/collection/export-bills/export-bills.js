define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-bills",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, ExportBillModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(ExportBillModel.getNewModel());

        return KoModel;
      };

    self.model = getNewKoModel().model;
    ko.utils.extend(self, params.rootModel);

    self.dataSourceCreated = ko.observable(false);
    self.listExportBills = ko.observableArray();
    self.dataSource = ko.observableArray();

    if (self.params.backView && self.params.backView()) {
      if (params.rootModel.params.list.length > 0) {
        self.listExportBills(params.rootModel.params.list);

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listExportBills(), {
          idAttribute: ["billNumber"]
        })));

        self.dataSourceCreated(true);
      }

      self.model.billNumber = params.rootModel.params.billNumber;
      self.model.drawerName = params.rootModel.params.drawerName;
      self.model.status = params.rootModel.params.status;
      self.model.draweeName = params.rootModel.params.draweeName;
    }

    self.drawerNameArray = ko.observableArray();
    self.moreSearchOptions = ko.observable(false);

    self.resourceBundle = resourceBundle;
    self.validationTracker = ko.observable();
    self.exportBillsValidGroup = ko.observable();
    self.exportBillsTracker = ko.observable();
    params.dashboard.headerName(self.resourceBundle.heading.exportBills);
    params.baseModel.registerComponent("view-bills", "collection");

    self.billStatusArray = ko.observable([{
      label: self.resourceBundle.common.labels.active,
      value: "ACTIVE"
    },
    {
      label: self.resourceBundle.common.labels.hold,
      value: "HOLD"
    },
    {
      label: self.resourceBundle.common.labels.cancelled,
      value: "CANCELLED"
    },
    {
      label: self.resourceBundle.labels.liquidated,
      value: "LIQUIDATED"
    },
    {
      label: self.resourceBundle.common.labels.closed,
      value: "CLOSED"
    },
    {
      label: self.resourceBundle.common.labels.reversed,
      value: "REVERSED"
    }
    ]);

    self.showMoreSearchOptions = function () {
      self.moreSearchOptions(!self.moreSearchOptions());
    };

    self.hyphen = "-";

    const d = params.baseModel.getDate(),
      today = d.getFullYear() + self.hyphen + (d.getMonth() + 1) + self.hyphen + d.getDate();

    self.maxToIssueDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(d));
    self.maxFromIssueDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(d));

    /**
     * This is a function which capitalizes a string which is given as a parameter.
     *
     * @function capitalize
     * @returns {string} With first letter as capital.
     * @param {string} string - The string to be capitalized.
     */
    function capitalize(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
    }

    const issueDateSubscribe = self.model.issueDateto.subscribe(function (newValue) {
      if (newValue !== "" && newValue < today) {
        self.maxFromIssueDate(newValue);
      }
    });

    self.reset = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (key !== "billType") {
            self.model[key]("");
          }

          self.model.drawerName([]);
          self.model.status([]);
        }
      }

      self.dataSourceCreated(false);
    };

    self.validateFromAmount = {
      validate: function (value) {
        if (isNaN(value) || value.length > 15 || value < 0) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
        }

        if (self.model.toAmount()) {
          let from;

          if (params.baseModel.small()) {
            from = oj.Components.getWidgetConstructor($("#toAmountOfModal"));
          } else {
            from = oj.Components.getWidgetConstructor($("#toAmount"));
          }

          if (typeof from === "function") {
            from("validate");
          }
        }
      }
    };

    self.validateToAmount = {
      validate: function (value) {
        if (isNaN(value) || value.length > 15 || value < 0) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
        }

        if (self.model.fromAmount()) {
          if (Number(value) < Number(self.model.fromAmount())) {
            throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.fromToAmountMsg));
          }
        }
      }
    };

    /**
     * This is a function which feteches the list of export bills searched on basis of parameters.
     *
     * @function getListExportBills
     * @returns {list} Of export bills.
     */
    function getListExportBills() {
      self.dataSourceCreated(false);
      self.listExportBills.removeAll();

      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null) { self.model[key](""); }
        }
      }

      const payload = ko.mapping.toJS(self.model);

      ExportBillModel.getListExportBills(payload).done(function (data) {
        for (let i = 0; i < data.billDTOs.length; i++) {
          self.listExportBills.push({
            billNumber: data.billDTOs[i].id,
            releaseAgainst: data.billDTOs[i].productName,
            transactionDate: data.billDTOs[i].transactionDate,
            billAmount_field: data.billDTOs[i].amount.amount ? data.billDTOs[i].amount.amount : 0,
            billAmount: params.baseModel.formatCurrency(data.billDTOs[i].amount.amount, data.billDTOs[i].amount.currency),
            status: capitalize(data.billDTOs[i].contractStatus),
            drawee: data.billDTOs[i].counterPartyName ? data.billDTOs[i].counterPartyName : "",
            billType: data.billDTOs[i].billType
          });
        }

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listExportBills(), {
          idAttribute: ["billNumber"]
        })));

        self.dataSourceCreated(true);
      });
    }

    if (self.drawerNameArray().length === 0) {
      ExportBillModel.fetchPartyDetails().done(function (data) {
        self.drawerNameArray.push({
          label: data.party.personalDetails.fullName,
          value: data.party.id.value
        });

        ExportBillModel.fetchPartyRelations().done(function (partyData) {
          for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
            self.drawerNameArray.push({
              label: partyData.partyToPartyRelationship[i].relatedPartyName,
              value: partyData.partyToPartyRelationship[i].relatedParty.value
            });
          }

          if (params.baseModel.small()) {
            self.model.drawerName(self.drawerNameArray()[0].value);
            getListExportBills();
          }
        });
      });
    }

    self.searchExportBills = function () {
      const tracker = document.getElementById("exportBillsTracker");

      if (tracker.valid === "valid") {
        getListExportBills();
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.download = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null) { self.model[key](""); }
        }
      }

      const payload = ko.mapping.toJS(self.model);

      ExportBillModel.fetchPDF(payload);
    };

    self.onBillSelected = function (data) {
      ExportBillModel.getBillDetails(data.billNumber).done(function (response) {
        if (response.bill) {
          response.bill.contractStatus = capitalize(response.bill.contractStatus);

          const parameters = {
            mode: "VIEW",
            billDetails: response.bill,
            list: self.listExportBills(),
            billNumber: self.model.billNumber,
            draweeName: self.model.draweeName,
            status: self.model.status,
            drawerName: self.model.drawerName
          };

          params.dashboard.loadComponent("view-bills", parameters);
        } else {
          params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.messages.noRecordFound], "ERROR");
        }
      });
    };

    self.openFilterModal = function () {
      $("#searchModal").trigger("openModal");
    };

    self.hideSearchModal = function () {
      $("#searchModal").hide();
    };

    self.resetFilterModel = function () {
      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (key !== "billType") {
            self.model[key]("");
          }

          self.model.status([]);
        }
      }

      self.model.drawerName(self.drawerNameArray()[0].value);
    };

    self.filterList = function () {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      $("#searchModal").hide();
      getListExportBills();
    };

    self.dispose = function () {
      issueDateSubscribe.dispose();
    };
  };

  return vm;
});