define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const newDebtorModel = function() {
    const Model = function() {
        this.debtorModel = {
          nickName: null,
          groupId: null,
          domesticPayerType: "SEPA",
          contentId: null,
          sepaDomesticPayer: {
            iban: null,
            bankDetails: {
              code: null
            },
            sepaPayerType: "DIR"
          }
        };

        this.debtorName = {
          name: null,
          contentId: null
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getDebtorGroupNameDeferred;
    const getDebtorGroupName = function(model, deferred) {
      const options = {
        url: "payments/payerGroup",
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
    let createNewPayerDeferred;
    const createNewPayer = function(model, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: groupId
        };

      baseService.add(options, params);
    };
    let confirmAddDebtorDeferred;
    const confirmAddDebtor = function(payerId, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          groupId: groupId,
          payerId: payerId
        };

      baseService.patch(options, params);
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
    let deleteDebtorGroupDeferred;
    const deleteDebtorGroup = function(groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: groupId
        };

      baseService.remove(options, params);
    };
    let deleteDebtorDeferred;
    const deleteDebtor = function(payerId, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          payerId: payerId,
          groupId: groupId
        };

      baseService.remove(options, params);
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
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getDebtorGroupName: function(model) {
        getDebtorGroupNameDeferred = $.Deferred();
        getDebtorGroupName(model, getDebtorGroupNameDeferred);

        return getDebtorGroupNameDeferred;
      },
      createNewPayer: function(model, groupId) {
        createNewPayerDeferred = $.Deferred();
        createNewPayer(model, groupId, createNewPayerDeferred);

        return createNewPayerDeferred;
      },
      confirmAddDebtor: function(payerId, groupId) {
        confirmAddDebtorDeferred = $.Deferred();
        confirmAddDebtor(payerId, groupId, confirmAddDebtorDeferred);

        return confirmAddDebtorDeferred;
      },
      deleteDebtorGroup: function(groupId) {
        deleteDebtorGroupDeferred = $.Deferred();
        deleteDebtorGroup(groupId, deleteDebtorGroupDeferred);

        return deleteDebtorGroupDeferred;
      },
      deleteDebtor: function(payerId, groupId) {
        deleteDebtorDeferred = $.Deferred();
        deleteDebtor(payerId, groupId, deleteDebtorDeferred);

        return deleteDebtorDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
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
      }
    };
  };

  return new newDebtorModel();
});