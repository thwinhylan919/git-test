define([
  "baseService"
], function(BaseService) {
  "use strict";

  const openTdModel = function() {
    const self = this;

    self.transactionId = null;
    self.transactionVersionId = null;

    const Model = function(transactionId, transactionVersionId) {
        return {
          transactionId: transactionId,
          transactionVersionId: transactionVersionId,
          createTDData: {
            partyName: null,
            module: null,
            partyId: null,
            holdingPattern: "SINGLE",
            productDTO: {
              productId: null,
              name: null,
              depositProductModule: "TD"
            },
            parties: [],
            maturityAmount: {
              currency: null,
              amount: null
            },
            maturityDate: null,
            interestRate: null,
            principalAmount: {
              currency: null,
              amount: null
            },
            tenure: {
              days: null,
              months: null,
              years: null
            },
            payoutInstructions: [{
              accountId: {
                displayValue: null,
                value: null
              },
              account: null,
              branchId: null,
              percentage: 100,
              type: null,
              beneficiaryName: null,
              bankName: null,
              address: {
                line1: null,
                line2: null,
                city: null,
                country: null
              },
              networkType: null,
              clearingCode: null,
              payoutComponentType: null,
              internationalTransaction: false
            }],
            payInInstruction: [{
              accountId: {
                displayValue: "",
                value: ""
              },
              branchId: null,
              percentage: 100
            }],
            rollOverType: null,
            rollOverAmount: {
              currency: null,
              amount: null
            },
            nomineeDTO: null
          },
          addNomineeModel: {
            accountId: {
              displayValue: null,
              value: null
            },
            accountType: null,
            accountModule: null,
            dateOfBirth: null,
            name: null,
            relation: null,
            minor: false,
            address: {
              country: null,
              state: null,
              city: null,
              zipCode: null,
              line1: null,
              line2: null
            }
          }
        };
      },
      baseService = BaseService.getInstance();

   return {
      getDepositType: function() {
        const options = {
          url: "products/deposit?productModule=TD"
        };

        return baseService.fetch(options);
      },
      openTd: function(data, isSimulated) {
        const options = {
          url: "accounts/deposit",
          data: data
        };

        options.headers = {};

        if (isSimulated) {
          options.headers["X-Validate-Only"] = "Y";
        }

        if (self.transactionId) {
          options.headers["X-Transaction-ID"] = self.transactionId + "#" + self.transactionVersionId;
        }

        return baseService.add(options);
      },
      fetchMaturityInstruction: function() {
        const options = {
          url: "enumerations/rollOverType"
        };

        return baseService.fetch(options);
      },
      calculateMaturityAmount: function(createTDData) {
        const options = {
          url: "accounts/deposit/maturityAmount",
          data: createTDData
        };

        return baseService.add(options);
      },
      fetchPartyDetails: function() {
        const options = {
          url: "me/party"
        };

        return baseService.fetch(options);
      },
      fetchExchangeRate: function(payload) {
        const options = {
          url: "calculators/foreignExchange",
          data: payload
        };

        return baseService.add(options);
      },
      getNewModel: function(transactionId, transactionVersionId) {
        return new Model(transactionId, transactionVersionId);
      },
      fetchLinkedPartyDetails: function() {
        const options = {
          url: "me/party/relations"
        };

        return baseService.fetch(options);
      },
      /**
       * Public function to create nominee at the time of td creation.
       *
       * @param {Object} payload - Payload to be passed to create TD.
       * @returns {Promise}  Returns the promise object.
       */
      confirmAddNominee: function(payload) {
        const options = {
          url: "nominee",
          data: payload
        };

        return baseService.add(options);
      },
      /**
       * ReadInterestRate - function to fetch interest Rates for given productId.
       *
       * @param  {type} productId - ProductId to be passed to TD.
       * @param  {type} moduleType - Description.
       * @return {type}           Description.
       */
      readInterestRate: function(productId, moduleType) {
        const params = {
          productId: productId,
          moduleType: moduleType
        },
        options = {
          url: "products/deposit/{productId}/interestRates?accountModule={moduleType}"
        };

        return baseService.fetch(options, params);
      },
      /**
       * Fetches currentDate.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getHostDate: function() {
        return baseService.fetch({
          url: "payments/currentDate"
        });
      }
    };
  };

  return new openTdModel();
});
