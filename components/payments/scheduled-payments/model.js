define([
  "jquery",
  "baseService",
  "baseModel"
], function ($, BaseService, BaseModel) {
  "use strict";

  const ScheduledPaymentsInfoModel = function () {
    const Model = function () {
      this.cancelModel = {
        instructionType: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance(),
      baseModel = BaseModel.getInstance();
    let initiateCancelSIDeferred;
    const initiateCancelSI = function (id, payload, deferred) {
      const options = {
          url: "payments/instructions/cancellation/{externalReferenceId}",
          data: payload,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          externalReferenceId: id
        };

      baseService.add(options, params);
    };
    let verifyCancelSIDeferred;
    const verifyCancelSI = function (id, deferred) {
        const options = {
            url: "payments/instructions/cancellation/{externalReferenceId}",
            success: function (data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function (data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            externalReferenceId: id
          };

        baseService.patch(options, params);
      },
      fetchAccountData = function (taskCode, type) {
        let accounts = [];
        const batchRequest = [];

        if (Array.isArray(type)) {
          accounts = type;
        } else {
          accounts.push(type);
        }

        let sequenceId = 0;

        accounts.forEach(function (urlType) {
          const queryParams = Object.assign({}, baseModel.QueryParams.get(null, urlType), {
            taskCode: taskCode
          });

          urlType = baseModel.QueryParams.remove(urlType);

          batchRequest.push({
            headers: {
              "Content-Id": sequenceId,
              "Content-Type": "application/json"
            },
            uri: {
              value: baseModel.format(baseModel.QueryParams.add("/accounts/{urlType}", queryParams), {
                urlType: urlType
              })
            },
            methodType: "GET"
          });

          sequenceId++;
        });

        return baseService.fetchWidget({
          url: "batch",
          mockedUrl: "framework/json/design-dashboard/accounts/batch-account.json"
        }, {}, {
          batchDetailRequestList: batchRequest
        });
      };
    let getHostDateDeferred;
    const getHostDate = function (deferred) {
      const options = {
        url: "payments/currentDate",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getUpcomingPaymentsListDeferred;
    const getUpcomingPaymentsList = function (fromDate, toDate, accountId, url, deferred) {
      const options = {
          url: url,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          fromDate: fromDate,
          toDate: toDate,
          accountId: accountId
        };

      baseService.fetch(options, params);
    };
    let fireBatchDeferred;
    const batchRead = function (deferred, batchRequest, type) {
        const options = {
          url: "batch",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

        baseService.batch(options, {
          type: type
        }, batchRequest);
      },
      errors = {
        InitializationException: function () {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function () {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function () {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function () {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      initiateCancelSI: function (refId, payload) {
        objectInitializedCheck();
        initiateCancelSIDeferred = $.Deferred();
        initiateCancelSI(refId, payload, initiateCancelSIDeferred);

        return initiateCancelSIDeferred;
      },
      verifyCancelSI: function (refId) {
        objectInitializedCheck();
        verifyCancelSIDeferred = $.Deferred();
        verifyCancelSI(refId, verifyCancelSIDeferred);

        return verifyCancelSIDeferred;
      },
      getUpcomingPaymentsList: function (fromDate, toDate, accountId, url) {
        objectInitializedCheck();
        getUpcomingPaymentsListDeferred = $.Deferred();
        getUpcomingPaymentsList(fromDate, toDate, accountId, url, getUpcomingPaymentsListDeferred);

        return getUpcomingPaymentsListDeferred;
      },
      fetchAccountData: function (taskCode, type) {
        return fetchAccountData(taskCode, type);
      },
      batchRead: function (batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getPayeeMaintenance: function () {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getHostDate: function () {
        objectInitializedCheck();
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      }
    };
  };

  return new ScheduledPaymentsInfoModel();
});