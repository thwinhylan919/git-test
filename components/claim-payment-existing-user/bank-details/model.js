define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SecuritycodeModel = function() {
    const Model = function() {
      this.onBoardingModel = {
        phoneNumber: null,
        otprequired: false,
        firstName: null,
        lastName: null,
        emailId: {
          value: null
        },
        password: null,
        uid: null,
        userId: null,
        aliasType: null,
        aliasValue: null,
        mobileNumber: null,
        paymentId: null
      };

      this.bankdetailsModel = {
        accountId: null,
        status: "U",
        bankCode: null,
        payeeType: null,
        partyId: null,
        aliasType: null,
        aliasValue: null,
        uid: null,
        firstName: null,
        paymentId: null,
        accountName: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let createUserDeferred;
    const createUser = function(payload, deferred) {
      const options = {
        url: "payments/transfers/peerToPeer/user",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let readUserDeferred;
    const readUser = function(value, type, deferred) {
      const options = {
          url: "payments/transfers/peerToPeer/user?type={aliasType}&value={aliasValue}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          aliasValue: value,
          aliasType: type
        };

      baseService.fetch(options, params);
    };
    /*getBranchDeferred, getBranch = function (deferred) {
        let options = {
            url: 'locations/country/all/city/all/branchCode/',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data) {
                deferred.reject(data);
            }
        };
        baseService.fetch(options);
    }, */
    let verifyUserDeferred;
    const verifyUser = function(payload, deferred) {
      const options = {
        url: "payments/transfers/peerToPeer/user/authentication",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.patch(options);
    };
    let confirmUserDeferred;
    const confirmUser = function(version, payload, deferred) {
      const options = {
        url: "payments/transfers/peerToPeer/user",
        headers: {
          "If-Match": version
        },
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.update(options);
    };
    let confirmPaymentDeferred;
    const confirmPayment = function(paymentId, deferred) {
      const options = {
          url: "payments/transfers/peerToPeer/user/{paymentId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          paymentId: paymentId
        };

      baseService.patch(options, params);
    };

    let getBankDetailsDeferred;
    const getBankDetails = function(code, deferred) {
    const options = {
        url: "financialInstitution/bicCodeDetails/{BICCode}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        BICCode: code
      };

      baseService.fetch(options, params);
    };

    let bankConfigurationDeffered;
    const fetchBankConfiguration = function(deferred) {
      const options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    let getBankDetailsDCCDeferred;
    const getBankDetailsDCC = function(code, deferred) {
        const options = {
            url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            domesticClearingCodeType: "INDIA",
            domesticClearingCode: code
          };

        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      createUser: function(payload) {
        objectInitializedCheck();
        createUserDeferred = $.Deferred();
        createUser(payload, createUserDeferred);

        return createUserDeferred;
      },
      verifyUser: function(payload) {
        objectInitializedCheck();
        verifyUserDeferred = $.Deferred();
        verifyUser(payload, verifyUserDeferred);

        return verifyUserDeferred;
      },
      confirmPayment: function(paymentId) {
        objectInitializedCheck();
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, confirmPaymentDeferred);

        return confirmPaymentDeferred;
      },
      confirmUser: function(version, payload) {
        objectInitializedCheck();
        confirmUserDeferred = $.Deferred();
        confirmUser(version, payload, confirmUserDeferred);

        return confirmUserDeferred;
      },
      readUser: function(value, type) {
        objectInitializedCheck();
        readUserDeferred = $.Deferred();
        readUser(value, type, readUserDeferred);

        return readUserDeferred;
      },
      /*getBranch: function () {
          objectInitializedCheck();
          getBranchDeferred = $.Deferred();
          getBranch(getBranchDeferred);
          return getBranchDeferred;
      },*/
      getBankDetailsDCC: function(code) {
        objectInitializedCheck();
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
      },
      getBankDetails: function(code) {
        getBankDetailsDeferred = $.Deferred();
        getBankDetails(code, getBankDetailsDeferred);

        return getBankDetailsDeferred;
      },
      fetchBankConfiguration: function() {
        bankConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bankConfigurationDeffered);

        return bankConfigurationDeffered;
      }
    };
  };

  return new SecuritycodeModel();
});