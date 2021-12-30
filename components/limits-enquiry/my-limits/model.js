define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const MyLimitModel = function() {
    /**
     * BaseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.PeriodicLimitModel = {
          limitName: "",
          limitDescription: "",
          limitType: "",
          currency: "",
          maxAmount: {
            currency: "",
            amount: ""
          },
          maxCount: "",
          periodicity: "",
          owner: {
            type: "",
            value: ""
          }
        };

        this.package = {
          accessPointValue: "",
          accessPointGroupType: "",
          currency: "",
          targetLimitLinkages: [{
            target: {
              id: "",
              value: "",
              type: {
                id: "",
                name: "",
                mandatory: ""
              }
            },
            limits: [{
              limitId: "",
              limitName: "",
              limitDescription: "",
              limitType: "",
              periodicity: "",
              maxCount: "",
              owner: {
                value: "",
                type: ""
              },
              maxAmount: {
                currency: "",
                amount: ""
              }
            }]
          }]
        };
      };
    let getTransactionNameDeferred;
    const getTransactionName = function(deferred) {
      const options = {
        url: "resourceTasks?aspects=limit&view=list",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAssignedLimitPackagesDeferred;
    const fetchAssignedLimitPackages = function(baseUrl,userId, accessPointValue, accessPointGroupType, deferred) {
      const params = {
          accessPointValue: accessPointValue,
          accessPointGroupType: accessPointGroupType,
          userId: userId
        },
        options = {
          url: baseUrl,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchCustomLimitPackagesDeferred;
    const fetchCustomLimitPackages = function(baseUrl,userId,accessPointValue, accessPointGroupType, deferred) {
      const params = {
          accessPointValue: accessPointValue,
          accessPointGroupType: accessPointGroupType,
          userId: userId
        }, options = {
        url: baseUrl,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options,params);
    };
    let fetchUtilizationLimitDeferred;
    const fetchUtilizationLimit = function(baseUrl,userId,entityType, accessPointValue, accessPointGroupType, limitType, deferred) {
      const params = {
          entityType: entityType,
          accessPointValue: accessPointValue,
          accessPointGroupType: accessPointGroupType,
          limitType: limitType,
          userId: userId
        },
        options = {
          url: baseUrl,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
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
    let createCustomLimitPackagesDeferred;
    const createCustomLimitPackages = function(deferred, payload) {
      const options = {
        data: payload,
        url: "me/customLimitPackage",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateUserLimitDeffered;
    const updateUserLimit = function(deferred, payload) {
      const options = {
        data: payload,
        url: "me/customLimitPackage",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };
    let fetchPartyAssignedLimitPackagesDeferred;
    const fetchPartyAssignedLimitPackages = function(deferred) {
      const options = {
        url: "me/party/assignedLimitPackage",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Method to list Transaction Group
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function searchTransactionGroup
     * @param {string} taskAspect- taskAspect for listing Transaction Group
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let searchTransactionGroupDeferred;
    const searchTransactionGroup = function(taskAspect, deferred) {
      const params = {
          taskAspect: taskAspect
        },
        options = {
          url: "taskGroups?taskAspect={taskAspect}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * This function fires a GET request to fetch the access point group details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     * @function getAccessPointGroup
     * @param {string} groupCode- access point group code
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let getAccessPointGroupDeffered;
    const getAccessPointGroup = function(deferred, groupCode) {
      const params = {
          groupCode: groupCode
        },
        options = {
          url: "accessPointGroups/{groupCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      searchTransactionGroup: function(taskAspect) {
        searchTransactionGroupDeferred = $.Deferred();
        searchTransactionGroup(taskAspect, searchTransactionGroupDeferred);

        return searchTransactionGroupDeferred;
      },
      getTransactionName: function() {
        getTransactionNameDeferred = $.Deferred();
        getTransactionName(getTransactionNameDeferred);

        return getTransactionNameDeferred;
      },
      fetchAssignedLimitPackages: function(baseUrl, userId,accessPointValue, accessPointGroupType) {
        fetchAssignedLimitPackagesDeferred = $.Deferred();
        fetchAssignedLimitPackages(baseUrl,userId, accessPointValue, accessPointGroupType, fetchAssignedLimitPackagesDeferred);

        return fetchAssignedLimitPackagesDeferred;
      },
      fetchCustomLimitPackages: function(baseUrl,userId,accessPointValue, accessPointGroupType) {
        fetchCustomLimitPackagesDeferred = $.Deferred();
        fetchCustomLimitPackages(baseUrl,userId,accessPointValue, accessPointGroupType, fetchCustomLimitPackagesDeferred);

        return fetchCustomLimitPackagesDeferred;
      },
      fetchUtilizationLimit: function(baseUrl,userId,entityType, accessPointValue, accessPointGroupType, limitType) {
        fetchUtilizationLimitDeferred = $.Deferred();
        fetchUtilizationLimit(baseUrl,userId,entityType, accessPointValue, accessPointGroupType, limitType, fetchUtilizationLimitDeferred);

        return fetchUtilizationLimitDeferred;
      },
      fetchEffectiveTodayDetails: function() {
        fetchEffectiveTodayDetailsDeffered = $.Deferred();
        fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);

        return fetchEffectiveTodayDetailsDeffered;
      },
      createCustomLimitPackages: function(payload) {
        createCustomLimitPackagesDeferred = $.Deferred();
        createCustomLimitPackages(createCustomLimitPackagesDeferred, payload);

        return createCustomLimitPackagesDeferred;
      },
      updateUserLimit: function(payload) {
        updateUserLimitDeffered = $.Deferred();
        updateUserLimit(updateUserLimitDeffered, payload);

        return updateUserLimitDeffered;
      },
      fetchPartyAssignedLimitPackages: function() {
        fetchPartyAssignedLimitPackagesDeferred = $.Deferred();
        fetchPartyAssignedLimitPackages(fetchPartyAssignedLimitPackagesDeferred);

        return fetchPartyAssignedLimitPackagesDeferred;
      },
      getAccessPointGroup: function(groupCode) {
        getAccessPointGroupDeffered = $.Deferred();
        getAccessPointGroup(getAccessPointGroupDeffered, groupCode);

        return getAccessPointGroupDeffered;
      },
      /**
       * ListAccessPoint - fetches the Access Point List.
       *
       * @returns {Promise}  Returns the promise object.
       */
      listAccessPoint: function() {
        const options = {
          url: "accessPoints"
        };

        return baseService.fetch(options);
      },
      /**
       * ReadTransactionGroup - reads the Transaction group.
       *
       * @param  {string} transactionGroupId - Transaction Group Id for Transaction group.
       * @returns {Promise}  Returns the promise object.
       */
      readTransactionGroup: function(transactionGroupId) {
        const params = {
            taskGroupId: transactionGroupId
          },
          options = {
            url: "taskGroups/{taskGroupId}"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new MyLimitModel();
});
