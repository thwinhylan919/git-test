define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ViewBankGuaranteeModel = function() {
      const Model = function() {
        this.ModifyContractModel = {
          attachedDocuments: [],
          deletedDocuments: [],
          beneName: null,
          contractAmount: {
            currency: null,
            amount: null
          }
        };
      };
      let modifyContractDeferred;
      const modifyContract = function(bankGuaranteeId, model, deferred) {
        const options = {
            url: "bankguarantees/{bankGuaranteeId}/documents",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            bankGuaranteeId: bankGuaranteeId
          };

        baseService.update(options, params);
      };
      let fetchGuranteeTypeDeferred;
      const fetchGuranteeType = function(deferred) {
        const options = {
          url: "bankguarantees/types",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchProductNameDeferred;
      const fetchProductName = function(productId, deferred) {
        const options = {
            url: "products/bankguarantees/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            productId: productId
          };

        baseService.fetch(options, params);
      };
      let fetchBranchDeferred;
      const fetchBranch = function(deferred) {
        const options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchPartyDetailsDeferred;
      const fetchPartyDetails = function(partyID, deferred) {
        const params = {
            partyId: partyID
          },
          options = {
            url: "me/party/relations/{partyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let getAmmendmentsDeferred;
      const getAmendments = function(bankGuaranteeId, deferred) {
        const options = {
            url: "bankguarantees/{bankGuaranteeId}/amendments",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            bankGuaranteeId: bankGuaranteeId
          };

        baseService.fetch(options, params);
      };
      let getAmmendmentDetailsDeferred;
      const getAmendmentDetails = function(bankGuaranteeId, amendmentId, deferred) {
        const options = {
            url: "bankguarantees/{bankGuaranteeId}/amendments/{amendmentId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            bankGuaranteeId: bankGuaranteeId,
            amendmentId: amendmentId
          };

        baseService.fetch(options, params);
      };
      let fetchBeniCountryDeferred;
      const fetchBeniCountry = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getBankDetailsBICDeferred;
      const getBankDetailsBIC = function(code, deferred) {
        const options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            BICCode: code
          };

        baseService.fetch(options, params);
      };
      let getAdviceDetailsDeferred;
      const getAdviceDetails = function(bankGuaranteeId, dcnNo, deferred) {
        const options = {
            url: "bankguarantees/{bankGuaranteeId}/advices/{dcnNo}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            bankGuaranteeId: bankGuaranteeId,
            dcnNo: dcnNo
          };

        baseService.fetch(options, params);
      };
      let getSwiftDetailsDeferred;
      const getSwiftDetails = function(bankGuaranteeId, dcnNo, deferred) {
        const options = {
            url: "bankguarantees/{bankGuaranteeId}/swiftMessages/{dcnNo}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            bankGuaranteeId: bankGuaranteeId,
            dcnNo: dcnNo
          };

        baseService.fetch(options, params);
      };
      let fetchAdvicePDFDeferred;
      const fetchAdvicePDF = function(bankGuaranteeId, dcnNo) {
        const options = {
          url: "bankguarantees/" + bankGuaranteeId + "/advices/" + dcnNo + "?media=application/pdf"
        };

        baseService.downloadFile(options);
      };
      let fetchSwiftPDFDeferred;
      const fetchSwiftPDF = function(bankGuaranteeId, dcnNo) {
        const options = {
          url: "bankguarantees/" + bankGuaranteeId + "/swiftMessages/" + dcnNo + "?media=application/pdf"
        };

        baseService.downloadFile(options);
      };
      let getChargesDetailsDeferred;
      const getChargesDetails = function(bankGuaranteeId, deferred) {
        const params = {
            bankGuaranteeId: bankGuaranteeId
          },
          options = {
            url: "bankguarantees/{bankGuaranteeId}/charges",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        modifyContract: function(bankGuaranteeId, model) {
          modifyContractDeferred = $.Deferred();
          modifyContract(bankGuaranteeId, model, modifyContractDeferred);

          return modifyContractDeferred;
        },
        fetchProductName: function(productId) {
          fetchProductNameDeferred = $.Deferred();
          fetchProductName(productId, fetchProductNameDeferred);

          return fetchProductNameDeferred;
        },
        fetchGuranteeType: function() {
          fetchGuranteeTypeDeferred = $.Deferred();
          fetchGuranteeType(fetchGuranteeTypeDeferred);

          return fetchGuranteeTypeDeferred;
        },
        fetchAdvicePDF: function(bankGuaranteeId, dcnNo) {
          fetchAdvicePDFDeferred = $.Deferred();
          fetchAdvicePDF(bankGuaranteeId, dcnNo, fetchAdvicePDFDeferred);

          return fetchAdvicePDFDeferred;
        },
        fetchSwiftPDF: function(bankGuaranteeId, dcnNo) {
          fetchSwiftPDFDeferred = $.Deferred();
          fetchSwiftPDF(bankGuaranteeId, dcnNo, fetchSwiftPDFDeferred);

          return fetchSwiftPDFDeferred;
        },
        fetchBranch: function() {
          fetchBranchDeferred = $.Deferred();
          fetchBranch(fetchBranchDeferred);

          return fetchBranchDeferred;
        },
        getAdviceDetails: function(bankGuaranteeId, dcnNo) {
          getAdviceDetailsDeferred = $.Deferred();
          getAdviceDetails(bankGuaranteeId, dcnNo, getAdviceDetailsDeferred);

          return getAdviceDetailsDeferred;
        },
        getSwiftDetails: function(bankGuaranteeId, dcnNo) {
          getSwiftDetailsDeferred = $.Deferred();
          getSwiftDetails(bankGuaranteeId, dcnNo, getSwiftDetailsDeferred);

          return getSwiftDetailsDeferred;
        },
        fetchPartyDetails: function(partyID) {
          fetchPartyDetailsDeferred = $.Deferred();
          fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

          return fetchPartyDetailsDeferred;
        },
        getChargesDetails: function(bankGuaranteeId) {
          getChargesDetailsDeferred = $.Deferred();
          getChargesDetails(bankGuaranteeId, getChargesDetailsDeferred);

          return getChargesDetailsDeferred;
        },
        fetchBeniCountry: function() {
          fetchBeniCountryDeferred = $.Deferred();
          fetchBeniCountry(fetchBeniCountryDeferred);

          return fetchBeniCountryDeferred;
        },
        getBankDetailsBIC: function(code) {
          getBankDetailsBICDeferred = $.Deferred();
          getBankDetailsBIC(code, getBankDetailsBICDeferred);

          return getBankDetailsBICDeferred;
        },
        getAmendments: function(bankGuaranteeId) {
          getAmmendmentsDeferred = $.Deferred();
          getAmendments(bankGuaranteeId, getAmmendmentsDeferred);

          return getAmmendmentsDeferred;
        },
        getAmendmentDetails: function(bankGuaranteeId, amendmentId) {
          getAmmendmentDetailsDeferred = $.Deferred();
          getAmendmentDetails(bankGuaranteeId, amendmentId, getAmmendmentDetailsDeferred);

          return getAmmendmentDetailsDeferred;
        }
      };
    };

  return new ViewBankGuaranteeModel();
});