define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const UserCredentialModel = function () {
    const Model = function () {
        this.registrationId = null;
        this.firstName = null;
        this.lastName = null;
        this.emailId = null;
        this.partyId = null;
        this.dateOfBirth = null;
        this.customer = null;
        this.remarks = null;
        this.mobileNumber = null;
        this.accountNumber = null;
        this.username = null;
        this.password = null;
        this.creditCardNumber = null;
        this.creditCardNameOnCard = null;
        this.creditCardExpiryDate = null;
        this.creditCardCVVNumber = null;
        this.debitCardNumber = null;
        this.debitCardPin = null;
        this.accountType = null;
      },
      baseService = BaseService.getInstance();
    let getAccountsDeffered, createRequestDeferred;
    const getAccounts = function (deferred) {
        const options = {
          url: "enumerations/accountTypes",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      createRequest = function (payload, deferred) {
        const options = {
          url: "registration",
          data: payload,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

        baseService.add(options);
      };

    return {
      getNewModel: function () {
        return new Model();
      },
      getAccounts: function () {
        getAccountsDeffered = $.Deferred();
        getAccounts(getAccountsDeffered);

        return getAccountsDeffered;
      },
      createRequest: function (payload) {
        createRequestDeferred = $.Deferred();
        createRequest(payload, createRequestDeferred);

        return createRequestDeferred;
      }
    };
  };

  return new UserCredentialModel();
});