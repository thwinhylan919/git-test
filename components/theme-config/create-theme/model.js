define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    CreateThemeModel = function() {
      return {
        getTargetLinkageModel: function(styleData) {
          return {
            brandName: null,
            brandDescription: null,
            availableForSelection: null,
            styleAsset: styleData ? styleData.colors : null
          };
        },
        uploadDocument: function(themeData, zip) {
          const form = new FormData(),
            uploadDeferred = $.Deferred();

          form.append("brandName", themeData.brandName);
          form.append("brandDescription", themeData.brandDescription);

          form.append("styleAsset", JSON.stringify(themeData.styleAsset, function(_key, value) {
            return value === null || value === undefined ? undefined : value;
          }));

          form.append("imageAsset", zip);

          baseService.uploadFile({
            url: "brands",
            formData: form,
            success: function(data, status, jqXHR) {
              uploadDeferred.resolve(data, status, jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
              uploadDeferred.reject(jqXHR, textStatus, errorThrown);
            }
          });

          return uploadDeferred;
        },
        updateDocument: function(themeData, zip, brandId) {
          const form = new FormData(),
            updateDeferred = $.Deferred();

          form.append("brandName", themeData.brandName);
          form.append("brandDescription", themeData.brandDescription);

          form.append("styleAsset", JSON.stringify(themeData.styleAsset, function(_key, value) {
            return value === null || value === undefined ? undefined : value;
          }));

          if (zip) {
            form.append("imageAsset", zip);
          }

          baseService.uploadFile({
            url: "brands/{brandId}",
            formData: form,
            type: "PUT",
            success: function(data, status, jqXHR) {
              updateDeferred.resolve(data, status, jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
              updateDeferred.reject(jqXHR, textStatus, errorThrown);
            }
          }, {
            brandId: brandId
          });

          return updateDeferred;
        }
      };
    };

  return new CreateThemeModel();
});