define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MultiplePaymentsModel = function() {
    const Model = function() {
        this.autoPopulationData = {
          paymentType: null,
          purpose: null,
          otherPurposeValue: null,
          charges: null,
          region: null,
          network: null,
          domesticNetworkTypes: [],
          isNetworkTypesLoaded: false,
          otherDetails: null,
          oinNumber: null,
          oinDescription: null,
          instances: null,
          isEndDateRequired: true,
          transferMode: null,
          otherPurpose: false,
          urlAttribute1: null,
          urlAttribute2: null,
          peerToPeerModel: null,
          frequency: null,
          valuedate: null,
          selectedPayee: null,
          groupId: null,
          customTransferComponent: null,
          transferAmount: null,
          transferCurrency: null,
          srcAccount: null,
          note: null,
          noteInternational:null,
          internationalNote:null,
          siEnd: null,
          transferOn: null,
          transferLater: false,
          siEndDate: null,
          siStartDate: null,
          customPayeeId: null,
          domesticPayeeType: null,
          customCurrencyURL: null,
          adhoc: false,
          transferTo: null,
          payeeDetails: null,
          overviewDetails: null,
          showPaymentOverview: false,
          txnFailed: false,
          failureReason: null,
          dealId: null,
          currentExchangeRate: null,
          customPayeeName: null,
          dealDetails: false,
          dealsAvailable: false,
          usePreBookedDeal: [],
          showList: false,
          nonSuggestedNetworkSelected: false,
          domesticNetworkTypesObj:{},
          networkTransferViaCode: null,
          networkTransferVia: "SWI",
          additionalNetworkTransferViaBankDetails: null,
          paymentDetailsArray: [],
          remarksArray:[],
          remarkLoaded:false,
          networkTransferViaFlag: "NO",
          networkTransferViaBankName: null,
          networkTransferViaBankAddress: null,
          networkTransferViaCountry: [],
          networkTransferViaCity: null
        };
      },
      baseService = BaseService.getInstance();
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      }
    };
  };

  return new MultiplePaymentsModel();
});