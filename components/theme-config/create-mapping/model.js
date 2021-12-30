define(["jquery", "baseService"], function ($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    CreateMappingModel = function () {
      return {
        getTargetLinkageModel: function (brandId, mappedValue, mappedType) {
          return {
            brandId: brandId || null,
            mappedValue: mappedValue || null,
            mappedType: mappedType || null
          };
        },
        createMapping: function (payload) {
          const deferred = $.Deferred();

          baseService.add({
            url: "brands/mapping",
            data: payload,
            success: function (data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          });

          return deferred;
        },
        getEnterpriseRoles: function () {
          return baseService.fetch({
            url: "enterpriseRoles?isLocal=true"
          });
        },
        getSegmentEnterpriseRoles: function (role) {
          return baseService.fetch({
            url: "segments?enterpriseRole={role}"
          }, {
            role: role
          });
        },
        checkUserExists: function (userName, validationError) {
          return baseService.fetch({
            url: "users/{userName}",
            showMessage: false,
            validationError: validationError
          }, {
            userName: userName
          });
        },
        getModuleThemes : function() {
          return baseService.fetch({url: "brands"});
        }
      };
    };

  return new CreateMappingModel();
});