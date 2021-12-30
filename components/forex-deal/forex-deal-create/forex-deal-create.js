define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/forex-deal-create",
  "ojs/ojcheckboxset",
  "ojs/ojdialog",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojdatetimepicker",
  "ojs/ojswitch",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojselectcombobox",
  "ojs/ojpopup"
], function (oj, ko, $, forexModel, ResourceBundle) {
  "use strict";

  /** New Forex Deal booking.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function (rootParams) {
    const self = this;
    let date;
    const getNewKoModel = function () {
      const KoModel = ko.mapping.fromJS(forexModel.getNewModel());

      return KoModel;
    };

    self.createForexDealModel = getNewKoModel().createForexDealModel;
    self.partyName = ko.observable();
    self.selectedDealType = ko.observable();
    ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);
    self.frequencyList = ko.observableArray(rootParams.rootModel.previousState ? rootParams.rootModel.previousState.frequencyList : []);
    self.dealTypeArray = ko.observableArray(rootParams.rootModel.previousState ? rootParams.rootModel.previousState.dealTypeArray : []);
    self.rateTypeArray = ko.observableArray(rootParams.rootModel.previousState ? rootParams.rootModel.previousState.rateTypeArray : []);
    self.currComboArray = ko.observableArray(rootParams.rootModel.previousState ? rootParams.rootModel.previousState.currComboArray : []);
    self.rateCurrencyArray = ko.observableArray(rootParams.rootModel.previousState ? rootParams.rootModel.previousState.rateCurrencyArray : []);
    self.promiseResponse = ko.observable(rootParams.rootModel.previousState ? rootParams.rootModel.previousState.promiseResponse : null);
    self.nls = ResourceBundle;
    self.dealCreationAllowed = ko.observable(false);
    self.currencyForeign = ko.observable(rootParams.rootModel.previousState ? self.createForexDealModel.forexDealDTO.buyAmount.currency() + "-" + self.createForexDealModel.forexDealDTO.sellAmount.currency() : "");
    self.forwardFrequency = ko.observable();
    self.forwardSwapFrequency = ko.observable();
    self.rateCurrency = ko.observable();
    self.selectedRateType = ko.observable();
    self.rateAmount = ko.observable(self.params && self.params.amount ? self.params.amount : null);
    self.groupValid = ko.observable();
    self.validationTracker = ko.observable();
    self.minBookingDate = ko.observable();
    self.validity = ko.observable();
    self.minValueDate = ko.observable();
    self.maxValueDate = ko.observable();
    self.customSwap = ko.observable();
    self.forexDealLimitTaskType = ko.observable();
    self.viewLimitsFlag = ko.observable();
    rootParams.dashboard.headerName(self.nls.forexDeal.header);
    rootParams.baseModel.registerComponent("review-forex-deal-create", "forex-deal");
    rootParams.baseModel.registerComponent("view-forex-deal-limits", "forex-deal");
    rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
    rootParams.baseModel.registerComponent("available-limits", "financial-limits");

    rootParams.baseModel.registerElement([
      "modal-window",
      "amount-input"
    ]);

    let dealTypeArray = 0,
      rateTypeArray = 0,
      homeBranchCode = 0,
      selectedCurrencies = 0,
      exchangeRateData = 0;

    self.buyRate = ko.observable();
    self.sellRate = ko.observable();
    self.loadAccessPointList = ko.observable(false);
    self.selectedChannelTypeName = ko.observable();
    self.selectedChannelType = ko.observable();
    self.selectedChannel = ko.observable(false);
    self.swapType = ko.observable();
    self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType("S");

    self.swapTypeArray = [{
      value: "SPOT-FORWARD",
      text: self.nls.forexDeal.spotForward
    }, {
      value: "FORWARD-FORWARD",
      text: self.nls.forexDeal.forwardForward
    }];

    self.swapTypeChangeHandler = function () {
      if (self.swapType() === self.swapTypeArray[0].value) {
        self.createForexDealModel.forexDealDTO.type(self.dealTypeArray()[0].id);
      } else if (self.swapType() === self.swapTypeArray[1].value) {
        self.createForexDealModel.forexDealDTO.type(self.dealTypeArray()[1].id);
      }
    };

    self.channelTypeChangeHandler = function (event) {
      self.selectedChannelType(event.detail.value);
      self.selectedChannel(false);
      ko.tasks.runEarly();
      self.selectedChannel(true);
    };

    self.channelList = ko.observableArray();

    let currentLoggedInIndex = 0;

    forexModel.listAccessPoint().then(function (data) {
      self.channelList(data.accessPointListDTO);

      for (let i = 0; i < data.accessPointListDTO.length; i++) {
        if (data.accessPointListDTO[i].currentLoggedIn === true) {
          currentLoggedInIndex = i;
        }
      }

      self.selectedChannel(true);
      self.loadAccessPointList(true);
    });

    self.channelPopup = function () {
      const popup1 = document.querySelector("#channel-popup");

      if (popup1.isOpen()) {
        popup1.close();
      } else {
        popup1.open("#channel-disclaimer");
      }
    };

    /**
     * This function will help initializing the dealType and its associated fields.
     *
     * @memberOf forex-deal-create
     * @param {Object} dealTypeArray  - Deal type array.
     * @param {Object} rateTypeArray  - Rate type array.
     * @function dealRateTypeInitialization
     * @returns {void}
     */
    const dealRateTypeInitialization = function (dealTypeArray, rateTypeArray) {
      self.dealTypeArray(dealTypeArray);
      self.rateTypeArray(rateTypeArray);
      self.selectedDealType(dealTypeArray[0].id);
      self.createForexDealModel.forexDealDTO.type(dealTypeArray[0].id);
      self.createForexDealModel.forexDealDTO.rateType(rateTypeArray[0].id);
    };

    self.amountConverter = ko.observable({
      type: "number",
      options: {
        style: "currency",
        currency: null,
        currencyDisplay: "symbol"
      }
    });

    self.exchangeAmountConverter = ko.observable({
      type: "number",
      options: {
        style: "currency",
        currency: self.createForexDealModel.forexDealDTO.rate.currency,
        currencyDisplay: "symbol",
        maximumFractionDigits: 4,
        roundingMode: "HALF_EVEN"
      }
    });

    /**
     * This function will help to load the exchangeRate.
     *
     * @memberOf forex-deal-create
     * @function exchangeRate
     * @returns {void}
     */
    const exchangeRate = function () {
      const exchangeCodes = {
        branchCode: homeBranchCode,
        ccy1Code: selectedCurrencies[0],
        ccy2Code: selectedCurrencies[1]
      };

      self.createForexDealModel.forexDealDTO.rate.currency(selectedCurrencies[1]);

      forexModel.getExchangeRate(exchangeCodes).then(function (response) {
        exchangeRateData = {
          buyRate: response.exchangeRateDetails[0].buyRate,
          sellRate: response.exchangeRateDetails[0].sellRate,
          midRate: response.exchangeRateDetails[0].midRate
        };

        self.createForexDealModel.forexDealDTO.rate.amount(exchangeRateData.midRate);
        self.buyRate(response.exchangeRateDetails[0].buyRate);
        self.sellRate(response.exchangeRateDetails[0].sellRate);
        ko.tasks.runEarly();
      });
    };

    if (rootParams.rootModel.previousState) {
      if (self.createForexDealModel.forexDealDTO.type() === "F") {
        const frequency = ko.utils.arrayFirst(self.frequencyList(), function (freq) {
          return freq.value === self.createForexDealModel.forexDealDTO.forwardPeriod();
        });

        self.forwardFrequency(frequency !== null ? self.createForexDealModel.forexDealDTO.forwardPeriod() : "0");
      }

      self.rateCurrency(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency());
      self.currencyForeign(self.createForexDealModel.forexDealDTO.buyAmount.currency() + "-" + self.createForexDealModel.forexDealDTO.sellAmount.currency());
      self.rateAmount(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.amount() : self.createForexDealModel.forexDealDTO.sellAmount.amount());
      homeBranchCode = self.homeBranchCodeParams;
      date = ko.utils.unwrapObservable(self.dateParams);
      self.dealCreationAllowed(true);
      ko.tasks.runEarly();
    }

    /**
     * This function will handle the updation of currency pairs.
     *
     * @memberOf forex-deal-create
     * @function changeCurrencyPair
     * @returns {void}
     */
    self.changeCurrencyPair = function () {
      if (self.currencyForeign()) {
        if (!self.reviewMode) {
          selectedCurrencies = self.currencyForeign().split("-");
          self.rateCurrencyArray([]);
          ko.tasks.runEarly();

          self.rateCurrencyArray.push({
            description: selectedCurrencies[0],
            code: selectedCurrencies[0]
          }, {
            description: selectedCurrencies[1],
            code: selectedCurrencies[1]
          });

          self.createForexDealModel.forexDealDTO.sellAmount.currency(selectedCurrencies[1]);
          self.createForexDealModel.forexDealDTO.buyAmount.currency(selectedCurrencies[0]);
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.currency(selectedCurrencies[0]);
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.currency(selectedCurrencies[1]);
          self.rateCurrency(selectedCurrencies[0]);
        } else {
          selectedCurrencies = self.selectedCurrencies;
          self.currencyForeign(selectedCurrencies[0] + "-" + selectedCurrencies[1]);
          self.reviewMode = false;
        }

        if (self.createForexDealModel.forexDealDTO.type() === "S") {
          const spotValueDate = new Date(date);

          spotValueDate.setDate(spotValueDate.getDate() + 2);
          self.createForexDealModel.forexDealDTO.expiryDate(oj.IntlConverterUtils.dateToLocalIso(spotValueDate));
        }

        if (self.createForexDealModel.forexDealDTO.rateType() === "B") {
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType("S");
          self.selectedRateType(self.nls.forexDeal.buy);
        } else {
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType("B");
          self.selectedRateType(self.nls.forexDeal.sell);
        }

        self.amountConverter({
          type: "number",
          options: {
            style: "currency",
            currency: self.rateCurrency(),
            currencyDisplay: "symbol"
          }
        });

        self.exchangeAmountConverter({
          type: "number",
          options: {
            style: "currency",
            currency: selectedCurrencies[1],
            currencyDisplay: "symbol",
            maximumFractionDigits: 4,
            roundingMode: "HALF_EVEN"
          }
        });

        exchangeRate();
      }
    };

    if (rootParams.rootModel.previousState) {
      self.changeCurrencyPair();
    }

    const getHostDatePromise = !rootParams.rootModel.previousState ? forexModel.getHostDate() : Promise.resolve(self.promiseResponse()[0]),
      fetchBankConfigPromise = !rootParams.rootModel.previousState ? forexModel.fetchBankConfig() : Promise.resolve(self.promiseResponse()[3]),
      fetchForexDealCreationFlagPromise = !rootParams.rootModel.previousState ? forexModel.fetchForexDealCreationFlag() : Promise.resolve(self.promiseResponse()[4]),
      fetchPartyDetailsPromise = !rootParams.rootModel.previousState ? forexModel.fetchPartyDetails() : Promise.resolve(self.promiseResponse()[6]);

    /** All rest will be called once the component is loaded and html will be loaded only after
     * receiving the rest response.
     * Rest response can be either successful or rejected
     *
     * @instance {object} forexModel
     * param1 {forexModel.object} getHostDate
     * param2 {forexModel.object} getCurrencyPairs
     * param3 {forexModel.object} fetchDealTypeList
     * param4 {forexModel.object} fetchBankConfig
     * param5 {forexModel.object} fetchForexDealCreationFlag
     */
    Promise.all([getHostDatePromise, forexModel.getCurrencyPairs(), forexModel.fetchDealTypeList(), fetchBankConfigPromise, fetchForexDealCreationFlagPromise, forexModel.fetchRateTypeList(), fetchPartyDetailsPromise]).then(function (response) {
      self.promiseResponse(response);

      const dateResponse = response[0],
        data = response[1],
        dealTypeList = response[2],
        forexDealCreationAllowed = response[4].partyPreferencesDTOs.dealCreationAllowed;

      homeBranchCode = response[3].bankConfigurationDTO.homeBranch;

      const rateTypeList = response[5];

      if (forexDealCreationAllowed === true) { self.dealCreationAllowed(true); }
      else {
        rootParams.baseModel.showMessages(null, [self.nls.info.dealCreationNotAllowedInfoMessage], "SUCCESS", function () {
          history.back();
        });
      }

      if (dateResponse && dateResponse.currentDate !== null) {
        date = new Date(dateResponse.currentDate.valueDate);
        self.createForexDealModel.forexDealDTO.bookingDate(dateResponse.currentDate.valueDate);
      }

      const ccyArray = [];

      for (let i = 0; i < data.forexDealMaintenanceDetails.length; i++) {
        ccyArray[i] = data.forexDealMaintenanceDetails[i].currency1 + "-" + data.forexDealMaintenanceDetails[i].currency2;

        self.currComboArray.push({
          value: ccyArray[i],
          text: ccyArray[i]
        });

      }

      if (self.params.currency) {
        for (let i = 0; i < self.currComboArray().length; i++) {
          const splitCurrency = self.currComboArray()[i].value.split("-");

          if (splitCurrency[0] === self.params.currency() || splitCurrency[1] === self.params.currency()) {
            self.currencyForeign(self.currComboArray()[i].value);
            break;
          }
        }
      }

      rateTypeArray = [{
        id: rateTypeList.enumRepresentations[0].data[0].code,
        label: rateTypeList.enumRepresentations[0].data[0].description
      }, {
        id: rateTypeList.enumRepresentations[0].data[1].code,
        label: rateTypeList.enumRepresentations[0].data[1].description
      }];

      dealTypeArray = [{
        id: dealTypeList.enumRepresentations[0].data[0].code,
        label: dealTypeList.enumRepresentations[0].data[0].description
      }, {
        id: dealTypeList.enumRepresentations[0].data[1].code,
        label: dealTypeList.enumRepresentations[0].data[1].description
      }, {
        id: "SWAP",
        label: self.nls.forexDeal.swap
      }];

      if (!rootParams.rootModel.previousState) { dealRateTypeInitialization(dealTypeArray, rateTypeArray); }

      for (let n = 0; n < self.currComboArray().length; n++) {
        if (self.params && ko.utils.unwrapObservable(self.params.transferCurrency)) {
          if (self.params.transferCurrency + "-" + self.params.currency2 === self.currComboArray()[n].value) {
            self.currencyForeign(self.params.transferCurrency + "-" + self.params.currency2);
            self.createForexDealModel.forexDealDTO.rateType(self.rateTypeArray()[0].id);
            self.createForexDealModel.forexDealDTO.buyAmount.currency(self.params.transferCurrency);
            self.createForexDealModel.forexDealDTO.sellAmount.currency(self.params.currency2);
          } else if ((self.params.currency2 + "-" + self.params.transferCurrency) === self.currComboArray()[n].value) {
            self.currencyForeign(self.params.currency2 + "-" + self.params.transferCurrency);
            self.createForexDealModel.forexDealDTO.rateType(self.rateTypeArray()[1].id);
            self.createForexDealModel.forexDealDTO.buyAmount.currency(self.params.currency2);
            self.createForexDealModel.forexDealDTO.sellAmount.currency(self.params.transferCurrency);
          }

          self.rateCurrency(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency());
        }
      }

      if (!self.partyName()) {
        self.partyName(response[6].party.personalDetails.fullName);
      }

      self.changeCurrencyPair();
      ko.tasks.runEarly();
    });

    /**
     * This function will help to load the frequencyList.
     *
     * @memberOf forex-deal-create
     * @function frequencylistSelected
     * @returns {void}
     */
    const frequencylistSelected = function () {
      if (self.frequencyList().length === 0) {
        forexModel.fetchFrequencyList().then(function (frequencyListResponse) {
          if (frequencyListResponse && frequencyListResponse.enumRepresentations[0].data !== null && frequencyListResponse.enumRepresentations[0].data.length > 0) {
            for (let m = 0; m < frequencyListResponse.enumRepresentations[0].data.length; m++) {
              self.frequencyList.push({
                text: frequencyListResponse.enumRepresentations[0].data[m].description,
                value: frequencyListResponse.enumRepresentations[0].data[m].code
              });
            }
          }
        });
      }

      ko.tasks.runEarly();
    };

    /**
     * This function will handle the updation of dealType.
     *
     * @memberOf forex-deal-create
     * @function dealTypeArrayChanged
     * @param {Object} event  - An object containing the current event of field.
     * @returns {void}
     */
    self.dealTypeArrayChanged = function (event) {
      if (event.detail.value !== event.detail.previousValue) {
        if (self.selectedDealType() === self.dealTypeArray()[0].id) {
          self.createForexDealModel.forexDealDTO.swap(false);
          self.createForexDealModel.forexDealDTO.type(self.dealTypeArray()[0].id);
        } else if (self.selectedDealType() === self.dealTypeArray()[1].id) {
          self.createForexDealModel.forexDealDTO.type(self.dealTypeArray()[1].id);
          self.createForexDealModel.forexDealDTO.swap(false);
          frequencylistSelected();
        } else if (self.selectedDealType() === self.dealTypeArray()[2].id) {
          self.createForexDealModel.forexDealDTO.swap(true);
          frequencylistSelected();
        }
      }
    };

    /**
     * This function will handle the operation of currency parser.
     *
     * @memberOf forex-deal-create
     * @function currencyParser
     * @returns  {Array} Currencies contains the array of currency array.
     */
    self.currencyParser = function () {
      return {
        currencies: self.rateCurrencyArray()
      };
    };

    const rateCurrency = self.rateCurrency.subscribe(function (newValue) {
      self.amountConverter().options.currency = newValue;
      self.exchangeAmountConverter().options.currency = selectedCurrencies[1];
      ko.tasks.runEarly();
    });

    /**
     * This function will handle the updation of dealType.
     *
     * @memberOf forex-deal-create
     * @function rateCurrencyHandler
     * @param {Object} event  - An object containing the current event of field.
     * @returns {void}
     */
    self.rateCurrencyHandler = function (event) {
      self.amountConverter().options.currency = event.detail.value;
      self.exchangeAmountConverter().options.currency = selectedCurrencies[1];
      ko.tasks.runEarly();
    };

    /**
     * This function will handle the updation of dealType.
     *
     * @memberOf forex-deal-create
     * @function rateTypeChangeHandler
     * @param {Object} event  - An object containing the current event of field.
     * @returns {void}
     */
    self.rateTypeChangeHandler = function (event) {
      if (event.detail.value !== event.detail.previousValue) {
        if (event.detail.value === "S") {
          self.selectedRateType(self.nls.forexDeal.sell);
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType("B");
        } else {
          self.selectedRateType(self.nls.forexDeal.buy);
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType("S");
        }

        self.rateCurrency(selectedCurrencies[0]);
      }

      self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType(event.detail.value === "S" ? "B" : "S");
      self.createForexDealModel.forexDealDTO.rate.amount(exchangeRateData.midRate);
    };

    /**
     * This function will handle the updation of forward frequency
     *
     * @memberOf forex-deal-create
     * @function forwardFreqHandler
     * @param {object} event  An object containing the current event of field
     * @returns {void}
     */
    let totalDays, customDate;

    self.forwardFreqHandler = function (event) {
      if (event.detail.value === "0") { customDate = event.detail.value; }

      const selectedDate = new Date(date);

      if (event.detail.value !== "0") {
        totalDays = event.detail.value;
        self.createForexDealModel.forexDealDTO.bookingDate(oj.IntlConverterUtils.dateToLocalIso(date));
        self.createForexDealModel.forexDealDTO.forwardPeriod(totalDays);
        selectedDate.setDate(selectedDate.getDate() + parseInt(self.createForexDealModel.forexDealDTO.forwardPeriod()));
        self.createForexDealModel.forexDealDTO.expiryDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
      } else {
        self.minValueDate(null);
        self.customSwap(false);
        self.minBookingDate(oj.IntlConverterUtils.dateToLocalIso(date));
        selectedDate.setDate(selectedDate.getDate() + 2);
        self.minValueDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
        self.createForexDealModel.forexDealDTO.expiryDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
        selectedDate.setDate(selectedDate.getDate() - 2);
        $("#custom-frequency").trigger("openModal");
      }

      if (self.selectedDealType() === "SWAP") {
        self.selectedDealType(false);
        ko.tasks.runEarly();
        self.selectedDealType("SWAP");
        self.forwardSwapFrequency(self.createForexDealModel.forexDealDTO.forwardPeriod());
        self.forwardSwapFreqHandler();
      }
    };

    /**
     * This function will handle the updation of forward frequency.
     *
     * @memberOf forex-deal-create
     * @function forwardSwapFreqHandler
     * @param {Object} totalDays  - - - - - - - - - - - - - - - An object containing the current event of field.
     * @param {Object} selectedDate  An object containing the current event of field.
     * @returns {void}
     */
    function renderSwapDate(totalDays, selectedDate) {
      self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.bookingDate(oj.IntlConverterUtils.dateToLocalIso(date));
      self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.forwardPeriod(totalDays);
      selectedDate.setDate(selectedDate.getDate() + parseInt(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.forwardPeriod()));
      self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
    }

    /**
     * This function will handle the updation of forward frequency
     *
     * @memberOf forex-deal-create
     * @function forwardSwapFreqHandler
     * @param {object} event  An object containing the current event of field
     * @returns {void}
     */
    self.minSwapValueDate = ko.observable();
    self.customSwapFrequency = ko.observable(false);
    self.customFrequency = ko.observable(false);

    self.forwardSwapFreqHandler = function (event) {
      let totalDays;
      const selectedDate = new Date(date);

      if (!event) {
        event = {
          detail: {
            value: self.forwardSwapFrequency()
          }
        };
      }

      if (event.detail.value === "0") {
        customDate = event.detail.value;
        self.customSwap(true);
        self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate(null);
        self.customSwapFrequency(true);
        ko.tasks.runEarly();
        self.minSwapValueDate(self.createForexDealModel.forexDealDTO.expiryDate());
        self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate(self.minSwapValueDate());
        $("#custom-swap-frequency").trigger("openModal");
      }

      if (event.detail.value !== "0") {
        totalDays = event.detail.value;
        renderSwapDate(totalDays, selectedDate);
      }

      self.customFrequency(false);
    };

    /**
     * This function will handle all custom date frequency operations.
     *
     * @memberOf forex-deal-create
     * @function customDateHandler
     * @returns {void}
     */
    self.customDateHandler = function () {
      if (customDate === "0") {
        const customBookingDate = new Date(self.createForexDealModel.forexDealDTO.bookingDate()),
          customValueDate = new Date(self.createForexDealModel.forexDealDTO.expiryDate());

        self.createForexDealModel.forexDealDTO.expiryDate(oj.IntlConverterUtils.dateToLocalIso(customValueDate));
        self.minValueDate(oj.IntlConverterUtils.dateToLocalIso(customBookingDate));

        const timeDiff = Math.abs(customValueDate.getTime() - customBookingDate.getTime()),
          diffDays = Math.round(timeDiff / (1000 * 3600 * 24));

        self.createForexDealModel.forexDealDTO.forwardPeriod(diffDays);
      }
    };

    self.customSwapDateHandler = function () {
      if (customDate === "0") {
        const customBookingDate = new Date(self.createForexDealModel.forexDealDTO.bookingDate()),
          customValueDate = new Date(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate());

        self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate(oj.IntlConverterUtils.dateToLocalIso(customValueDate));
        self.minSwapValueDate(self.createForexDealModel.forexDealDTO.expiryDate());

        const timeDiff = Math.abs(customValueDate.getTime() - customBookingDate.getTime()),
          diffDays = Math.round(timeDiff / (1000 * 3600 * 24));

        self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.forwardPeriod(diffDays);
      }
    };

    /**
     * This function will handle all custom date frequency operations.
     *
     * @memberOf forex-deal-create
     * @function disabledFunction
     * @param {Object} value  - An object containing the current event of field.
     * @returns {boolean} To be either true or false.
     */
    self.disabledFunction = function (value) {
      if (parseInt(value) !== 0) {
        return parseInt(value) < parseInt(self.createForexDealModel.forexDealDTO.forwardPeriod());
      }
    };

    /**
     * This function will display the exchangeRate disclaimer.
     *
     * @memberOf forex-deal-create
     * @function exchangeRateDiscPopUp
     * @param {Object} open  - An object containing the current event of field.
     * @returns {void}
     */
    self.exchangeRateDiscPopUp = function (open) {
      const popup = document.querySelector("#exchangeRate-popup");

      if (open) {
        const listener = popup.open("#exchange-rate-disclaimer");

        popup.addEventListener("ojOpen", listener);
      } else { popup.close(); }
    };

    /**
     * This function will reset the frequency and close the modal window.
     *
     * @memberOf forex-deal-create
     * @function closeModal
     * @returns {void}
     */
    self.closeModal = function () {

      self.forwardFrequency(self.frequencyList()[0].value);
      self.forwardSwapFrequency(self.frequencyList()[0].value);
      self.customSwapFrequency(false);
      $("#custom-frequency").hide();
    };

    /**
     * This function will close the after having set the custom frequency values.
     *
     * @memberOf forex-deal-create
     * @function customDateSelected
     * @returns {void}
     */
    self.customDateSelected = function () {
      if (self.selectedDealType() === "SWAP") {
        self.customSwapFrequency(false);
        self.selectedDealType(false);
        ko.tasks.runEarly();
        renderSwapDate(self.createForexDealModel.forexDealDTO.forwardPeriod(), new Date(date));
        self.minSwapValueDate(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate());
        self.forwardSwapFrequency("0");
        self.selectedDealType("SWAP");
      }

      $("#custom-frequency").hide();
    };

    self.customSwapDateSelected = function () {
      $("#custom-swap-frequency").hide();
    };

    self.closeSwapModal = function () {
      if (self.customSwap()) {
        self.minSwapValueDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createForexDealModel.forexDealDTO.expiryDate())));
        self.forwardSwapFrequency(self.forwardFrequency());

        if (self.forwardSwapFrequency() === "0") { self.customDateSelected(); }

        self.customSwap(false);
      }

      $("#custom-swap-frequency").hide();
    };

    /**
     * This function will initiate the forex deal.
     *
     * @memberOf forex-deal-create
     * @function initiateForexDeal
     * @returns {void}
     */
    self.initiateForexDeal = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) { return; }

      if (self.createForexDealModel.forexDealDTO.rateType() === "B") {
        self.createForexDealModel.forexDealDTO.sellAmount.currency(selectedCurrencies[selectedCurrencies.indexOf(self.rateCurrency()) ? 0 : 1]);
        self.createForexDealModel.forexDealDTO.buyAmount.currency(self.rateCurrency());
        self.createForexDealModel.forexDealDTO.buyAmount.amount(self.rateAmount());

        if (self.selectedDealType() === "SWAP") {
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.amount(self.rateAmount());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.amount(null);
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.currency(self.createForexDealModel.forexDealDTO.sellAmount.currency());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.currency(self.createForexDealModel.forexDealDTO.buyAmount.currency());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rate.currency(self.createForexDealModel.forexDealDTO.rate.currency());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rate.amount(self.sellRate());
        }
      } else {
        self.createForexDealModel.forexDealDTO.buyAmount.currency(selectedCurrencies[selectedCurrencies.indexOf(self.rateCurrency()) ? 0 : 1]);
        self.createForexDealModel.forexDealDTO.sellAmount.currency(self.rateCurrency());
        self.createForexDealModel.forexDealDTO.sellAmount.amount(self.rateAmount());

        if (self.selectedDealType() === "SWAP") {
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.amount(null);
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.amount(self.rateAmount());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.currency(self.createForexDealModel.forexDealDTO.sellAmount.currency());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.currency(self.createForexDealModel.forexDealDTO.buyAmount.currency());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rate.currency(self.createForexDealModel.forexDealDTO.rate.currency());
          self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rate.amount(self.buyRate());
        }
      }

      rootParams.dashboard.loadComponent("review-forex-deal-create", ko.mapping.toJS({
        createForexDealModel: self.createForexDealModel,
        partyName: self.partyName,
        dealTypeArray: self.dealTypeArray,
        rateTypeArray: self.rateTypeArray,
        selectedDealType: self.selectedDealType,
        frequencyList: self.frequencyList,
        currComboArray: self.currComboArray,
        rateCurrencyArray: self.rateCurrencyArray,
        homeBranchCodeParams: homeBranchCode,
        selectedCurrencies: selectedCurrencies,
        dateParams: date,
        retainedData: self.params.retainedData,
        transferCurrency: self.params.transferCurrency,
        currency2: self.params.currency2,
        params: self.params,
        amount: self.params.amount,
        promiseResponse: self.promiseResponse,
        reviewMode: true
      }));
    };

    /**
     * This function will be triggered to cleanup the memory allocated to subscribed functions.
     *
     * @memberOf forex-deal-create
     * @function dispose
     * @returns {void}
     */
    self.dispose = function () {
      rateCurrency.dispose();
    };

    self.showLimits = ko.observable(false);

    self.viewLimits = function () {
      self.showLimits(true);
      ko.tasks.runEarly();
      self.selectedChannelType(self.channelList()[currentLoggedInIndex].id);
      $("#forex-view-limit").trigger("openModal");
    };

    self.done = function () {
      self.showLimits(false);
      ko.tasks.runEarly();
      self.selectedChannelType(self.channelList()[currentLoggedInIndex].id);
      $("#forex-view-limit").hide();
    };
  };
});
