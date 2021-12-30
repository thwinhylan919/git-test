define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!extensions/resources/nls/td-open",
  "ojL10n!resources/nls/td-payout",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojlistview",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, OpenTdModel, locale, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.maturityDate = ko.observable();
    self.validationTracker = ko.observable();
    self.maturityDetails = ko.observable();
    self.maturityDetailsLoaded = ko.observable(false);
    self.depositTypeLoaded = ko.observable();
    self.openTDReview = ko.observable(false);
    self.depositTypesLoaded = ko.observable(false);
    self.openTDSuccessful = ko.observable(false);
    self.additionalDetails = ko.observable();
    self.groupValid = ko.observable();
    self.currentTask = ko.observable("TD_F_OTD");
    self.customURL = ko.observable();
    self.depositTypeChanged = ko.observable(true);
    self.createTDDetails = ko.observable();
    self.productCcyDetails = [];
    self.referenceNumber = ko.observable();
    self.showSweepinIcon = ko.observable(true);
    self.tenureDaysLoaded = ko.observable();

    self.jointParties = ko.observableArray([
      "",
      ""
    ]);

    self.parties = ko.observableArray([
      "",
      ""
    ]);

    self.depositTypesList = {
      CON: "Conventional",
      RFC: "RFC",
      FCNR: "FCNR",
      NRE: "NRE",
      NRO: "NRO"
    };

    self.minAmount = ko.observable();
    self.changedCurrency = ko.observable();
    self.maxAmount = ko.observable();
    self.jointAccount = ko.observable(true);
    self.depositMessage = ko.observable();
    self.partyEnums = ko.observableArray();
    self.partyDetailsLoaded = ko.observable(false);
    self.selectedParty = ko.observable();
    self.transactionStatus = ko.observable();
    self.depositAmountCheck = ko.observable(false);
    self.transactionId = ko.observable();
    self.rawPayoutInstructions = null;
    self.component = ko.observable();
    self.module = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.url = rootParams.rootModel.url ? ko.mapping.fromJS(rootParams.rootModel.url) : ko.observable();

    if (self.previousState) {
      self.productType = ko.mapping.fromJS(self.previousState.productType);
      self.minTenure = ko.observable(self.previousState.minTenure);
      self.maxTenure = ko.observable(self.previousState.maxTenure);
      self.isMinor = ko.mapping.fromJS(self.previousState.minor);
      self.depositTypeList = ko.observableArray(self.previousState.depositTypeList);
      self.loadedFromReview = ko.observable(self.previousState.loadedFromReview);
      self.maturityInstructionListLoaded = ko.observable(true);
      self.maturityInstructionLoaded = ko.observable(true);
      self.maturityInstructionList = ko.observableArray(self.previousState.maturityInstructionList);
      self.holdingPattern = ko.observableArray(self.previousState.holdingPattern);
      self.hostSupportsNominee = ko.observable(self.previousState.hostSupportsNominee);
      self.manageNominee = ko.observable(self.previousState.manageNominee);
      self.accountModule = ko.observable(self.previousState.accountModule);
      self.isNomineeRequired = ko.observable(self.previousState.isNomineeRequired);
      self.depositTenureCheck = ko.observable(self.previousState.depositTenureCheck);
      self.productSelected = ko.mapping.fromJS(self.previousState.productSelected);
    } else {
      self.productType = ko.observable();
      self.minTenure = ko.observable();
      self.maxTenure = ko.observable();
      self.isMinor = ko.observable(false);
      self.depositTypeList = ko.observableArray([]);
      self.loadedFromReview = ko.observable(false);
      self.maturityInstructionListLoaded = ko.observable(false);
      self.maturityInstructionLoaded = ko.observable(false);
      self.maturityInstructionList = ko.observableArray();
      self.holdingPattern = ko.observableArray();
      self.hostSupportsNominee = ko.observable(false);
      self.manageNominee = ko.observable();
      self.accountModule = ko.observable();
      self.isNomineeRequired = ko.observable(false);
      self.depositTenureCheck = ko.observable();
      self.productSelected = ko.observable(false);
    }

    self.productId = self.productId || ko.observableArray();
    self.locale = locale;
    self.resourceBundle = resourceBundle;
    self.isProductSelected = ko.observable(false);
    self.interestSlabsLoaded = ko.observable(false);
    self.minDate = ko.observable();
    self.maxDate = ko.observable();
    self.amount = ko.observable();
    self.sourceCurrency = ko.observable();
    self.currentExchangeRate = ko.observable();
    self.exchangeAmount = ko.observable();
    self.foreignAmount = ko.observable(1);
    self.showRate = ko.observable(false);
    rootParams.baseModel.registerComponent("view-interest-rate", "term-deposits");
    rootParams.baseModel.registerComponent("product-list", "term-deposits");
    rootParams.baseModel.registerComponent("account", "term-deposits");
    rootParams.baseModel.registerComponent("deposit-type", "term-deposits");
    rootParams.baseModel.registerComponent("nominee", "term-deposits");
    rootParams.baseModel.registerComponent("td-payout", "term-deposits");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("review-td-open", "term-deposits");
    self.tenureDays = ko.observableArray([]);

    rootParams.dashboard.helpComponent.params({
      td: {
        productType: self.productType
      }
    });

    let caseModify,
      maturityListData;
    const islamicMaturityInstructions = [{
          code: "A",
          description: self.locale.openTermDeposit.islamicMaturityInstructions.A
        },
        {
          code: "I",
          description: self.locale.openTermDeposit.islamicMaturityInstructions.I
        },
        {
          code: "P",
          description: self.locale.openTermDeposit.islamicMaturityInstructions.P
        },
        {
          code: "S",
          description: self.locale.openTermDeposit.islamicMaturityInstructions.S
        }
      ],
      getNewKoModel = function () {
        const KoModel = OpenTdModel.getNewModel(self.transactionId(), self.versionId);

        return ko.mapping.fromJS(KoModel);
      };

    /**
     * This function is triggered when user checks or uncheck the checkbox.
     *
     * @memberOf td-open
     * @function holdingPatternChangeHandler
     * @returns {void}
     */
    self.holdingPatternChangeHandler = function () {
      self.rootModelInstance.createTDData.holdingPattern(self.holdingPattern()[0] || "JOINT");

      if (self.rootModelInstance.createTDData.holdingPattern() !== "JOINT") {
        self.jointParties = ko.observableArray([
          "",
          ""
        ]);
      } else {
        self.jointParties = self.parties;
      }
    };

    function calculateTenure(date) {
      const startDate = new Date(date),
        diffDate = new Date(startDate - rootParams.baseModel.getDate());

      self.rootModelInstance.createTDData.tenure.years(diffDate.toISOString().slice(0, 4) - 1970);
      self.rootModelInstance.createTDData.tenure.months(diffDate.getMonth());
      self.rootModelInstance.createTDData.tenure.days(diffDate.getDate() - 1);
    }

    self.validateTenure = {
      validate: function (value) {
        if (value !== null && (isNaN(value) || value < 0)) {
          throw new oj.ValidatorError("", locale.openTermDeposit.validation.error);
        }

        return true;
      }
    };

    self.rootModelInstance = getNewKoModel();
    self.rootModelInstance.createTDData = rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState.data) : getNewKoModel().createTDData;

    self.addNomineeModel = rootParams.rootModel.previousState ? ko.mapping.fromJS(
      rootParams.rootModel.previousState.addNomineeModel) : getNewKoModel().addNomineeModel;

    if (self.transactionId()) {
      caseModify = "INIT";

      const test = {};

      test.createTDData = ko.mapping.toJS(self);
      ko.utils.extend(self.rootModelInstance.createTDData, ko.mapping.fromJS(test.createTDData));

      if (!self.rootModelInstance.createTDData.payoutInstructions()[0]) {
        self.rootModelInstance.createTDData.payoutInstructions = getNewKoModel().createTDData.payoutInstructions;
      }

      self.depositAmountCheck(true);

      if (self.rootModelInstance.createTDData.tenure) {
        self.depositTenureCheck("TENURE");
      }

      if (self.rootModelInstance.createTDData.date) {
        self.depositTenureCheck("DATE");
      }
    } else if (!self.depositTenureCheck() && self.rootModelInstance.createTDData.maturityDate && self.rootModelInstance.createTDData.maturityDate() && !(self.rootModelInstance.createTDData.tenure.days() || self.rootModelInstance.createTDData.tenure.months() || self.rootModelInstance.createTDData.tenure.years())) {
      self.depositTenureCheck("DATE");
    } else if (!self.depositTenureCheck()) {
      self.depositTenureCheck("TENURE");
    }

    OpenTdModel.fetchPartyDetails().then(function (data) {
      self.partyDetail = {
        partyId: "",
        partyName: ""
      };

      self.partyDetail.partyId = "not found";
      self.partyDetail.partyName = data.party.personalDetails.fullName;
      self.partyEnums().push(self.partyDetail);

      OpenTdModel.fetchLinkedPartyDetails().then(function (result) {
        const partyList = result.partyToPartyRelationship;

        ko.utils.arrayForEach(partyList, function (item) {
          self.relatedPartyDetail = {
            partyId: "",
            partyName: ""
          };

          self.relatedPartyDetail.partyId = item.relatedParty.value;
          self.relatedPartyDetail.partyName = item.relatedPartyName;
          self.partyEnums().push(self.relatedPartyDetail);
        });

        self.partyDetailsLoaded(true);
      });
    });

    /**
     * This function will be triggered when account for PayIn is selected by user.
     *
     * @memberOf td-open
     * @function subscriptionAdditionalDetailsAccount
     * param1 {object} additionalDetailsTransfer An object containing the details of current account
     * @returns {void}
     */
    const subscriptionAdditionalDetailsAccount = self.additionalDetails.subscribe(function () {
      if (!self.loadedFromReview()) {
        self.rootModelInstance.createTDData.holdingPattern(self.additionalDetails().account.holdingPattern);

        if (self.rootModelInstance.createTDData.holdingPattern() === "SINGLE") {
          self.holdingPattern.removeAll();
        }
      }

      self.accountModule(self.additionalDetails().account.module);
      self.jointAccount(self.additionalDetails().account.holdingPattern === "JOINT");
      self.sourceCurrency(self.additionalDetails().account.currencyCode);
    });

    self.loadTenureDays = function (productId) {

      OpenTdModel.getTenureDays(productId).then(function (data) {

        if (data.configResponseList !== null && data.configResponseList.length > 0) {
          const tempArray = data.configResponseList[0].propertyValue.split("~");

          for (let i = 0; i < tempArray.length; i++) {

            const tenureItem = {
              label: rootParams.baseModel.format(self.locale.tenureDays.tenureLabel, {
                day: tempArray[i]
              }),
              value: tempArray[i]
            };

            self.tenureDays.push(tenureItem);
          }

          self.tenureDaysLoaded(true);

          if (self.rootModelInstance.createTDData.tenure.days() === "") {
            self.rootModelInstance.createTDData.tenure.days(self.tenureDays()[0].value);
          }

          self.rootModelInstance.createTDData.tenure.months("0");
          self.rootModelInstance.createTDData.tenure.years("0");
        }
      });

    };

    self.productChangeHandler = function () {
      self.depositAmountCheck(true);
      self.productSelected(false);
      self.tenureDaysLoaded(false);
      self.tenureDays.removeAll();

      if (self.rootModelInstance.createTDData.productDTO.productId) {
        self.depositAmountCheck(false);
        self.maturityDetailsLoaded(false);
        self.depositTenureCheck("TENURE");
        self.maturityInstructionLoaded(false);
        self.rootModelInstance.createTDData.maturityDate(null);
        self.rootModelInstance.createTDData.tenure.days("0");
        self.rootModelInstance.createTDData.tenure.months("0");
        self.rootModelInstance.createTDData.tenure.years("0");

        for (let i = 0; i < self.depositTypeList().length; i++) {
          if (self.depositTypeList()[i].productId === self.rootModelInstance.createTDData.productDTO.productId()) {
            self.rootModelInstance.createTDData.productDTO.name(self.depositTypeList()[i].name);
            self.module(self.depositTypeList()[i].module);
            self.rootModelInstance.createTDData.module(self.depositTypeList()[i].module);
            self.minTenure(self.depositTypeList()[i].tenureParameter.minTenure);
            self.maxTenure(self.depositTypeList()[i].tenureParameter.maxTenure);
            self.rootModelInstance.createTDData.tenure.days(self.depositTypeList()[i].tenureParameter.minTenure.days);
            self.rootModelInstance.createTDData.tenure.months(self.depositTypeList()[i].tenureParameter.minTenure.months);
            self.rootModelInstance.createTDData.tenure.years(self.depositTypeList()[i].tenureParameter.minTenure.years);

            const minYear = rootParams.baseModel.getDate().getFullYear() + self.minTenure().years,
              minMonth = rootParams.baseModel.getDate().getMonth() + self.minTenure().months,
              minDate = rootParams.baseModel.getDate().getDate() + self.minTenure().days;

            self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(minYear, minMonth, minDate)));

            const maxYear = rootParams.baseModel.getDate().getFullYear() + self.maxTenure().years,
              maxMonth = rootParams.baseModel.getDate().getMonth() + self.maxTenure().months,
              maxDate = rootParams.baseModel.getDate().getDate() + self.maxTenure().days;

            self.maxDate(oj.IntlConverterUtils.dateToLocalIso(new Date(maxYear, maxMonth, maxDate)));
            self.minAmount(self.depositTypeList()[i].amountParameters[0].minAmount.amount);
            self.maxAmount(self.depositTypeList()[i].amountParameters[0].maxAmount.amount);
            self.changedCurrency(self.depositTypeList()[i].amountParameters[0].maxAmount.currency);

            self.maturityInstructionList.removeAll();
            ko.utils.arrayPushAll(self.maturityInstructionList, self.rootModelInstance.createTDData.module() === "ISL" ? islamicMaturityInstructions : maturityListData);
            self.rootModelInstance.createTDData.rollOverType("");
            ko.tasks.runEarly();
            self.maturityInstructionLoaded(true);
          }
        }

        self.rootModelInstance.createTDData.principalAmount.currency("");
        self.rootModelInstance.createTDData.principalAmount.amount(null);
        self.loadTenureDays(self.rootModelInstance.createTDData.productDTO.productId());
      }

      self.productSelected(true);
      self.depositAmountCheck(true);
      self.isProductSelected(true);
    };

    self.viewDepositRates = function () {
      $("#depositRates").trigger("openModal");
    };

    OpenTdModel.fetchMaturityInstruction().then(function (data) {
      for (let index = 0; index < data.enumRepresentations[0].data.length; index++) {
        if (data.enumRepresentations[0].data[index].code === "P") {
          data.enumRepresentations[0].data.splice(index, 1);
        }

      }

      maturityListData = data.enumRepresentations[0].data;
      self.maturityInstructionListLoaded(true);
    });

    self.setProductList = function (data) {
      self.depositTypeList(data.tdProductDTOList);
      self.depositTypeLoaded(false);

      if (data.tdProductDTOList.length > 0) {

        if (!self.rootModelInstance.createTDData.productDTO.productId()) {
          const i = 0;

          self.rootModelInstance.createTDData.productDTO.name(self.depositTypeList()[i].name);
          self.minTenure(self.depositTypeList()[i].tenureParameter.minTenure);
          self.maxTenure(self.depositTypeList()[i].tenureParameter.maxTenure);
          self.rootModelInstance.createTDData.module(data.tdProductDTOList[i].module);

          const minYear = rootParams.baseModel.getDate().getFullYear() + self.minTenure().years,
            minMonth = rootParams.baseModel.getDate().getMonth() + self.minTenure().months,
            minDate = rootParams.baseModel.getDate().getDate() + self.minTenure().days;

          self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(minYear, minMonth, minDate)));

          const maxYear = rootParams.baseModel.getDate().getFullYear() + self.maxTenure().years,
            maxMonth = rootParams.baseModel.getDate().getMonth() + self.maxTenure().months,
            maxDate = rootParams.baseModel.getDate().getDate() + self.maxTenure().days;

          self.maxDate(oj.IntlConverterUtils.dateToLocalIso(new Date(maxYear, maxMonth, maxDate)));
          self.maturityInstructionList.removeAll();
          ko.utils.arrayPushAll(self.maturityInstructionList, self.rootModelInstance.createTDData.module() === "ISL" ? islamicMaturityInstructions : maturityListData);
          self.maturityInstructionLoaded(true);
        } else {
          const minYear = rootParams.baseModel.getDate().getFullYear() + self.minTenure().years,
            minMonth = rootParams.baseModel.getDate().getMonth() + self.minTenure().months,
            minDate = rootParams.baseModel.getDate().getDate() + self.minTenure().days;

          self.minDate(oj.IntlConverterUtils.dateToLocalIso(new Date(minYear, minMonth, minDate)));

          const maxYear = rootParams.baseModel.getDate().getFullYear() + self.maxTenure().years,
            maxMonth = rootParams.baseModel.getDate().getMonth() + self.maxTenure().months,
            maxDate = rootParams.baseModel.getDate().getDate() + self.maxTenure().days;

          self.maxDate(oj.IntlConverterUtils.dateToLocalIso(new Date(maxYear, maxMonth, maxDate)));
          self.loadTenureDays(self.rootModelInstance.createTDData.productDTO.productId());

        }
      }

      if (self.productType() === "RFC") {
        ko.tasks.runEarly();
      }

      self.depositTypeLoaded(true);
    };

    self.tenureChangeHandler = function (event) {
      if (caseModify !== "INIT" && event.detail.value && event.detail.previousValue) {
        if (self.depositTenureCheck() === "TENURE") {
          self.rootModelInstance.createTDData.maturityDate(null);
          self.rootModelInstance.createTDData.tenure.days(self.minTenure() ? self.minTenure().days : "0");
          self.rootModelInstance.createTDData.tenure.months(self.minTenure() ? self.minTenure().months : "0");
          self.rootModelInstance.createTDData.tenure.years(self.minTenure() ? self.minTenure().years : "0");
        } else {
          self.rootModelInstance.createTDData.tenure.days(null);
          self.rootModelInstance.createTDData.tenure.months(null);
          self.rootModelInstance.createTDData.tenure.years(null);
        }
      }
    };

    self.cancelDetails = function () {
      self.rootModelInstance.createTDData.payoutInstructions = self.rawPayoutInstructions;

      if (self.depositTenureCheck() === "DATE") {
        self.rootModelInstance.createTDData.tenure.days(null);
        self.rootModelInstance.createTDData.tenure.months(null);
        self.rootModelInstance.createTDData.tenure.years(null);
      } else if (self.depositTenureCheck() === "TENURE") {
        self.rootModelInstance.createTDData.maturityDate(null);
      }

      caseModify = "INIT";
      rootParams.dashboard.hideDetails();
    };

    self.calculateMaturityAmount = function (isReview) {
      if (!self.validateAmount()) {
        return;
      }

      const ignoreList = [];

      ignoreList.push("payoutInstructions");

      if (self.rootModelInstance.createTDData.maturityAmount) {
        if (self.rootModelInstance.createTDData.maturityAmount.amount && self.rootModelInstance.createTDData.maturityAmount.currency) {
          if (!self.rootModelInstance.createTDData.maturityAmount.amount() && !self.rootModelInstance.createTDData.maturityAmount.currency()) {
            ignoreList.push("maturityAmount");
          }
        }
      }

      if (self.rootModelInstance.createTDData.rollOverAmount) {
        if (self.rootModelInstance.createTDData.rollOverAmount.amount && self.rootModelInstance.createTDData.rollOverAmount.currency) {
          if (!self.rootModelInstance.createTDData.rollOverAmount.amount() && !self.rootModelInstance.createTDData.rollOverAmount.currency()) {
            ignoreList.push("rollOverAmount");
          }
        }
      }

      OpenTdModel.calculateMaturityAmount(ko.mapping.toJSON(self.rootModelInstance.createTDData, {
        ignore: ignoreList
      })).then(function (data) {
        self.maturityDetails(data);
        self.maturityDetailsLoaded(true);

        if (isReview === true) {
          rootParams.dashboard.loadComponent("review-td-open", {
            mode: "review",
            data: ko.mapping.toJS(self.rootModelInstance.createTDData)
          });
        }

        self.rootModelInstance.createTDData.interestRate(self.maturityDetails().termDepositDetails.interestRate);
        self.rootModelInstance.createTDData.maturityAmount.amount(self.maturityDetails().termDepositDetails.maturityAmount.amount);
        self.rootModelInstance.createTDData.maturityAmount.currency(self.maturityDetails().termDepositDetails.maturityAmount.currency);
      });
    };

    self.validateAmount = function () {
      let error = true;

      if (!self.rootModelInstance.createTDData.principalAmount.amount()) {
        rootParams.baseModel.showMessages(null, [locale.openTermDeposit.validate.emptyAmount], "ERROR");
        error = false;

        return error;
      }

      if (self.depositTenureCheck() === "TENURE" && !(self.rootModelInstance.createTDData.tenure.years() || self.rootModelInstance.createTDData.tenure.months() || self.rootModelInstance.createTDData.tenure.days())) {
        rootParams.baseModel.showMessages(null, [locale.openTermDeposit.validate.emptyTenure], "ERROR");
        error = false;
      } else if (self.depositTenureCheck() === "DATE" && !self.rootModelInstance.createTDData.maturityDate()) {
        rootParams.baseModel.showMessages(null, [locale.openTermDeposit.validate.emptyDate], "ERROR");
        error = false;
      }

      return error;
    };

    self.reset = function () {
      self.rootModelInstance.createTDData.principalAmount.amount("");

      if (self.depositTenureCheck() === "TENURE") {
        self.rootModelInstance.createTDData.tenure.days("");
        self.rootModelInstance.createTDData.tenure.months("");
        self.rootModelInstance.createTDData.tenure.years("");
      } else {
        self.rootModelInstance.createTDData.maturityDate(null);
      }

      self.maturityDetailsLoaded(false);
    };

    self.resetNomineeModel = function (addNomineeModel, isMinor) {
      addNomineeModel.dateOfBirth(null);
      addNomineeModel.relation("");
      addNomineeModel.minor(false);
      isMinor(false);
      addNomineeModel.name(null);
      addNomineeModel.address.country("");
      addNomineeModel.address.state(null);
      addNomineeModel.address.city(null);
      addNomineeModel.address.zipCode(null);
      addNomineeModel.address.line1(null);
      addNomineeModel.address.line2(null);
      addNomineeModel.guardian = null;
    };

    self.createTDConfirm = function (simulation) {
      const rdValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("tdTracker"));
      let nomineeValidationFailed = self.isNomineeRequired();

      if (self.isNomineeRequired()) {
        nomineeValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("nomineeTracker"));
      }

      if (rdValidationFailed || nomineeValidationFailed) {
        return;
      }

      const isSimulated = simulation;

      if (isSimulated) {
        self.rootModelInstance.createTDData.payInInstruction()[0].accountId.displayValue(self.additionalDetails().account.id.displayValue);
        self.rootModelInstance.createTDData.parties = [];

        for (let i = 0; i < self.jointParties().length && self.jointParties()[i] !== ""; i++) {
          if (self.additionalDetails().account.holdingPattern === "JOINT") {
            self.rootModelInstance.createTDData.parties.push({
              partyId: self.jointParties()[i].partyId.value,
              partyName: self.jointParties()[i].partyName,
              relationship: self.jointParties()[i].relationship
            });
          }
        }
      }

      if (self.rootModelInstance.createTDData.payoutInstructions()[0].type !== "INT") {
        delete self.rootModelInstance.createTDData.payoutInstructions()[0].internationalTransaction;
      }

      self.rawPayoutInstructions = self.rootModelInstance.createTDData.payoutInstructions;

      const ignoreProp = [];

      switch (self.rootModelInstance.createTDData.rollOverType()) {
        case "A":
          self.rootModelInstance.createTDData.payoutInstructions()[0].payoutComponentType("P");
          break;
        case "P":
          self.rootModelInstance.createTDData.payoutInstructions()[0].payoutComponentType("I");
          break;
        case "S":
          self.rootModelInstance.createTDData.payoutInstructions()[0].payoutComponentType("P");
          self.rootModelInstance.createTDData.rollOverAmount.currency(ko.utils.unwrapObservable(self.rootModelInstance.createTDData.principalAmount.currency()));
          break;
        case "I":
          ignoreProp.push("payoutInstructions");
          break;
        default:
          break;
      }

      if (self.rootModelInstance.createTDData.holdingPattern() !== "JOINT") {
        if (!self.selectedParty()) {
          self.rootModelInstance.createTDData.partyId = null;

          ko.utils.arrayForEach(self.partyEnums(), function (item) {
            if (item.partyId === "not found") {
              self.rootModelInstance.createTDData.partyName = item.partyName;
            }
          });
        } else if (self.selectedParty() === "not found") {
          self.rootModelInstance.createTDData.partyId = null;

          ko.utils.arrayForEach(self.partyEnums(), function (item) {
            if (item.partyId === "not found") {
              self.rootModelInstance.createTDData.partyName = item.partyName;
            }
          });
        } else {
          self.rootModelInstance.createTDData.partyId = self.selectedParty();

          ko.utils.arrayForEach(self.partyEnums(), function (item) {
            if (item.partyId === self.selectedParty()) {
              self.rootModelInstance.createTDData.partyName = item.partyName;
            }
          });
        }
      }

      if (self.rootModelInstance.createTDData.holdingPattern() === "JOINT" && self.hostSupportsNominee()) {
        self.resetNomineeModel(self.addNomineeModel, self.isMinor);
        self.rootModelInstance.createTDData.nomineeDTO = null;
        self.isNomineeRequired(false);
      }

      self.rootModelInstance.createTDData.parties = [];

      if (self.rootModelInstance.createTDData.maturityAmount) {
        if (self.rootModelInstance.createTDData.maturityAmount.amount && self.rootModelInstance.createTDData.maturityAmount.currency) {
          if (!self.rootModelInstance.createTDData.maturityAmount.amount() && !self.rootModelInstance.createTDData.maturityAmount.currency()) {
            ignoreProp.push("maturityAmount");
          }
        }
      }

      if (self.rootModelInstance.createTDData.rollOverAmount) {
        if (self.rootModelInstance.createTDData.rollOverAmount.amount && self.rootModelInstance.createTDData.rollOverAmount.currency) {
          if (!self.rootModelInstance.createTDData.rollOverAmount.amount() && !self.rootModelInstance.createTDData.rollOverAmount.currency()) {
            ignoreProp.push("rollOverAmount");
          }
        }
      }

      OpenTdModel.openTd(ko.mapping.toJSON(self.rootModelInstance.createTDData, {
        ignore: ignoreProp
      }), isSimulated).then(function (data) {
        if (isSimulated) {
          if (self.rootModelInstance.createTDData.maturityDate()) {
            calculateTenure(self.rootModelInstance.createTDData.maturityDate());
          }

          self.rootModelInstance.createTDData.interestRate(data.termDepositDetails.interestRate);

          if (self.rootModelInstance.createTDData.module() !== "ISL") {
            if (!self.rootModelInstance.createTDData.tenure) {
              self.rootModelInstance.createTDData.maturityDate(data.termDepositDetails.maturityDate);
            }

            self.maturityDate(data.termDepositDetails.maturityDate);
            self.rootModelInstance.createTDData.maturityAmount.amount(data.termDepositDetails.maturityAmount.amount);
            self.rootModelInstance.createTDData.maturityAmount.currency(data.termDepositDetails.maturityAmount.currency);
          }

          self.parties([]);

          if (self.rootModelInstance.createTDData.holdingPattern() === "JOINT" && data.termDepositDetails.parties) {
            const jointParties = data.termDepositDetails.parties;

            for (let i = 0; i < jointParties.length; i++) {
              if (i === 0) {
                self.rootModelInstance.createTDData.partyName = jointParties[i].partyName;
              } else {
                self.parties.push({
                  partyName: jointParties[i].partyName,
                  partyId: jointParties[i].partyId,
                  relationship: jointParties[i].relationship
                });
              }
            }
          }

          self.loadedFromReview(true);

          rootParams.dashboard.loadComponent("review-td-open", {
            mode: "review",
            data: ko.mapping.toJS(self.rootModelInstance.createTDData),
            addNomineeModel: ko.mapping.toJS(self.addNomineeModel),
            minor: ko.mapping.toJS(self.isMinor),
            url: ko.mapping.toJS(self.url),
            manageNominee: ko.mapping.toJS(self.manageNominee),
            productType: ko.mapping.toJS(self.productType),
            productSelected: ko.mapping.toJS(self.productSelected),
            holdingPattern: ko.mapping.toJS(self.holdingPattern),
            loadedFromReview: ko.mapping.toJS(self.loadedFromReview),
            parties: ko.mapping.toJS(self.parties),
            isNomineeRequired: ko.mapping.toJS(self.isNomineeRequired),
            accountModule: ko.mapping.toJS(self.accountModule),
            hostSupportsNominee: ko.mapping.toJS(self.hostSupportsNominee),
            createTDConfirm: ko.mapping.toJS(self.createTDConfirm),
            minTenure: ko.mapping.toJS(self.minTenure),
            maxTenure: ko.mapping.toJS(self.maxTenure),
            depositTypeList: ko.mapping.toJS(self.depositTypeList),
            maturityInstructionList: ko.mapping.toJS(self.maturityInstructionList),
            depositTenureCheck: ko.mapping.toJS(self.depositTenureCheck)
          });
        } else {
          self.rootModelInstance.createTDData.maturityDate(self.maturityDate());

          let maturityInstruction, guardianName, depositNumber, nomineeName, transferTo;

          for (let j = 0; j < self.maturityInstructionList().length; j++) {
            if (self.maturityInstructionList()[j].code === self.rootModelInstance.createTDData.rollOverType()) {
              maturityInstruction = self.maturityInstructionList()[j].description;
            }
          }

          if (self.isNomineeRequired()) {

            if (self.addNomineeModel.guardian) {
              guardianName = self.addNomineeModel.guardian.name();
            }

            if (self.addNomineeModel.name) {
              nomineeName = self.addNomineeModel.name();
            }
          }

          if (data.termDepositDetails.id) {
            depositNumber = data.termDepositDetails.id.displayValue;
          }

          if (self.rootModelInstance.createTDData.rollOverType() !== "I") {
            if (self.rootModelInstance.createTDData.payoutInstructions()[0].type() !== "I") {
              transferTo = [self.rootModelInstance.createTDData.payoutInstructions()[0].accountId.displayValue, self.rootModelInstance.createTDData.payoutInstructions()[0].account(), self.rootModelInstance.createTDData.payoutInstructions()[0].beneficiaryName, self.rootModelInstance.createTDData.payoutInstructions()[0].bankName, self.rootModelInstance.createTDData.payoutInstructions()[0].address.line1, self.rootModelInstance.createTDData.payoutInstructions()[0].address.line2, self.rootModelInstance.createTDData.payoutInstructions()[0].address.city, self.rootModelInstance.createTDData.payoutInstructions()[0].address.country];
            } else {
              transferTo = self.rootModelInstance.createTDData.payoutInstructions()[0].account();
            }
          }

          const confirmScreenDetailsArray = [
            [{
                label: self.locale.openTermDeposit.depositDetails.depositNumber,
                value: depositNumber
              },
              {
                label: self.locale.openTermDeposit.depositDetails.depositTenure,
                value: self.formatDepositTenure(self.rootModelInstance.createTDData.tenure)
              },
              {
                label: self.locale.openTermDeposit.depositDetails.depositAmount,
                value: self.rootModelInstance.createTDData.principalAmount,
                isAmount: true
              },
              {
                label: self.locale.openTermDeposit.depositDetails.maturityDate,
                value: self.rootModelInstance.createTDData.maturityDate,
                isDate: true
              },
              {
                label: self.locale.openTermDeposit.holdingPattern.holdingPattern,
                value: self.locale.openTermDeposit.holdingPatternType[self.rootModelInstance.createTDData.holdingPattern()]
              }
            ],
            [{
                label: self.locale.openTermDeposit.nominationDetails.nomineeName,
                value: nomineeName
              },
              {
                label: self.locale.openTermDeposit.nominationDetails.guardianName,
                value: guardianName
              },
              {
                label: self.locale.openTermDeposit.payoutInstructions.maturityInstruction,
                value: maturityInstruction
              },
              {
                label: self.locale.openTermDeposit.depositDetails.maturityAmount,
                value: self.rootModelInstance.createTDData.maturityAmount,
                isAmount: true
              },
              {
                label: self.locale.openTermDeposit.payoutInstructions.payTo,
                value: self.locale.openTermDeposit.payoutInstructions.payoutTypes[self.rootModelInstance.createTDData.payoutInstructions()[0].type()]
              },
              {
                label: self.locale.openTermDeposit.payoutInstructions.transferTo,
                value: transferTo,
                paymentType: self.rootModelInstance.createTDData.payoutInstructions()[0].type()
              },
              {
                label: self.resourceBundle.payoutInstructions.swiftCode,
                value: self.rootModelInstance.createTDData.payoutInstructions()[0].clearingCode()
              },
              {
                label: self.resourceBundle.payoutInstructions.correspondenceCharges,
                value: self.resourceBundle.payoutInstructions.remittanceChargesOption[self.rootModelInstance.createTDData.payoutInstructions()[0].correspondenceChargeType]
              }
            ]
          ];
          let heading;

          if (rootParams.dashboard.appData.segment !== "CORP") {
            heading = rootParams.baseModel.format(self.locale.openTermDeposit.tdHeading, {
              depositType: self.depositTypesList[self.productType()]
            });
          } else {
            heading = self.locale.openTermDeposit.newDeposit;
          }

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: heading,
            hostReferenceNumber: data.hostReference ? data.hostReference : null,
            confirmScreenExtensions: {
              isSet: true,
              taskCode: self.currentTask(),
              template: "confirm-screen/td-template",
              confirmScreenDetails: confirmScreenDetailsArray
            }
          });
        }
      });
    };

    self.displayMaturityPeriod = function (tenureParameter) {
      const maturityPeriod = self.formatTenure(tenureParameter.minTenure) + "-" + self.formatTenure(tenureParameter.maxTenure);

      return maturityPeriod;
    };

    self.formatTenure = function (tenure) {
      return rootParams.baseModel.format(self.locale.openTermDeposit.tenureFormat, {
        years: tenure.years,
        months: tenure.months,
        days: tenure.days
      });
    };

    self.formatDepositTenure = function (tenure) {
      return rootParams.baseModel.format(self.locale.openTermDeposit.tenureFormat, {
        years: tenure.years(),
        months: tenure.months(),
        days: tenure.days()
      });
    };

    self.currencyParser = function () {
      let data;

      if (self.depositTypeList()) {
        for (let j = 0; j < self.depositTypeList().length; j++) {
          if (self.depositTypeList()[j].productId === self.rootModelInstance.createTDData.productDTO.productId()) {
            data = self.depositTypeList()[j];
          }
        }
      }

      self.productCcyDetails = [];

      const output = {};

      output.currencies = [];

      if (self.rootModelInstance.createTDData.productDTO.productId()) {
        if (data) {
          if (data.amountParameters) {
            for (let i = 0; i < data.amountParameters.length; i++) {
              output.currencies.push({
                code: data.amountParameters[i].currency,
                description: data.amountParameters[i].currency
              });

              self.productCcyDetails.push({
                ccy: data.amountParameters[i].currency,
                minAmount: data.amountParameters[i].minAmount.amount,
                maxAmount: data.amountParameters[i].maxAmount.amount
              });
            }
          }
        }
      }

      return output;
    };

    const subscription = self.rootModelInstance.createTDData.principalAmount.currency.subscribe(function (newValue) {
        if (self.rootModelInstance.createTDData.principalAmount.currency() !== "" && self.sourceCurrency() !== "") {
          for (let j = 0; j < self.depositTypeList().length; j++) {
            if (self.depositTypeList()[j].productId === self.rootModelInstance.createTDData.productDTO.productId()) {
              for (let i = 0; i < self.productCcyDetails.length; i++) {
                if (self.productCcyDetails[i].ccy === newValue) {
                  self.minAmount(self.productCcyDetails[i].minAmount);
                  self.maxAmount(self.productCcyDetails[i].maxAmount);
                  self.changedCurrency(newValue);
                  self.rootModelInstance.createTDData.productDTO.name(self.depositTypeList()[j].name);
                  self.rootModelInstance.createTDData.module(self.depositTypeList()[j].module);
                  self.rootModelInstance.createTDData.tenure.days("");
                  self.rootModelInstance.createTDData.tenure.months("");
                  self.rootModelInstance.createTDData.tenure.years("");

                  self.amount(rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.amount, {
                    currency: newValue
                  }));

                  self.rootModelInstance.createTDData.principalAmount.amount(null);
                  self.exchangeAmount("");
                  self.currentExchangeRate("");
                  break;
                }
              }
            }
          }
        }
      }),
      exchangeSubscription = self.rootModelInstance.createTDData.principalAmount.amount.subscribe(function (newValue) {
        if (self.sourceCurrency() !== self.rootModelInstance.createTDData.principalAmount.currency()) {
          if (self.rootModelInstance.createTDData.principalAmount.currency() !== "" && self.sourceCurrency() !== "") {
            self.rootModelInstance.createTDData.principalAmount.amount(newValue);
            self.foreignToLocal();
          }
        } else {
          self.showRate(false);
        }
      });

    self.dispose = function () {
      subscription.dispose();
      exchangeSubscription.dispose();
      subscriptionAdditionalDetailsAccount.dispose();
    };

    self.foreignToLocal = function () {
      if (self.sourceCurrency()) {
        const payload = {
          sellCurrency: {
            currency: ko.utils.unwrapObservable(self.sourceCurrency()),
            amount: null
          },
          buyCurrency: {
            currency: self.rootModelInstance.createTDData.principalAmount.currency(),
            amount: self.foreignAmount()
          }
        };

        OpenTdModel.fetchExchangeRate(ko.toJSON(payload)).then(function (data) {
          if (data.sellingCurrency) {
            self.currentExchangeRate(data.sellingCurrency.amount);
            self.showRate(false);
            self.exchangeAmount(self.currentExchangeRate() * self.rootModelInstance.createTDData.principalAmount.amount());
            self.showRate(true);
          }
        });
      }
    };

    self.resetExchangeAmount = function () {
      self.rootModelInstance.createTDData.principalAmount.amount(null);
      self.currentExchangeRate("");
      self.exchangeAmount("");
      self.showRate(false);
    };

    self.resetData = function () {
      self.rootModelInstance.createTDData.principalAmount.currency("");
      self.resetExchangeAmount();
      self.holdingPattern.removeAll();
      self.rootModelInstance.createTDData.payInInstruction()[0].accountId.value("");
      self.rootModelInstance.createTDData.productDTO.productId("");
      self.productChangeHandler();
      self.rootModelInstance.createTDData.rollOverType("");
      ko.tasks.runEarly();
    };

    self.loadProfilePage = function () {
      rootParams.baseModel.registerComponent("side-menu", "security");
      rootParams.dashboard.loadComponent("side-menu", {});
    };
  };
});