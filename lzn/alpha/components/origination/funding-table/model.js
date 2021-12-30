define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function FundingTableModel() {
    const Model = function() {
      this.fundingTableInfo = {
        fundingTableDetailDTO: {
          productGroupSerialNo: 1,
          lvrValue: null,
          totalCost: {
            currency: null,
            amount: null
          },
          totalOutlay: {
            currency: null,
            amount: null
          },
          fundingItemDetailDTOs: [{
            fundingItemDetailKeyDTO: {},
            totalAmount: {
              currency: null,
              amount: null
            },
            fundingItemType: null,
            customerFundingItemDTOs: [{
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              }
            }, {
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              }
            }]
          }, {
            fundingItemDetailKeyDTO: {},
            totalAmount: {
              currency: null,
              amount: null
            },
            fundingItemType: null,
            legalFundingItemDTOs: [{
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              },
              keyDTO: {
                fundingItemDetailSerialNo: null,
                fundingItemSerialNo: null
              }
            }]
          }, {
            fundingItemDetailKeyDTO: {},
            totalAmount: {
              currency: null,
              amount: null
            },
            fundingItemType: null
          }, {
            fundingItemDetailKeyDTO: {},
            totalAmount: {
              currency: null,
              amount: null
            },
            fundingItemType: null,
            facilityFundingItemDTOs: [{
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              }
            }]
          }, {
            totalAmount: {
              currency: null,
              amount: null
            },
            fundingItemType: null,
            bankFeeFundingItemDTOs: [{
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              },
              feePurpose: null,
              pdCode: null,
              priceUniqueID: null,
              additionalFundingItemDetailDTO: {
                discountedAmount: {
                  currency: null,
                  amount: null
                },
                amountNegotiable: null,
                amountCapitalized: null,
                capitalizedAmount: {
                  currency: null,
                  amount: null
                }
              }
            }, {
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              },
              feePurpose: null,
              pdCode: null,
              priceUniqueID: null,
              additionalFundingItemDetailDTO: {
                discountedAmount: {
                  currency: null,
                  amount: null
                },
                amountNegotiable: null,
                amountCapitalized: null,
                capitalizedAmount: {
                  currency: null,
                  amount: null
                }
              }
            }, {
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              },
              feePurpose: null,
              pdCode: null,
              priceUniqueID: null,
              additionalFundingItemDetailDTO: {
                discountedAmount: {
                  currency: null,
                  amount: null
                },
                amountNegotiable: null,
                amountCapitalized: null,
                capitalizedAmount: {
                  currency: null,
                  amount: null
                }
              }
            }]
          }, {
            fundingItemDetailKeyDTO: {},
            totalAmount: {
              currency: null,
              amount: null
            },
            fundingItemType: null,
            purchaseFundingItemDTOs: [{
              directionType: null,
              totalFeeType: null,
              totalFeeValue: {
                currency: null,
                amount: null
              }
            }]
          }],
          totalCapitalizedFee: {
            currency: null,
            amount: null
          }
        }
      };

      this.message = "";
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let submissionId,
      fetchFundingTableDeferred;
    const fetchFundingTable = function(deferred) {
      const options = {
        url: "submissions/{submissionId}/fundingTable",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        submissionId: submissionId
      };

      baseService.fetch(options, params);
    };
    let saveFundingTableDeferred;
    const saveFundingTable = function(model, deferred) {
      const options = {
        url: "submissions/{submissionId}/fundingTable",
        data: model,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        submissionId: submissionId
      };

      baseService.update(options, params);
    };
    let validateRequirementDeferred;
    const validateRequirement = function(model, deferred) {
      const params = {
          submissionID: submissionId
        },
        options = {
          url: "submissions/{submissionID}/loanApplications",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };

    return {
      init: function(subId) {
        submissionId = subId || undefined;
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchFundingTable: function() {
        fetchFundingTableDeferred = $.Deferred();
        fetchFundingTable(fetchFundingTableDeferred);

        return fetchFundingTableDeferred;
      },
      saveFundingTable: function(model) {
        saveFundingTableDeferred = $.Deferred();
        saveFundingTable(model, saveFundingTableDeferred);

        return saveFundingTableDeferred;
      },
      validateRequirement: function(model) {
        validateRequirementDeferred = $.Deferred();
        validateRequirement(model, validateRequirementDeferred);

        return validateRequirementDeferred;
      }
    };
  };
});
