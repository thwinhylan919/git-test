define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SecuritycodeModel = function() {
    const Model = function() {
      this.onBoardingModel = {
        phoneNumber: "",
        otprequired: true,
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        uId: "",
        userId: "",
        aliasType: "",
        aliasValue: "",
        mobileNumber: ""
      };

      this.verifyModel = {
        aliasType: "",
        aliasValue: ""
      };

      this.bankdetailsModel = {
        accountId: "",
        status: "U",
        bankCode: "",
        payeeType: "INTERNATIONAL",
        partyId: "",
        aliasType: "",
        aliasValue: "",
        uId: "",
        firstName: "",
        paymentId: ""
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
    const readUser = function(value, type, etagHandler, deferred) {
      const options = {
          url: "payments/transfers/peerToPeer/user?type={aliasType}&value={aliasValue}",
          success: function(data) {
            deferred.resolve(data);
          },
          complete: function(xhr) {
            etagHandler(xhr);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          aliasValue: value,
          aliasType: type
        };

      baseService.fetch(options, params);
    };
    let getBranchDeferred;
    const getBranch = function(deferred) {
      const options = {
        url: "locations/country/all/city/all/branchCode/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let verifyUserDeferred;
    const verifyUser = function(version, uid, payload, deferred) {
      const options = {
        url: "payments/transfers/peerToPeer/user/authentication",
        headers: {
          "If-Match": version,
          TOKEN_ID: uid
        },
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
      verifyUser: function(version, uid, payload) {
        objectInitializedCheck();
        verifyUserDeferred = $.Deferred();
        verifyUser(version, uid, payload, verifyUserDeferred);

        return verifyUserDeferred;
      },
      confirmUser: function(version, payload) {
        objectInitializedCheck();
        confirmUserDeferred = $.Deferred();
        confirmUser(version, payload, confirmUserDeferred);

        return confirmUserDeferred;
      },
      readUser: function(value, type, etagHandler) {
        objectInitializedCheck();
        readUserDeferred = $.Deferred();
        readUser(value, type, etagHandler, readUserDeferred);

        return readUserDeferred;
      },
      getBranch: function() {
        objectInitializedCheck();
        getBranchDeferred = $.Deferred();
        getBranch(getBranchDeferred);

        return getBranchDeferred;
      }
    };
  };

  return new SecuritycodeModel();
});