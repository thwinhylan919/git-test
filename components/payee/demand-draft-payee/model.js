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

      this.internationalDDPayeeModel = {
        name: null,
        nickName: null,
        status: "ACT",
        shared: false,
        payAtCity: null,
        payAtCountry: null,
        contentId: null,
        demandDraftDeliveryDTO: {
          dictionaryArray: null,
          refLinks: null,
          deliveryMode: null,
          branch: null,
          mailModeType: null,
          addressType: null
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          country: null,
          zipCode: null
        },
        demandDraftPayeeType: "INT",
        payeeType: null
      };

      this.domesticDDPayeeModel = {
        name: null,
        dictionaryArray: null,
        refLinks: null,
        id: null,
        nickName: null,
        status: "ACT",
        shared: false,
        contentId: null,
        payAtCity: null,
        demandDraftDeliveryDTO: {
          dictionaryArray: null,
          refLinks: null,
          deliveryMode: null,
          branch: null,
          mailModeType: null,
          addressType: null
        },
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          zipCode: null
        },
        demandDraftPayeeType: "DOM",
        payeeType: null
      };

      this.addressDetails = {
        modeofDelivery: null,
        addressType: null,
        addressTypeDescription: null,
        postalAddress: {
          line1: "",
          line2: "",
          line3: "",
          line4: "",
          line5: "",
          line6: "",
          line7: "",
          line8: "",
          line9: "",
          line10: "",
          line11: "",
          line12: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          branch: "",
          branchName: ""
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
    let assignedLimitPackagesDeferred;
    const assignedLimitPackages = function(deferred) {
      const options = {
        url: "me/assignedLimitPackage",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
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
    let confirmPayeeWithAuthDeferred;
    const confirmPayeeWithAuth = function(gId, pId, type, authKey, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}/authentication",
          headers: {
            TOKEN_ID: authKey
          },
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        };

      baseService.update(options, params);
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
      postPayeeLimit: function(payload) {
        postPayeeLimitDeferred = $.Deferred();
        postPayeeLimit(payload, postPayeeLimitDeferred);

        return postPayeeLimitDeferred;
      },
      fetchEffectiveTodayDetails: function() {
        fetchEffectiveTodayDetailsDeffered = $.Deferred();
        fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);

        return fetchEffectiveTodayDetailsDeffered;
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
        assignedLimitPackagesDeferred = $.Deferred();
        assignedLimitPackages(assignedLimitPackagesDeferred);

        return assignedLimitPackagesDeferred;
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
      getPayeeDetails: function(pId, gId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}/payees/demandDraft/{payeeId}"
        }, {
          groupId: gId,
          payeeId: pId
        });
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      validateRequest: function(pId, gId, model) {
          return baseService.update({
              url: "payments/payeeGroup/{groupId}/payees/demandDraft/{payeeId}",
              data: model,
              headers: {
                  "X-Validate-Only": "Y"
              }
          }, {
            groupId: gId,
            payeeId: pId
          });
      }
    };
  };

  return new addPayeeModel();
});