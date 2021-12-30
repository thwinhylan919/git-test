define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const PayeeListModel = function() {
    const Model = function() {
      this.payeeGroup = {
        contentId: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getPayeeListDeferred;
    const getPayeeList = function(deferred, types) {
      const options = {
        url: types ? "payments/payeeGroup?expand=ALL&types={types}" : "payments/payeeGroup?expand=ALL",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },params = {
        types: types
      };

      if (types) {
        baseService.fetch(options, params);
      } else {
        baseService.fetch(options);
      }
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
    let deletePayeeDeferred;
    const deletePayee = function(deferred, type, groupId, payeeId) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          showInModalWindow : true,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            if (data.status !== 417) {
              deferred.reject(data, status, jqXHR);
            }
          }
        },
        params = {
          payeeType: type,
          payeeId: payeeId,
          groupId: groupId
        };

      baseService.remove(options, params);
    };
    let readImageDeferred;
    const readImage = function(gId, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/image",
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

      baseService.fetch(options, params);
    };
    let fetchCountryCodeDeferred;
    const fetchCountryCode = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fireBatchDeferred;
    const batchRead = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
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
      getNewModel: function() {
        return new Model();
      },
      deletePayee: function(type, groupId, payeeId) {
        objectInitializedCheck();
        deletePayeeDeferred = $.Deferred();
        deletePayee(deletePayeeDeferred, type, groupId, payeeId);

        return deletePayeeDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);

        return bancConfigurationDeffered;
      },
      getPayeeList: function(types) {
        objectInitializedCheck();
        getPayeeListDeferred = $.Deferred();
        getPayeeList(getPayeeListDeferred, types);

        return getPayeeListDeferred;
      },
      readImage: function(gId) {
        objectInitializedCheck();
        readImageDeferred = $.Deferred();
        readImage(gId, readImageDeferred);

        return readImageDeferred;
      },
      fetchCountryCode: function() {
        fetchCountryCodeDeferred = $.Deferred();
        fetchCountryCode(fetchCountryCodeDeferred);

        return fetchCountryCodeDeferred;
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
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
      editPayeeGroup: function(payload, gId) {
        return baseService.update({
            url: "payments/payeeGroup/{groupId}",
            data: payload
        }, {
            groupId: gId
        });
      },
      getPayeeLimit: function() {
          return baseService.fetch({
              url: "me/customLimitPackage"
          });
      },
      assignedLimitPackages: function() {
          return baseService.fetch({
              url: "me/assignedLimitPackage"
          });
      }
    };
  };

  return new PayeeListModel();
});