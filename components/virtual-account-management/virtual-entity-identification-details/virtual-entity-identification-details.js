define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-entity-identification-details",
  "ojs/ojtrain",
  "ojs/ojswitch",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojradioset"
], function (oj, ko, VirtualEntityModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("review-virtual-entity", "virtual-account-management");
    self.identificationTypeList = ko.observableArray();
    self.frequencyOptions = ko.observableArray();
    self.dueOnOptions = ko.observableArray();
    self.identificationTemplateLoaded = ko.observable(false);
    self.frequencyTemplateLoaded = ko.observable(false);
    self.dueOnTemplateLoaded = ko.observable(true);
    self.mappedVirtualAccounts = ko.observable();
    self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(params.baseModel.getDate()));

    const checkObservable = function (val) {
        if (ko.isObservable(val)) {
          return val() ? val() : "";
        }

        return val ? val : "";
      },
      fillDueOnOptions = function (code, description) {
        self.dueOnOptions.push({
          code: code,
          description: description
        });
      },
      SelectedFrequencyOptionHelper = function (data) {
        if (data instanceof Array) {
          for (let i = 0; i < data.length; i++) {
            fillDueOnOptions(i + 1, data[i]);
          }
        } else if (typeof data === "number") {
          for (let i = 0; i < data; i++) {
            fillDueOnOptions(i + 1, i + 1);
          }
        }
      },
      getDueOnWeeklyOptions = function () {
        const listOfDays = oj.LocaleData.getDayNames();

        listOfDays.push(listOfDays.shift());
        SelectedFrequencyOptionHelper(listOfDays);
      },

      checkIfLeapYear = function (year) {
        return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
      },

      getDueOnMonthlyOptions = function () {
        const currentMonth = params.baseModel.getDate().getMonth(),
          currentYear = params.baseModel.getDate().getFullYear();

        if (currentMonth === 1) {
          if (checkIfLeapYear(currentYear)) {
            SelectedFrequencyOptionHelper(29);
          } else {
            SelectedFrequencyOptionHelper(28);
          }
        } else if (currentMonth === 3 || currentMonth === 5 || currentMonth === 8 || currentMonth === 10) {
          SelectedFrequencyOptionHelper(30);
        } else {
          SelectedFrequencyOptionHelper(31);
        }
      },

      getDueOnQuarterlyOptions = function () {
        SelectedFrequencyOptionHelper(3);
      },

      getDueOnHalfYearlyOptions = function () {
        SelectedFrequencyOptionHelper(6);
      },

      getDueOnYearlyOptions = function () {
        const listOfMonths = oj.LocaleData.getMonthNames();

        SelectedFrequencyOptionHelper(listOfMonths);
      },

      valuesForDueOn = function (selectedFrequency) {
        if (selectedFrequency === "D") {
          fillDueOnOptions("0", 0);
        } else if (selectedFrequency === "W") {
          getDueOnWeeklyOptions();
        } else if (selectedFrequency === "M") {
          getDueOnMonthlyOptions();
        } else if (selectedFrequency === "Q") {
          getDueOnQuarterlyOptions();
        } else if (selectedFrequency === "H") {
          getDueOnHalfYearlyOptions();
        } else if (selectedFrequency === "Y") {
          getDueOnYearlyOptions();
        }
      };

    if (!self.identificationTemplateLoaded()) {
      VirtualEntityModel.fetchIdentificationTypeList().then(function (data) {
        self.identificationTemplateLoaded(true);

        if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
          self.identificationTypeList(data.jsonNode.data);
        }
      });
    }

    self.frequencyTypes = function () {

      const frequencyTypesResponse = [{
          code: "D",
          description: self.resource.daily
        }, {
          code: "W",
          description: self.resource.weekly
        }, {
          code: "M",
          description: self.resource.monthly
        },
        {
          code: "Q",
          description: self.resource.quarterly
        },
        {
          code: "H",
          description: self.resource.halfYearly
        },
        {
          code: "Y",
          description: self.resource.yearly
        }
      ];

      for (let i = 0; i < frequencyTypesResponse.length; i++) {
        self.frequencyOptions.push({
          code: frequencyTypesResponse[i].code,
          description: frequencyTypesResponse[i].description
        });
      }

      self.frequencyTemplateLoaded(true);
    };

    self.frequencyTypes();

    const maskValue = function (observable, value) {
      if (value.length > 0) {

        let str = value;

        if (str.length > 4) {
          str = str.replace(/.(?=.{4})/g, "x");
        } else if (str.length > 2) {
          str = str.replace(/.(?=.{2})/g, "x");
        } else {
          str = str.replace(/.(?=.{1})/g, "x");
        }

        observable(str);
      }
    };

    if (params.rootModel.params.reviewMode) {
      self.viewMode(false);
      self.reviewMode(true);

      if (self.viewModel.identificationNumber()) {
        maskValue(self.identificationNoDisplay, self.viewModel.identificationNumber());
      }
    }

    self.frequencySelectionHandler = function (event) {
      self.dueOnTemplateLoaded(false);
      self.modelInstance.statementPreferences.dueOn(null);
      ko.tasks.runEarly();
      self.dueOnOptions.removeAll();
      valuesForDueOn(event.detail.value);
      self.dueOnTemplateLoaded(true);
    };

    self.goToReviewEntity = function () {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        params.dashboard.loadComponent("review-virtual-entity", {
          viewDTO: params.rootModel.params.viewDTO,
          reviewDTO: ko.mapping.toJS(self.modelInstance),
          reviewMode: true,
          editFromViewScreen: params.rootModel.params.editFromViewScreen,
          checkboxFlag: self.checkboxFlag(),
          mailingCheckboxFlag: self.mailingCheckboxFlag(),
          realEntityAddress: self.realEntityAddress()[0],
          mappedVirtualAccounts: params.rootModel.params.mappedVirtualAccounts
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };

    if (params.rootModel.params.viewMode || params.rootModel.params.reviewMode || params.rootModel.params.data) {
      maskValue(self.identificationNoDisplay, checkObservable(self.viewModel.identificationNumber()));
      maskValue(self.individualNationalIdMasked, checkObservable(self.viewModel.individualDetails.identificationNumber()));
      self.viewMode(!!params.rootModel.params.viewMode);
      self.reviewMode(!!params.rootModel.params.reviewMode);
      self.mappedVirtualAccounts(params.rootModel.params.mappedVirtualAccounts);

      valuesForDueOn(self.viewModel.statementPreferences.frequency());

    } else if (self.modelInstance) {
      if (self.modelInstance.identificationNumber()) {
        maskValue(self.identificationNoDisplay, self.modelInstance.identificationNumber());
      }

      valuesForDueOn(self.modelInstance.statementPreferences.frequency());
    }
  };
});