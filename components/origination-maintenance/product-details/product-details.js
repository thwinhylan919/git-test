/**
 * New Products  Maintenance.
 *
 * @module origination-maintenance
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} productDetailsModel
 */
define([

  "knockout",
  "./model",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojlistviewdnd",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojswitch",
  "promise"
], function(ko,productDetailsModel) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);

    if (!(self.isBackFromReview() || self.isBack())) {
      productDetailsModel.fetchProducts().then(function(response) {
        for (let i = 0; i < response.productTypes.length; i++) {
          self.products.push({
            description: response.productTypes[i].id,
            value: response.productTypes[i].status === "ACTIVE",
            id: response.productTypes[i].id,
            status: response.productTypes[i].status,
            collateralRequired: response.productTypes[i].collateralRequired,
            productClass: response.productTypes[i].productClass,
            productType: response.productTypes[i].productType,
            sequence: response.productTypes[i].sequence
          });
        }
      });
    }
  };
});
