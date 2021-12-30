define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ViewLCDetailsModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.ModifyContractModel = {
          attachedDocuments: [],
          deletedDocuments: [],
          counterPartyName: null,
          amount: {
            currency: null,
            amount: null
          }
        };
      };
    let modifyContractDeferred;
    const modifyContract = function (letterOfCreditId, model, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/documents",
        data: model,
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId
        };

      baseService.update(options, params);
    };
    let getLCBillsDeferred;
    const getLCBills = function (letterOfCreditId, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/bills",
        success: function (data) {
          deferred.resolve(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId
        };

      baseService.fetch(options, params);
    };
    let getGuaranteesDeferred;
    const getGuarantees = function (letterOfCreditId, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/guarentees",
        success: function (data) {
          deferred.resolve(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId
        };

      baseService.fetch(options, params);
    };
    let fetchPartyDetailsDeferred;
    const fetchPartyDetails = function (partyID, deferred) {
      const params = {
        partyId: partyID
      },
        options = {
          url: "me/party/relations/{partyId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchProductDeferred;
    const fetchProduct = function (productID, deferred) {
      const params = {
        productId: productID
      },
        options = {
          url: "products/letterofcredits/{productId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchIncotermDeferred;
    const fetchIncoterm = function (code, deferred) {
      const options = {
        url: "letterofcredits/incoterms?code=" + code,
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
    let fetchBranchDeferred;
    const fetchBranch = function (deferred) {
      const options = {
        url: "locations/country/all/city/all/branchCode/",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getAccountDetailDeferred;
    const getAccountDetail = function (accountId, deferred) {
      const params = {
        accountId: accountId
      },
        options = {
          url: "accounts/demandDeposit/{accountId}",
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
    let getAmmendmentsDeferred;
    const getAmendments = function (letterOfCreditId, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/amendments",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId
        };

      baseService.fetch(options, params);
    };
    let getAmmendmentDetailsDeferred;
    const getAmendmentDetails = function (letterOfCreditId, amendmentId, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/amendments/{amendmentId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId,
          amendmentId: amendmentId
        };

      baseService.fetch(options, params);
    };
    let getImportLCDeferred;
    const getImportLC = function (letterOfCreditId, versionNo, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}?versionNo=" + versionNo,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId
        };

      baseService.fetch(options, params);
    };
    let getAdviceDetailsDeferred;
    const getAdviceDetails = function (letterOfCreditId, adviceId, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/advices/{adviceId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId,
          adviceId: adviceId
        };

      baseService.fetch(options, params);
    };
    let getSwiftDetailsDeferred;
    const getSwiftDetails = function (letterOfCreditId, swiftId, deferred) {
      const options = {
        url: "letterofcredits/{letterOfCreditId}/swiftMessages/{swiftId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          letterOfCreditId: letterOfCreditId,
          swiftId: swiftId
        };

      baseService.fetch(options, params);
    };
    let getChargesDetailsDeferred;
    const getChargesDetails = function (letterOfCreditId, deferred) {
      const params = {
        letterOfCreditId: letterOfCreditId
      },
        options = {
          url: "letterofcredits/{letterOfCreditId}/charges",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchAdvicePDFDeferred;
    const fetchAdvicePDF = function (letterOfCreditId, adviceId) {
      const options = {
        url: "letterofcredits/" + letterOfCreditId + "/advices/" + adviceId + "?media=application/pdf"
      };

      baseService.downloadFile(options);
    };
    let fetchSwiftPDFDeferred;
    const fetchSwiftPDF = function (letterOfCreditId, swiftId) {
      const options = {
        url: "letterofcredits/" + letterOfCreditId + "/swiftMessages/" + swiftId + "?media=application/pdf"
      };

      baseService.downloadFile(options);
    };
    let getBillDetailsDeferred;
    const getBillDetails = function (billNo, deferred) {
      const params = {
        billReferenceNo: billNo
      },
        options = {
          url: "bills/{billReferenceNo}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
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
      modifyContract: function (letterOfCreditId, model) {
        modifyContractDeferred = $.Deferred();
        modifyContract(letterOfCreditId, model, modifyContractDeferred);

        return modifyContractDeferred;
      },
      fetchPartyDetails: function (partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

        return fetchPartyDetailsDeferred;
      },
      fetchAdvicePDF: function (letterOfCreditId, adviceId) {
        fetchAdvicePDFDeferred = $.Deferred();
        fetchAdvicePDF(letterOfCreditId, adviceId, fetchAdvicePDFDeferred);

        return fetchAdvicePDFDeferred;
      },
      fetchSwiftPDF: function (letterOfCreditId, swiftId) {
        fetchSwiftPDFDeferred = $.Deferred();
        fetchSwiftPDF(letterOfCreditId, swiftId, fetchSwiftPDFDeferred);

        return fetchSwiftPDFDeferred;
      },
      getImportLC: function (letterOfCreditId, versionNo) {
        getImportLCDeferred = $.Deferred();
        getImportLC(letterOfCreditId, versionNo, getImportLCDeferred);

        return getImportLCDeferred;
      },
      fetchProduct: function (productID) {
        fetchProductDeferred = $.Deferred();
        fetchProduct(productID, fetchProductDeferred);

        return fetchProductDeferred;
      },
      fetchIncoterm: function (code) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(code, fetchIncotermDeferred);

        return fetchIncotermDeferred;
      },
      fetchBeniCountry: function () {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);

        return fetchBeniCountryDeferred;
      },
      fetchBranch: function () {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);

        return fetchBranchDeferred;
      },
      getAccountDetail: function (accountId) {
        getAccountDetailDeferred = $.Deferred();
        getAccountDetail(accountId, getAccountDetailDeferred);

        return getAccountDetailDeferred;
      },
      getBankDetailsBIC: function (code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      },
      getAmendments: function (letterOfCreditId) {
        getAmmendmentsDeferred = $.Deferred();
        getAmendments(letterOfCreditId, getAmmendmentsDeferred);

        return getAmmendmentsDeferred;
      },
      getAmendmentDetails: function (letterOfCreditId, amendmentId) {
        getAmmendmentDetailsDeferred = $.Deferred();
        getAmendmentDetails(letterOfCreditId, amendmentId, getAmmendmentDetailsDeferred);

        return getAmmendmentDetailsDeferred;
      },
      getAdviceDetails: function (letterOfCreditId, adviceId) {
        getAdviceDetailsDeferred = $.Deferred();
        getAdviceDetails(letterOfCreditId, adviceId, getAdviceDetailsDeferred);

        return getAdviceDetailsDeferred;
      },
      getSwiftDetails: function (letterOfCreditId, swiftId) {
        getSwiftDetailsDeferred = $.Deferred();
        getSwiftDetails(letterOfCreditId, swiftId, getSwiftDetailsDeferred);

        return getSwiftDetailsDeferred;
      },
      getLCBills: function (letterOfCreditId) {
        getLCBillsDeferred = $.Deferred();
        getLCBills(letterOfCreditId, getLCBillsDeferred);

        return getLCBillsDeferred;
      },
      getBillDetails: function (billNo) {
        getBillDetailsDeferred = $.Deferred();
        getBillDetails(billNo, getBillDetailsDeferred);

        return getBillDetailsDeferred;
      },
      getGuarantees: function (letterOfCreditId) {
        getGuaranteesDeferred = $.Deferred();
        getGuarantees(letterOfCreditId, getGuaranteesDeferred);

        return getGuaranteesDeferred;
      },
      getChargesDetails: function (letterOfCreditId) {
        getChargesDetailsDeferred = $.Deferred();
        getChargesDetails(letterOfCreditId, getChargesDetailsDeferred);

        return getChargesDetailsDeferred;
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

  return new ViewLCDetailsModel();
});
