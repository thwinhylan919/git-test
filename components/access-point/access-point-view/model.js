define(["baseService", "jquery"], function (BaseService, $) {
  "use strict";

  const AccessPointViewModel = function () {
    const baseService = BaseService.getInstance();
    let createAccessPointDeferred;
    const createAccessPoint = function (deferred, payload) {
      const options = {
        data: payload,
        url: "accessPoints",
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateAccessPointDeferred;
    const updateAccessPoint = function (deferred, payload, accessPoint) {
      const params = {
          accessPoint: accessPoint
        },
        options = {
          data: payload,
          url: "accessPoints/{accessPoint}",
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
    };
    let fetchAccessPointTypeDeferred;
    const fetchAccessPointType = function (deferred) {
      const options = {
        url: "enumerations/accessPointType",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchScopeDeferred;
    const fetchScope = function (deferred) {
      const options = {
        url: "accessPointScopes",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      createAccessPoint: function (payload) {
        createAccessPointDeferred = $.Deferred();
        createAccessPoint(createAccessPointDeferred, payload);

        return createAccessPointDeferred;
      },
      updateAccessPoint: function (payload, accessPoint) {
        updateAccessPointDeferred = $.Deferred();
        updateAccessPoint(updateAccessPointDeferred, payload, accessPoint);

        return updateAccessPointDeferred;
      },
      fetchAccessPointType: function () {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);

        return fetchAccessPointTypeDeferred;
      },
      fetchScope: function () {
        fetchScopeDeferred = $.Deferred();
        fetchScope(fetchScopeDeferred);

        return fetchScopeDeferred;
      },
      readImage: function (contentId) {
        return baseService.fetch({
          url: "contents/{contentId}"
        }, {
          contentId: contentId
        });
      }
    };
  };

  return new AccessPointViewModel();
});