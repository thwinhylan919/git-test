define([
  "jquery",
  "baseService"
],
  function ($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
      UserProfileMaintenanceModel = function () {

        let fetchContactTypeDeferred;
        const fetchContactType = function (deferred) {
          const options = {
            url: "enumerations/contactPoint",
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          };

          baseService.fetch(options);
        };
        let fetchIdentificationTypeDeferred;
        const fetchIdentificationType = function (deferred) {
          const options = {
            url: "enumerations/identificationType",
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
          fetchContactType: function () {
            fetchContactTypeDeferred = $.Deferred();
            fetchContactType(fetchContactTypeDeferred);

            return fetchContactTypeDeferred;
          },
          fetchIdentificationType: function () {
            fetchIdentificationTypeDeferred = $.Deferred();
            fetchIdentificationType(fetchIdentificationTypeDeferred);

            return fetchIdentificationTypeDeferred;
          }
        };
      };

    return UserProfileMaintenanceModel();
  });
