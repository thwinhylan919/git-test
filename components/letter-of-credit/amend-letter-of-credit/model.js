define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const AmendLetterOfCreditModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.AmendedLCDetails = {
          id: null,
          lcId: null,
          issueDate: null,
          newExpiryDate: null,
          expiryPlace: null,
          counterPartyName: null,
          versionNo: null,
          paymentDetails: null,
          validBICCode: "false",
          chargesFromBeneficiary: null,
          newAmount: {
            currency: null,
            amount: null
          },
          document: [],
          confirmationInstruction: null,
          requestedConfirmationParty: null,
          confirmingBankCode: null,
          advisingThroughBankCode: null,
          requestedConfirmationPartyDetails: {
            branchAddress: {
              line1: null,
              line2: null,
              line3: null,
              country: null
            },
            name: null
          },
          documentPresentationDays: null,
          partyId: {
            displayValue: null,
            value: null
          },
          availableWith: null,
          counterPartyAddress: {
            line1: null,
            line2: null,
            line3: null,
            country: null,
            zipCode: null
          },
          eventDate: null,
          eventDescription: null,
          amendmentDate: null,
          percCreditAmount: null,
          toleranceType: null,
          toleranceUnder: null,
          toleranceAbove: null,
          additionalAmountCovered: null,
          narrative: null,
          shipmentDetails: {
            date: null,
            description: null,
            destination: null,
            dischargePort: null,
            goodsCode: null,
            id: null,
            loadingPort: null,
            partial: "false",
            period: null,
            source: null,
            transShipment: "false"
          },
          goods: [],
          chargesBorneBy: "",
          transferableType: ""
        };
      };
    let fetchBeneficiaryDetailsDeferred;
    const fetchBeneficiaryDetails = function (beneficiaryId, deferred) {
      const params = {
        beneficiaryId: beneficiaryId
      },
        options = {
          url: "beneficiaries/{beneficiaryId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchBranchDateDeferred;
    const fetchBranchDate = function (code, deferred) {
      const options = {
        url: "branchdate/{branchCode}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          branchCode: code
        };

      baseService.fetch(options, params);
    };
    let fetchBeneNameDeferred;
    const fetchBeneName = function (deferred) {
      const options = {
        url: "beneficiaries",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    let fetchGoodsDeferred;
    const fetchGoods = function (deferred) {
      const options = {
        url: "tradeGoods",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    let fetchBeniCountryDeferred;
    const fetchBeniCountry = function (deferred) {
      const options = {
        url: "enumerations/country",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    let fetchIncotermDeferred;
    const fetchIncoterm = function (deferred) {
      const options = {
        url: "tradeIncoterms",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    let fetchProductDetailsDeferred;
    const fetchProductDetails = function (productId, deferred) {
      const params = {
        productId: productId
      },
        options = {
          url: "products/letterofcredits/{productId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    let getBankDetailsBICDeferred;
    const getBankDetailsBIC = function (code, deferred) {
      const options = {
        url: "financialInstitution/bicCodeDetails/{BICCode}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          BICCode: code
        };

      baseService.fetch(options, params);
    };
    let fetchCreditAvailaibleByTypeDeferred;
    const fetchCreditAvailaibleByType = function (deferred) {
      const options = {
        url: "enumerations/creditAvailableByType",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchConfirmationPartyDeferred;
    const fetchConfirmationParty = function (deferred) {
      const options = {
        url: "enumerations/confirmationParty",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchConfirmationInstructionDeferred;
    const fetchConfirmationInstruction = function (deferred) {
      const options = {
        url: "enumerations/confirmationInstruction",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      fetchBranchDate: function (code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);

        return fetchBranchDateDeferred;
      },
      fetchBeneficiaryDetails: function (beneficiaryId) {
        fetchBeneficiaryDetailsDeferred = $.Deferred();
        fetchBeneficiaryDetails(beneficiaryId, fetchBeneficiaryDetailsDeferred);

        return fetchBeneficiaryDetailsDeferred;
      },
      fetchBeneName: function () {
        fetchBeneNameDeferred = $.Deferred();
        fetchBeneName(fetchBeneNameDeferred);

        return fetchBeneNameDeferred;
      },
      fetchGoods: function () {
        fetchGoodsDeferred = $.Deferred();
        fetchGoods(fetchGoodsDeferred);

        return fetchGoodsDeferred;
      },

      fetchBeniCountry: function () {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);

        return fetchBeniCountryDeferred;
      },
      fetchIncoterm: function () {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(fetchIncotermDeferred);

        return fetchIncotermDeferred;
      },
      fetchProductDetails: function (productId) {
        fetchProductDetailsDeferred = $.Deferred();
        fetchProductDetails(productId, fetchProductDetailsDeferred);

        return fetchProductDetailsDeferred;
      },
      getBankDetailsBIC: function (code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      },
      fetchCreditAvailaibleByTypes: function () {
        fetchCreditAvailaibleByTypeDeferred = $.Deferred();
        fetchCreditAvailaibleByType(fetchCreditAvailaibleByTypeDeferred);

        return fetchCreditAvailaibleByTypeDeferred;
      },
      fetchConfirmationParty: function () {
        fetchConfirmationPartyDeferred = $.Deferred();
        fetchConfirmationParty(fetchConfirmationPartyDeferred);

        return fetchConfirmationPartyDeferred;
      },
      fetchConfirmationInstruction: function () {
        fetchConfirmationInstructionDeferred = $.Deferred();
        fetchConfirmationInstruction(fetchConfirmationInstructionDeferred);

        return fetchConfirmationInstructionDeferred;
      }
    };
  };

  return new AmendLetterOfCreditModel();
});