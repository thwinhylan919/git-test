define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/gamma/resources/nls/account-details",
  "ojs/ojvalidationgroup"
], function(ko, $, AccountDetailsModel, resourceBundle) {
  "use strict";

  /**
   * Let vm - description.
   *
   * @param  {type} rootParams
   * @return {type}
   */
  const vm = function(rootParams) {
    const self = this;
    let isToBeUpdated = false;

    ko.utils.extend(self, rootParams.rootModel);

    /**
     * Let getNewKoModel - description.
     *
     * @return {KoModel}  KoModel.
     */
    const getNewKoModel = function() {
      const KoModel = AccountDetailsModel.getNewModel();

      KoModel.accountDetailsPayload.temp_maskAccountNumber = ko.observable(KoModel.accountDetailsPayload.temp_maskAccountNumber);
      KoModel.accountDetailsPayload.temp_reAccountNumber = ko.observable(KoModel.accountDetailsPayload.temp_reAccountNumber);
      KoModel.accountDetailsPayload.temp_maskReAccountNumber = ko.observable(KoModel.accountDetailsPayload.temp_maskReAccountNumber);

      return KoModel;
    };

    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.accountDetailsLoaded = ko.observable(false);
    self.accountTypeListLoaded = ko.observable(false);
    self.accountTypeList = ko.observable();
    self.accountTypeChecked = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.validationTracker = ko.observable();
    self.accountNumberChanged = ko.observable(false);

    self.validateBankName = {
      type: "length",
      options: {
        min: 1,
        max: 30
      }
    };

    self.validateRoutingNumber = {
      type: "length",
      options: {
        min: 5,
        max: 20
      }
    };

    self.applicantObject().accountDetails = getNewKoModel().accountDetailsPayload;

    AccountDetailsModel.getAccountTypeList().done(function(data) {
      if (data.enumRepresentations && data.enumRepresentations[0] && data.enumRepresentations[0].data) {
        self.accountTypeList(data.enumRepresentations[0].data);
        self.accountTypeChecked(self.accountTypeList()[0].code);
        self.applicantObject().accountDetails.accountType = self.accountTypeList()[0].code;
      }

      self.accountTypeListLoaded(true);

      AccountDetailsModel.getAccountDetails(self.productDetails().submissionId.value).done(function(data) {
        if (!$.isEmptyObject(data)) {
          if (data.accountNumber) {
            self.applicantObject().accountDetails.accountNumber = data.accountNumber;
            self.applicantObject().accountDetails.temp_maskAccountNumber(self.maskValue(self.applicantObject().accountDetails.accountNumber, self.applicantObject().accountDetails.accountNumber.length - 4));
            self.applicantObject().accountDetails.routingNumber = data.routingNumber;
            self.applicantObject().accountDetails.bankName = data.bankName;
            self.applicantObject().accountDetails.accountType = data.accountType;
            self.applicantObject().accountDetails.temp_selectedAccountType = rootParams.baseModel.getDescriptionFromCode(self.accountTypeList(), self.applicantObject().accountDetails.accountType);
            self.accountTypeChecked(data.accountType);
            isToBeUpdated = true;
          }
        }

        self.accountDetailsLoaded(true);
      });
    });

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.accountTypeChange = function(event) {
      self.applicantObject().accountDetails.accountType = event.detail.value;
      self.applicantObject().accountDetails.accountNumber = "";
      self.applicantObject().accountDetails.temp_maskAccountNumber("");
      self.applicantObject().accountDetails.temp_reAccountNumber("");
      self.applicantObject().accountDetails.temp_maskReAccountNumber("");
    };

    /**
     * Self - description.
     *
     * @param  {type} event - Event.
     * @param  {type} data  - Data.
     * @return {type}       Void.
     */
    self.accountNumberChange = function(event) {
      if (event.detail.value) {
        self.accountDetailsLoaded(false);
        self.applicantObject().accountDetails.temp_reAccountNumber("");
        self.applicantObject().accountDetails.temp_maskReAccountNumber("");
        self.accountNumberChanged(true);
        ko.tasks.runEarly();
        self.accountDetailsLoaded(true);
      }
    };

    self.equalToAccountNo = {
      /**
       * Validate - description.
       *
       * @return {boolean}  Description.
       */
      validate: function(value) {
        const compareTo = self.applicantObject().accountDetails.accountNumber;

        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          throw new Error(self.resource.messages.accountNumberMatch);
        }

        return true;
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Void.
     */
    self.submitAccountDetails = function() {
      const tracker = document.getElementById("payday-account-tracker");

      if (tracker.valid === "valid") {
        self.applicantObject().accountDetails.temp_selectedAccountType = rootParams.baseModel.getDescriptionFromCode(self.accountTypeList(), self.applicantObject().accountDetails.accountType);

        AccountDetailsModel.submitAccountDetails(self.productDetails().submissionId.value, ko.mapping.toJSON(self.applicantObject().accountDetails, {
          ignore: ["temp_selectedAccountType", "temp_reAccountNumber", "temp_maskReAccountNumber", "temp_maskAccountNumber"]
        }), isToBeUpdated).done(function() {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.accountNumberFocusOut = function(event) {
      const val = event.target.value.replace(/\-|\D/g, "");

      self.applicantObject().accountDetails.accountNumber = event.target.value.replace(/\-|\D/g, "");
      event.target.value = self.maskValue(val, val.length - 4);
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.accountNumberFocusIn = function(event) {
      event.target.value = self.applicantObject().accountDetails.accountNumber;
    };

    /**
     * Self - description.
     *
     * @param  {type} event - Description.
     * @return {type}       Description.
     */
    self.reEnterAccountNumberFocusOut = function(event) {
      const val = event.target.value.replace(/\-|\D/g, "");

      self.applicantObject().accountDetails.temp_reAccountNumber(event.target.value.replace(/\-|\D/g, ""));
      event.target.value = self.maskValue(val, val.length - 4);
    };

    /**
     * Self - description.
     *
     * @param  {type} event - Description.
     * @return {type}       Description.
     */
    self.reEnterAccountNumberFocusIn = function(event) {
      event.target.value = self.applicantObject().accountDetails.temp_reAccountNumber();
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.openWindow = function() {
      $("#whereToFindAccountDetails").trigger("openModal");
      $(window).scrollTop(0);
    };
  };

  return {
    viewModel: vm
  };
});