define([
  "baseService"
], function (BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewThemeModel = function () {

      return {
        deleteDocument: function (brandId) {
          return baseService.remove({
            url: "brands/{brandId}"
          }, {
            brandId: brandId
          });
        },
        downloadImageAssets: function (brandId) {
          return baseService.downloadFile({
            url: "brands/{brandId}/asset?type=I"
          }, {
            brandId: brandId
          });
        },
        fetchAssets: function (brandId) {
          return baseService.fetch({
            url: "brands/{brandId}/asset?type=S"
          }, {
            brandId: brandId
          });
        },
        uploadDocument: function (themeData, zip) {
          const form = new FormData();

          form.append("brandName", themeData.brandName);
          form.append("brandDescription", themeData.brandDescription);
          form.append("availableForSelection", themeData.availableForSelection);

          form.append("styleAsset", JSON.stringify(themeData.styleAsset, function (_key, value) {
            return value === null || value === undefined ? undefined : value;
          }));

          form.append("imageAsset", zip);

          return baseService.uploadFile({
            url: "brands",
            formData: form
          });
        },
        updateDocument: function (themeData, zip, brandId) {
          const form = new FormData();

          form.append("brandName", themeData.brandName);
          form.append("brandDescription", themeData.brandDescription);
          form.append("availableForSelection", themeData.availableForSelection);

          form.append("styleAsset", JSON.stringify(themeData.styleAsset, function (_key, value) {
            return value === null || value === undefined ? undefined : value;
          }));

          if (zip) {
            form.append("imageAsset", zip);
          }

          return baseService.uploadFile({
            url: "brands/{brandId}",
            formData: form,
            type: "PUT"
          }, {
            brandId: brandId
          });
        }
      };
    };

  return new ReviewThemeModel();
});