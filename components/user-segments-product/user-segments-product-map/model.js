define([
  "baseService"
], function(BaseService) {
  "use strict";

  const UserSegmentProductMapModel = function() {
    const Model = function() {
      this.UserSegmentModel = {
      };
    },
    baseService = BaseService.getInstance();

    return {
      getNewModel: function() {
        return new Model();
      },
      addProductMapping: function(payload) {
        const options = {
          url: "productMaintenances",
          data: payload
        };

        return baseService.add(options);
      },
      productList: function(productModule, productType) {
        const options = {
          url: "products/deposit?productModule={productModule}&depositProductType={productType}"
        },
        params = {
          productModule: productModule,
          productType: productType
        };

        return baseService.fetch(options, params);
      },
      fetchMappedProducts: function(maintenanceId) {
        const params={
          maintenanceId:maintenanceId
        },
        options = {
          url: "productMaintenances/{maintenanceId}"
        };

        return baseService.fetch(options, params);
      },
      updateProductMapping: function(payload, maintenanceId) {
        const options = {
          url: "productMaintenances/{maintenanceId}",
          data: payload
        },
        params={
          maintenanceId:maintenanceId
        };

        return baseService.update(options,params);
      },
      fetchSegmentDetails: function(segmentId) {
        const params ={
          code: segmentId
        },
        options = {
          url: "segments/{code}"
        };

        return baseService.fetch(options, params);
      },
      fetchProductTypes: function() {
        const options = {
          url: "enumerations/depositProductType"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new UserSegmentProductMapModel();
});
