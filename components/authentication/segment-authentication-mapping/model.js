define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const SegmentAuthenticationMapingModel = function () {
    const baseService = BaseService.getInstance();
    let listUserSegmentsDeferred;
    const listUserSegments = function (deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listUserSegmentsForRoleDeferred;
    const listUserSegmentsForRole = function (segmentSelected, deferred) {
      const params = {
          segmentSelected: segmentSelected
        },
        options = {
          url: "segments?enterpriseRole={segmentSelected}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      listUserSegments: function () {
        listUserSegmentsDeferred = $.Deferred();
        listUserSegments(listUserSegmentsDeferred);

        return listUserSegmentsDeferred;
      },
      listUserSegmentsForRole: function (segmentSelected) {
        listUserSegmentsForRoleDeferred = $.Deferred();
        listUserSegmentsForRole(segmentSelected, listUserSegmentsForRoleDeferred);

        return listUserSegmentsForRoleDeferred;
      }
    };
  };

  return new SegmentAuthenticationMapingModel();
});