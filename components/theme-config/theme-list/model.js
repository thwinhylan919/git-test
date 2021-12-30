define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ThemeListModel = function() {
      let Deferred;
      const getModuleThemes = function(role, deferred) {
        const options = {
          url: "brands",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, {
          role: role
        });
      };
      let deleteMappingDeferred;
      const deleteMapping = function(mappedType, mappedValue, deferred) {
          const options = {
            url: "brands/mapping?mappingType={mappingType}&mappingValue={mappingValue}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

          baseService.remove(options, {
            mappingType: mappedType,
            mappingValue: mappedValue
          });
        },
        getTargetLinkageModel = function() {
          let themeObj = {};

          themeObj = {
            brandName: null,
            brandDescription: null,
            role: null,
            json: {
              "header-bg-color": null,
              "header-title-color": null,
              "bg-color": null,
              "form-bg-color": null
            },
            zip: null
          };

          return themeObj;
        };
      let applyThemeDeferred;
      const applyTheme = function(brandId, role, deferred) {
        const options = {
          url: "brands/{brandId}/deploy",
          contentType: "text/plain",
          data: role,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };

        baseService.add(options, {
          brandId: brandId
        });
      };
      let getRolesDeferred;
      const getRoles = function(deferred) {
        const options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let brandMappingsDeferred;
      const brandMapping = function(mappingType, deferred) {
        const options = {
          url: "brands/mapping?mappingType=" + mappingType,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getModuleThemes: function(role) {
          Deferred = $.Deferred();
          getModuleThemes(role, Deferred);

          return Deferred;
        },
        getTargetLinkageModel: function() {
          return new getTargetLinkageModel();
        },
        applyTheme: function(brandId, role) {
          applyThemeDeferred = $.Deferred();
          applyTheme(brandId, role, applyThemeDeferred);

          return applyThemeDeferred;
        },
        getRoles: function() {
          getRolesDeferred = $.Deferred();
          getRoles(getRolesDeferred);

          return getRolesDeferred;
        },
        getMappings: function(mappingType) {
          brandMappingsDeferred = $.Deferred();
          brandMapping(mappingType, brandMappingsDeferred);

          return brandMappingsDeferred;
        },
        deleteMapping: function(mappedType, mappedValue) {
          deleteMappingDeferred = $.Deferred();
          deleteMapping(mappedType, mappedValue, deleteMappingDeferred);

          return deleteMappingDeferred;
        }
      };
    };

  return new ThemeListModel();
});