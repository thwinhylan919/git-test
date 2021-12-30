define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const updateDeletePayeeModel = function() {
    const Model = function() {
      this.payeeLimitModel = {
        name: "",
        description: "",
        currency: "",
        owner: {
          key: {
            value: "",
            type: ""
          }
        },
        targetLimitLinkages: [{
          target: {
            value: null,
            type: {
              id: "PAYEE",
              name: "PAYEE",
              mandatory: true
            }
          },
          limits: [{
            limitType: "PER",
            maxAmount: {
              currency: null,
              amount: null
            },
            maxCount: null,
            periodicity: "DAILY"
          }],
          effectiveDate: ""
        }],
        assignableToList: [{
          key: {
            type: "",
            value: ""
          }
        }]
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

      this.editPayeeModel = {
        shared: false,
        contentId: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let payeeId, groupId, getPayeeDeferred;
    const getPayee = function(type, deferred) {
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
          payeeType: type,
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.fetch(options, params);
    };
    let getBranchAddressDeferred;
    const getBranchAddress = function(branchCode, deferred) {
      const options = {
          url: "locations/branches?branchCode={branchCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          branchCode: branchCode
        };

      baseService.fetch(options, params);
    };
    let deletePayeeDeferred;
    const deletePayee = function(type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          payeeType: type,
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.remove(options, params);
    };
    let fetchAddressTypeDeferred;
    const fetchAddressType = function(deferred) {
      const options = {
        url: "enumerations/addressType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getPayeeLimitDeferred;
    const getPayeeLimit = function(deferred) {
      const options = {
          url: "me/customLimitPackage",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.fetch(options, params);
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
        },
        params = {
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.add(options, params);
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
        },
        params = {
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.update(options, params);
    };
    let editPayeeDeferred;
    const editPayee = function(payload, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeId}",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.update(options, params);
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
      init: function(id, gid) {
        groupId = gid || undefined;
        payeeId = id || undefined;
        modelInitialized = true;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getPayee: function(type) {
        objectInitializedCheck();
        getPayeeDeferred = $.Deferred();
        getPayee(type, getPayeeDeferred);

        return getPayeeDeferred;
      },
      deletePayee: function(type) {
        objectInitializedCheck();
        deletePayeeDeferred = $.Deferred();
        deletePayee(type, deletePayeeDeferred);

        return deletePayeeDeferred;
      },
      getBranchAddress: function(branchCode) {
        objectInitializedCheck();
        getBranchAddressDeferred = $.Deferred();
        getBranchAddress(branchCode, getBranchAddressDeferred);

        return getBranchAddressDeferred;
      },
      fetchAddressType: function() {
        fetchAddressTypeDeferred = $.Deferred();
        fetchAddressType(fetchAddressTypeDeferred);

        return fetchAddressTypeDeferred;
      },
      editPayee: function(payload) {
        editPayeeDeferred = $.Deferred();
        editPayee(payload, editPayeeDeferred);

        return editPayeeDeferred;
      },
      getPayeeLimit: function() {
        getPayeeLimitDeferred = $.Deferred();
        getPayeeLimit(getPayeeLimitDeferred);

        return getPayeeLimitDeferred;
      },
      postPayeeLimit: function(payload) {
        postPayeeLimitDeferred = $.Deferred();
        postPayeeLimit(payload, postPayeeLimitDeferred);

        return postPayeeLimitDeferred;
      },
      putPayeeLimit: function(payload) {
        putPayeeLimitDeferred = $.Deferred();
        putPayeeLimit(payload, putPayeeLimitDeferred);

        return putPayeeLimitDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);

        return bancConfigurationDeffered;
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      retrieveImageTypeSuuport: function() {
        return baseService.fetch({
          url: "maintenances/payments/payeecontent"
        });
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      fetchCourierAddress: function() {
          return baseService.fetch({
              url: "me/party"
          });
      },
      fetchBranchAddress: function(branchCode) {
          return baseService.fetch({
              url: "locations/branches?branchCode={branchCode}"
          }, {
              branchCode: branchCode
          });
      }
    };
  };

  return new updateDeletePayeeModel();
});