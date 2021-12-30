define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const addPayeeModel = function() {
    const Model = function() {
      this.payeeGroup = {
        name: null,
        contentId: null
      };

      this.internalPayeeModel = {
        name: null,
        nickName: null,
        status: "ACT",
        accountNumber: null,
        accountName: null,
        contentId: null,
        shared: false
      };

      this.domesticIndiaAccBasedPayeeModel = {
        nickName: null,
        status: "ACT",
        domesticPayeeType: "INDIA",
        indiaDomesticPayee: {
          name: null,
          nickName: null,
          transferMode: "ACC",
          accountNumber: null,
          accountName: null,
          contentId: null,
          shared: false,
          bankDetails: {
            name: null,
            branch: null,
            address: null,
            city: null,
            country: null,
            codeType: null,
            code: null
          }
        }
      };

      this.domesticSepaAccBasedPayeeModel = {
        nickName: null,
        status: "ACT",
        domesticPayeeType: "SEPA",
        sepaDomesticPayee: {
          name: null,
          nickName: null,
          iban: null,
          accountName: null,
          shared: false,
          contentId: null,
          bankDetails: {
            name: null,
            branch: null,
            address: null,
            city: null,
            country: null,
            codeType: null,
            code: null
          },
          sepaType: null
        },
        payeeType: null
      };

      this.domesticUKAccBasedPayeeModel = {
        nickName: null,
        status: "ACT",
        domesticPayeeType: "UK",
        ukDomesticPayee: {
          name: null,
          nickName: null,
          paymentType: null,
          network: null,
          contentId: null,
          accountNumber: null,
          accountName: null,
          shared: false,
          bankDetails: {
            name: null,
            branch: null,
            address: null,
            city: null,
            country: null,
            codeType: null,
            code: null
          }
        },
        payeeType: null
      };

      this.internationalAccBasedPayeeModel = {
        name: null,
        status: "ACT",
        nickName: null,
        shared: false,
        contentId: null,
        accountNumber: null,
        accountName: null,
        transferMode: "ACC",
        network: null,
        bankDetails: {
          name: null,
          branch: null,
          address: null,
          city: null,
          country: null,
          codeType: null,
          code: null
        },
        address: {
            line1: null,
            line2: null,
            city: null,
            country: null
        }
      };

      this.payeeLimitModel = {
        currency: "",
        accessPointValue: "",
        accessPointGroupType: "",
        targetLimitLinkages: [{
          target: {
            value: "",
            type: {
              id: "PAYEE",
              name: "PAYEE",
              mandatory: true
            }
          },
          limits: [],
          effectiveDate: "",
          expiryDate: ""
        }]
      };

      this.limitModel = {
        limitType: "PER",
        maxAmount: {
          currency: null,
          amount: null
        },
        maxCount: null,
        periodicity: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let createPayeeGroupDeferred;
    const createPayeeGroup = function(model, deferred) {
      const options = {
        url: "payments/payeeGroup",
        data: model,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let deletePayeeGroupDeferred;
    const deletePayeeGroup = function(gId, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId
        };

      baseService.remove(options, params);
    };
    let addPayeeDeferred;
    const addPayee = function(gId, type, model, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId,
          payeeType: type
        };

      baseService.add(options, params);
    };
    let deletePayeeDeferred;
    const deletePayee = function(gId, pId, type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId,
          payeeType: type,
          payeeId: pId
        };

      baseService.remove(options, params);
    };
    let confirmPayeeDeferred;
    const confirmPayee = function(gId, pId, type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        };

      baseService.patch(options, params);
    };
    let postPayeeLimitDeferred;
    const postPayeeLimit = function(payload, deferred) {
      const options = {
        url: "me/customLimitPackage",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let confirmPayeeWithAuthDeferred;
    const confirmPayeeWithAuth = function(gId, pId, type, authKey, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}/authentication",
          headers: {
            TOKEN_ID: authKey
          },
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        };

      baseService.update(options, params);
    };
    let fetchEffectiveTodayDetailsDeffered;
    const fetchEffectiveTodayDetails = function(deffered) {
      const options = {
        url: "limitPackages/config/effectiveToday",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getPayeeLimitDeferred;
    const getPayeeLimit = function(deferred) {
      const options = {
        url: "me/customLimitPackage",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let putPayeeLimitDeferred;
    const putPayeeLimit = function(payload, deferred) {
      const options = {
        url: "me/customLimitPackage",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.update(options);
    };
    let bancConfigurationDeffered;
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
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
        const options = {
          url: "contents",
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.uploadFile(options);
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
      /**
       * Method to initialize the described model.
       */
      init: function() {
        modelInitialized = true;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      addPayee: function(gId, type, model) {
        objectInitializedCheck();
        addPayeeDeferred = $.Deferred();
        addPayee(gId, type, model, addPayeeDeferred);

        return addPayeeDeferred;
      },
      deletePayee: function(gId, pId, type) {
        objectInitializedCheck();
        deletePayeeDeferred = $.Deferred();
        deletePayee(gId, pId, type, deletePayeeDeferred);

        return deletePayeeDeferred;
      },
      readPayee: function(gId, pId, type) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}"
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      confirmPayee: function(gId, pId, type) {
        objectInitializedCheck();
        confirmPayeeDeferred = $.Deferred();
        confirmPayee(gId, pId, type, confirmPayeeDeferred);

        return confirmPayeeDeferred;
      },
      confirmPayeeWithAuth: function(gId, pId, type, authKey) {
        objectInitializedCheck();
        confirmPayeeWithAuthDeferred = $.Deferred();
        confirmPayeeWithAuth(gId, pId, type, authKey, confirmPayeeWithAuthDeferred);

        return confirmPayeeWithAuthDeferred;
      },
      createPayeeGroup: function(payload) {
        objectInitializedCheck();
        createPayeeGroupDeferred = $.Deferred();
        createPayeeGroup(payload, createPayeeGroupDeferred);

        return createPayeeGroupDeferred;
      },
      deletePayeeGroup: function(gId) {
        objectInitializedCheck();
        deletePayeeGroupDeferred = $.Deferred();
        deletePayeeGroup(gId, deletePayeeGroupDeferred);

        return deletePayeeGroupDeferred;
      },
      fetchEffectiveTodayDetails: function() {
        fetchEffectiveTodayDetailsDeffered = $.Deferred();
        fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);

        return fetchEffectiveTodayDetailsDeffered;
      },
      postPayeeLimit: function(payload) {
        postPayeeLimitDeferred = $.Deferred();
        postPayeeLimit(payload, postPayeeLimitDeferred);

        return postPayeeLimitDeferred;
      },
      getPayeeLimit: function() {
        getPayeeLimitDeferred = $.Deferred();
        getPayeeLimit(getPayeeLimitDeferred);

        return getPayeeLimitDeferred;
      },
      putPayeeLimit: function(payload) {
        putPayeeLimitDeferred = $.Deferred();
        putPayeeLimit(payload, putPayeeLimitDeferred);

        return putPayeeLimitDeferred;
      },
      assignedLimitPackages: function() {
        return baseService.fetch({
          url: "me/assignedLimitPackage"
        });
      },
      fetchCountryCode: function() {
        return baseService.fetch({
          url: "enumerations/country"
        });
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);

        return bancConfigurationDeffered;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
      },
      retrieveImageTypeSuuport: function() {
        return baseService.fetch({
          url: "maintenances/payments/payeecontent"
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getGroupDetails: function(groupId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}"
        }, {
          groupId: groupId
        });
      },
      getPayeeDetails: function(pId, gId, type) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}"
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      validateRequest: function(pId, gId, type, model) {
          return baseService.update({
              url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
              data: model,
              headers: {
                  "X-Validate-Only": "Y"
              }
          }, {
            groupId: gId,
            payeeId: pId,
            payeeType: type
          });
      }
    };
  };

  return new addPayeeModel();
});