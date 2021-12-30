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
], function (oj, ko, $, ImportBillModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(ImportBillModel.getNewModel());

        return KoModel;
      };

     self.model = getNewKoModel().model;
     ko.utils.extend(self, params.rootModel);
     self.dataSourceCreated = ko.observable(false);
     self.listImportBills = ko.observableArray();
     self.dataSource = ko.observableArray();

    if(self.params.backView && self.params.backView()){
      if(params.rootModel.params.list.length>0){
      self.listImportBills(params.rootModel.params.list);

      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listImportBills(), {
        idAttribute: ["billNumber"]
      })));

      self.dataSourceCreated(true);
    }

      self.model.billNumber=params.rootModel.params.billNumber;
      self.model.drawerName=params.rootModel.params.drawerName;
      self.model.status=params.rootModel.params.status;
      self.model.draweeName=params.rootModel.params.draweeName;
    }

    self.draweeNameArray = ko.observableArray();
    self.validationTracker = ko.observable();
    self.moreSearchOptions = ko.observable(false);

    self.resourceBundle = resourceBundle;
    self.importBillsValidGroup = ko.observable();
    self.importBillsTracker = ko.observable();
    params.dashboard.headerName(self.resourceBundle.heading.importBills);
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

          self.model.draweeName([]);
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
     * This is a function which feteches the list of import bills searched on basis of parameters.
     *
     * @function getListImportBills
     * @returns {list} Of import bills.
     */
    function getListImportBills() {
      self.dataSourceCreated(false);
      self.listImportBills.removeAll();

      let key;

      for (key in self.model) {
        if (self.model[key]) {
          if (self.model[key]() === null) { self.model[key](""); }
        }
      }

      const payload = ko.mapping.toJS(self.model);

      ImportBillModel.getListImportBills(payload).done(function (data) {
        for (let i = 0; i < data.billDTOs.length; i++) {
          self.listImportBills.push({
            billNumber: data.billDTOs[i].id,
            releaseAgainst: data.billDTOs[i].productName,
            transactionDate: data.billDTOs[i].transactionDate,
            billAmount_field: data.billDTOs[i].amount.amount,
            billAmount: params.baseModel.formatCurrency(data.billDTOs[i].amount.amount, data.billDTOs[i].amount.currency),
            status_field: data.billDTOs[i].contractStatus,
            status: capitalize(data.billDTOs[i].contractStatus),
            drawer: data.billDTOs[i].counterPartyName,
            billType: data.billDTOs[i].billType
          });
        }

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listImportBills(), {
          idAttribute: ["billNumber"]
        })));

        self.dataSourceCreated(true);
      });
    }

    if (self.draweeNameArray().length === 0) {
      ImportBillModel.fetchPartyDetails().done(function (data) {
        self.draweeNameArray.push({
          label: data.party.personalDetails.fullName,
          value: data.party.id.value
        });

        ImportBillModel.fetchPartyRelations().done(function (partyData) {
          for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
            self.draweeNameArray.push({
              label: partyData.partyToPartyRelationship[i].relatedPartyName,
              value: partyData.partyToPartyRelationship[i].relatedParty.value
            });
          }

          if (params.baseModel.small()) {
            self.model.draweeName(self.draweeNameArray()[0].value);
            getListImportBills();
          }
        });
      });
    }

    self.searchImportBills = function () {
      const tracker = document.getElementById("importBillsTracker");

      if (tracker.valid === "valid") {
        getListImportBills();
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

      ImportBillModel.fetchPDF(payload);
    };

    self.onBillSelected = function (data) {
      ImportBillModel.getBillDetails(data.billNumber).done(function (response) {
        if (response.bill) {
          response.bill.contractStatus = capitalize(response.bill.contractStatus);

          const parameters = {
            mode: "VIEW",
            list:self.listImportBills(),
            billDetails: response.bill,
            billNumber:self.model.billNumber,
            draweeName:self.model.draweeName,
            status:self.model.status,
            drawerName:self.model.drawerName
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

          self.model.draweeName([]);
          self.model.status([]);
        }
      }

      self.model.draweeName(self.draweeNameArray()[0].value);
    };

    self.filterList = function () {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      $("#searchModal").hide();
      getListImportBills();
    };

    self.dispose = function () {
      issueDateSubscribe.dispose();
    };
  };

  return vm;
});