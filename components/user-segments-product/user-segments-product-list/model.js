define([
  "baseService"
], function(BaseService) {
  "use strict";

  const UserSegmentListModel = function() {
    const baseService = BaseService.getInstance();

    return {
      enterpriseRolesList: function() {
        const options = {
          url: "enterpriseRoles?isLocal=true"
        };

        return baseService.fetch(options);
      },

      fetchAllMappedProducts: function(productModule, productType,enterpriseRole,entityType) {
        const options = {
          url: "productMaintenances?productModule={productModule}&productType={productType}&entityValue={entityValue}&entityType={entityType}"
        },
        params ={
          productType:productType,
          productModule:productModule,
          entityType:entityType,
          entityValue:enterpriseRole
        };

        return baseService.fetch(options,params);
      },
      fetchSegments: function(userType) {
        const options = {
          url: "segments?enterpriseRole={userType}",
          headers: {
            "x-noncecount": 25
          }
        },
        params={
          userType: userType
        };

        return baseService.fetch(options,params);
      },
      fetchProductTypes: function() {
        const options = {
          url: "enumerations/depositProductType"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new UserSegmentListModel();
});
