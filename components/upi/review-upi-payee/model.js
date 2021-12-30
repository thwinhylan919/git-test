define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Var upiPayeeModel - description.
   *
   * @return {type}  Description.
   */
  const upiPayeeModel = function () {
    const Model = function () {
      this.payee = {
        name: null,
        nickName: null,
        groupId: null,
        status: null,
        vpaId: null,
        payeeType: null,
        accountName: null
      };

      this.payeeGroup = {
        name: null,
        contentId: null
      };
    },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let region, getPaymentTypesDeferred;
    const getPaymentTypes = function (deferred) {
      const options = {
        url: "enumerations/paymentType?REGION={region}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          region: region
        };

      baseService.fetch(options, params);
    };
    let createPayeeGroupDeferred;
    const createPayeeGroup = function (model, deferred) {
      const options = {
        url: "payments/payeeGroup",
        data: model,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let uploadImageDeffered;
    const uploadImage = function (form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };
    let createPayeeDeferred;
    const createPayee = function (model, groupId, deferred) {
      const options = {
        url: "payments/payeeGroup/{groupId}/payees/vpa",
        data: model,
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          groupId: groupId
        };

      baseService.add(options, params);
    };
    let getBankDetailsDeferred;
    const getBankDetails = function (code, deferred) {
      const options = {
        url: "financialInstitution/bicCodeDetails/{BICCode}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          BICCode: code
        };

      baseService.fetch(options, params);
    };
    let getBankDetailsNCCDeferred;
    const getBankDetailsNCC = function (code, deferred) {
      const options = {
        url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          nationalClearingCodeType: "UK",
          nationalClearingCode: code
        };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function () {
        return new Model();
      },
      getPaymentTypes: function () {
        getPaymentTypesDeferred = $.Deferred();
        getPaymentTypes(getPaymentTypesDeferred);

        return getPaymentTypesDeferred;
      },
      getBankDetails: function (code) {
        getBankDetailsDeferred = $.Deferred();
        getBankDetails(code, getBankDetailsDeferred);

        return getBankDetailsDeferred;
      },
      createPayeeGroup: function (payload) {
        createPayeeGroupDeferred = $.Deferred();
        createPayeeGroup(payload, createPayeeGroupDeferred);

        return createPayeeGroupDeferred;
      },
      createPayee: function (payload, groupId) {
        createPayeeDeferred = $.Deferred();
        createPayee(payload, groupId, createPayeeDeferred);

        return createPayeeDeferred;
      },
      uploadImage: function (form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      getPayeeMaintenance: function () {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getBankDetailsNCC: function (code) {
        getBankDetailsNCCDeferred = $.Deferred();
        getBankDetailsNCC(code, getBankDetailsNCCDeferred);

        return getBankDetailsNCCDeferred;
      }
    };
  };

  return new upiPayeeModel();
});