define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ReviewLimitPackageModel = function () {
    const baseService = BaseService.getInstance();
    let fetchPackageDetailsDeffered;
    const fetchPackageDetails = function (packageId, deffered) {
      const params = {
          packageId: packageId
        },
        options = {
          url: "limitPackages/{packageId}",
          success: function (data) {
            deffered.resolve(data);
          },
          error: function (data) {
            deffered.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let deletePackageDeffered;
    const deletePackage = function (packageId, deffered) {
      const params = {
        packageId: packageId
      },

       options = {
        url: "limitPackages/{packageId}",
        success: function (data, status, jqXhr) {
          deffered.resolve(data, status, jqXhr);
        },
        error: function (data) {
          deffered.reject(data);
        }
      };

      baseService.remove(options, params);
    };
    let createNewPackageDeffered;
    const createNewPackage = function (payload, deffered) {
      const options = {
        url: "limitPackages",
        data: payload,
        success: function (data, status, jqXhr) {
          deffered.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deffered.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let getTransactionNameDeferred;
    const getTransactionName = function (taskId, deferred) {
      const params = {
        taskId: taskId
      },

       options = {
        url: "resourceTasks/{taskId}",
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options, params);
    };
    let getTransactionGroupNameDeffered;
    const getTransactionGroupName = function (taskGroupId, deffered) {
      const params = {
        taskGroupId: taskGroupId
      },

       options = {
        url: "taskGroups/{taskGroupId}",
        success: function (data, status, jqXhr) {
          deffered.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deffered.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchAccessPointDeffered;
    const fetchAccessPoint = function (deffered) {
      const options = {
        url: "accessPoints",
        success: function (data) {
          deffered.resolve(data);
        },
        error: function (data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAccessPointGroupDeffered;
    const fetchAccessPointGroup = function (deffered) {
      const options = {
        url: "accessPointGroups",
        success: function (data) {
          deffered.resolve(data);
        },
        error: function (data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let updatePackageDeffered;
    const updatePackage = function (payload, deffered) {
      const params = {
        id: JSON.parse(payload).key.id
      },

       options = {
        url: "limitPackages/{id}",
        data: payload,
        success: function (data, status, jqXhr) {
          deffered.resolve(data, status, jqXhr);
        },
        error: function (data) {
          deffered.reject(data);
        }
      };

      baseService.update(options, params);
    };

    return {
      fetchPackageDetails: function (packageId) {
        fetchPackageDetailsDeffered = $.Deferred();
        fetchPackageDetails(packageId, fetchPackageDetailsDeffered);

        return fetchPackageDetailsDeffered;
      },
      deletePackage: function (packageId) {
        deletePackageDeffered = $.Deferred();
        deletePackage(packageId, deletePackageDeffered);

        return deletePackageDeffered;
      },
      createNewPackage: function (payload) {
        createNewPackageDeffered = $.Deferred();
        createNewPackage(payload, createNewPackageDeffered);

        return createNewPackageDeffered;
      },
      getTransactionName: function (taskId) {
        getTransactionNameDeferred = $.Deferred();
        getTransactionName(taskId, getTransactionNameDeferred);

        return getTransactionNameDeferred;
      },
      getTransactionGroupName: function (taskGroupId) {
        getTransactionGroupNameDeffered = $.Deferred();
        getTransactionGroupName(taskGroupId, getTransactionGroupNameDeffered);

        return getTransactionGroupNameDeffered;
      },
      fetchAccessPoint: function () {
        fetchAccessPointDeffered = $.Deferred();
        fetchAccessPoint(fetchAccessPointDeffered);

        return fetchAccessPointDeffered;
      },
      fetchAccessPointGroup: function () {
        fetchAccessPointGroupDeffered = $.Deferred();
        fetchAccessPointGroup(fetchAccessPointGroupDeffered);

        return fetchAccessPointGroupDeffered;
      },
      updatePackage: function (payload) {
        updatePackageDeffered = $.Deferred();
        updatePackage(payload, updatePackageDeffered);

        return updatePackageDeffered;
      }
    };
  };

  return new ReviewLimitPackageModel();
});