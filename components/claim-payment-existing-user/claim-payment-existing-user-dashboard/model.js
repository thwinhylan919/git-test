define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SecuritycodeModel = function() {
    const Model = function() {
      this.bankdetailsModel = {
        accountId: null,
        status: "U",
        bankCode: null,
        payeeType: "INTERNATIONAL",
        partyId: null,
        aliasType: null,
        aliasValue: null,
        uid: null,
        firstName: null,
        paymentId: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
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
    let fetchPartyDeferred;
    const fetchParty = function(deferred) {
      const options = {
        url: "parties/me",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchLdapUserDeferred;
    const fetchLdapUser = function(deferred) {
      const options = {
        url: "me",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBankDetailsBICDeferred;
      const getBankDetailsBIC = function(code, deferred) {
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
    let confirmPaymentDeferred;
    const confirmPayment = function(paymentId, determinantValue ,deferred ) {
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

          if(determinantValue){
          options.headers = {};
          options.headers["X-Target-Unit"] = determinantValue;
        }

        baseService.patch(options, params);
      },
      logout = function(callback) {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage("logout");
        }

        const options = {
          url: "session",
          success: function() {
            callback();
          }
        };

        baseService.remove(options);
      },
      logoutDBAuth = function() {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage("logout");
        }

        const options = {
          url: "session",
          success: function() {
            window.location.href = window.location.origin + "/index.html?module=login";
          }
        };

        baseService.remove(options);
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
      readUser: function(value, type) {
        objectInitializedCheck();
        readUserDeferred = $.Deferred();
        readUser(value, type, readUserDeferred);

        return readUserDeferred;
      },
      fetchBankConfiguration: function() {
        bankConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bankConfigurationDeffered);

        return bankConfigurationDeffered;
      },
      getBankDetailsDCC: function(code) {
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
    },
     getBankDetailsBIC: function(code) {
      getBankDetailsBICDeferred = $.Deferred();
      getBankDetailsBIC(code, getBankDetailsBICDeferred);

      return getBankDetailsBICDeferred;
    },
      fetchParty: function() {
        objectInitializedCheck();
        fetchPartyDeferred = $.Deferred();
        fetchParty(fetchPartyDeferred);

        return fetchPartyDeferred;
      },
      fetchLdapUser: function() {
        objectInitializedCheck();
        fetchLdapUserDeferred = $.Deferred();
        fetchLdapUser(fetchLdapUserDeferred);

        return fetchLdapUserDeferred;
      },
      confirmPayment: function(paymentId ,determinantValue) {
        objectInitializedCheck();
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, determinantValue, confirmPaymentDeferred);

        return confirmPaymentDeferred;
      },
      logout: function(callback) {
        logout(callback);
      },
      logoutDBAuth: function() {
        logoutDBAuth();
      }
    };
  };

  return new SecuritycodeModel();
});