define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AdhocPaymentModel = function() {
    const Model = function() {
        this.adhocPaymentModel = {
          genericPayee: {
            accountNumber: null,
            accountName: null,
            branchCode: null,
            transferMode: "ACC",
            accountType: null,
            network: null,
            bankDetails: {
              name: null,
              branch: null,
              address: null,
              city: null,
              country: null,
              codeType: null,
              code: null
            },
            address: {},
            name: null,
            nickName: null,
            groupId: null,
            sepaType: null,
            ukPaymentType: null
          },
          genericPayout: {
            charges: null,
            otherDetails: {
              line1: null,
              line2 :null,
              line3:null,
              line4 :null
            },
           intermediaryBankDetails: {
                name: null,
                branch: null,
                address: null,
                city: null,
                country: null,
                codeType: null,
                code: null
            },
            intermediaryBankNetwork: null,
            partyId: {
              displayValue: null,
              value: null
            },
            amount: {
              currency: null,
              amount: null
            },
            userReferenceNo: null,
            remarks: null,
            purpose: null,
            purposeText: null,
            debitAccountId: {
              displayValue: null,
              value: null
            },
            accountType: null,
            creditAccountId: null,
            valueDate: null,
            frequency: null,
            startDate: null,
            endDate: null,
            nextExecutionDate: null,
            instances: null,
            externalReferenceNumber: null,
            freqDays: 0,
            freqMonths: 0,
            freqYears: 0
          },
          paymentType: null
        };

        this.networkSuggestionModel = {
            txnAmount: {
                amount: null,
                currency: null
            },
            taskCodes: "PC_F_CGNDP",
            bankCode: null,
            payeeId: null
        };

        this.internationalAccBasedPayeeModel = {
                    address: {
                     line1: null,
                     line2: null,
                     city: null,
                     country: null
               }
        };
      },
      baseService = BaseService.getInstance();
    let region, getNetworkTypesDeferred;
    const getNetworkTypes = function(deferred) {
      const options = {
          url: "enumerations/networkType?REGION={region}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          region: region
        };

      baseService.fetch(options, params);
    };
    let listAccessPointDeferred;
    const listAccessPoint = function(deferred) {
      const options = {
        url: "accessPoints",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getCountriesDeferred;
    const getCountries = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let readPayeeDeferred;
    const readPayee = function(gId, pId, type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        };

      baseService.fetch(options, params);
    };
    let getPayeeListDeferred;
    const getPayeeList = function(deferred) {
      const options = {
        url: "payments/payeeGroup?expand=ALL",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
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
    let getBankDetailsNCCDeferred;
    const getBankDetailsNCC = function(code, region, deferred) {
      const options = {
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          nationalClearingCode: code,
          nationalClearingCodeType: region
        };

      baseService.fetch(options, params);
    };
    let getBankDetailsDCCDeferred;
    const getBankDetailsDCC = function(code, deferred) {
      const options = {
          url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          domesticClearingCodeType: "INDIA",
          domesticClearingCode: code
        };

      baseService.fetch(options, params);
    };
    let getCorrespondenceChargesDeferred;
    const getCorrespondenceCharges = function(deferred) {
      const options = {
        url: "enumerations/correspondanceChargeType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let makeAdhocPaymentDeferred;
    const makeAdhocPayment = function(payload, deferred) {
      const options = {
        url: "payments/generic",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let getBranchesDeferred;
    const getBranches = function(deferred) {
      const options = {
        url: "locations/country/all/city/all/branchCode/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getTransferPurposeDeferred;
    const getTransferPurpose = function(paymentType, deferred) {
      let url;

      if (paymentType === "INTERNAL") {
        url = "purposes/linkages?taskCode=PC_F_INTRNL";
      }

      if (paymentType === "DOMESTIC") {
        url = "purposes/linkages?taskCode=PC_F_DOM";
      }

      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let bancConfigurationDeffered;
    const fetchBankConfiguration = function(deferred) {
      const options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let validateAndFetchCurrencyDeferred;
    const validateAndFetchCurrency = function(accountNumber, deferred) {
      const options = {
        url: "payments/generic/internal/{accountNumber}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        accountNumber: accountNumber
      };

      baseService.fetch(options, params);
    };
    let getHostDateDeferred;
    const getHostDate = function(deferred) {
      const options = {
        url: "payments/currentDate",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let deletePaymentDeferred;
    const deletePayment = function(paymentId, deferred) {
      const options = {
        url: "payments/generic/{paymentId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        paymentId: paymentId
      };

      baseService.remove(options, params);
    };
    let confirmPaymentDeferred;
    const confirmPayment = function(paymentId, paymentType, deferred) {
      const options = {
        url: "payments/generic/{paymentId}?paymentType={paymentType}",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      },
      params = {
        paymentId: paymentId,
        paymentType :paymentType
      };

      baseService.patch(options, params);
    };
    let fireBatchDeferred;
    const batchRead = function(deferred, batchRequest, type) {
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
      init: function(reg) {
        region = reg || undefined;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getNetworkTypes: function() {
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(getNetworkTypesDeferred);

        return getNetworkTypesDeferred;
      },
      getPaymentTypes: function() {
        return baseService.fetch({
          url: "enumerations/paymentType?REGION={region}"
        }, {
          region: region
        });
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);

        return getCountriesDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      },
      getBankDetailsNCC: function(code, region) {
        getBankDetailsNCCDeferred = $.Deferred();
        getBankDetailsNCC(code, region, getBankDetailsNCCDeferred);

        return getBankDetailsNCCDeferred;
      },
      getBankDetailsDCC: function(code) {
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
      },
      getCorrespondenceCharges: function() {
        getCorrespondenceChargesDeferred = $.Deferred();
        getCorrespondenceCharges(getCorrespondenceChargesDeferred);

        return getCorrespondenceChargesDeferred;
      },
      makeAdhocPayment: function(payload) {
        makeAdhocPaymentDeferred = $.Deferred();
        makeAdhocPayment(payload, makeAdhocPaymentDeferred);

        return makeAdhocPaymentDeferred;
      },
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);

        return getBranchesDeferred;
      },
      getTransferPurpose: function(paymentType) {
        getTransferPurposeDeferred = $.Deferred();
        getTransferPurpose(paymentType, getTransferPurposeDeferred);

        return getTransferPurposeDeferred;
      },
      validateAndFetchCurrency: function(accountNumber) {
        validateAndFetchCurrencyDeferred = $.Deferred();
        validateAndFetchCurrency(accountNumber, validateAndFetchCurrencyDeferred);

        return validateAndFetchCurrencyDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      deletePayment: function(paymentId) {
        deletePaymentDeferred = $.Deferred();
        deletePayment(paymentId, deletePaymentDeferred);

        return deletePaymentDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);

        return bancConfigurationDeffered;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);

        return listAccessPointDeferred;
      },
      confirmPayment: function(paymentId, paymentType) {
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, paymentType, confirmPaymentDeferred);

        return confirmPaymentDeferred;
      },
      readPayee: function(gId, pId, type) {
        readPayeeDeferred = $.Deferred();
        readPayee(gId, pId, type, readPayeeDeferred);

        return readPayeeDeferred;
      },
      getPayeeList: function() {
        getPayeeListDeferred = $.Deferred();
        getPayeeList(getPayeeListDeferred);

        return getPayeeListDeferred;
      },
      getMaintenances: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getUpcomingPaymentsList: function(fromDate, toDate, creditAccountId) {
        return baseService.fetch({
          url: "payments/instructions?status=ACTIVE&type=ALL&fromDate={fromDate}&toDate={toDate}&creditAccountId={creditAccountId}"
        }, {
          fromDate: fromDate,
          toDate: toDate,
          creditAccountId: creditAccountId
        });
      },
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getNetworkPreferences: function() {
        return baseService.fetch({
          url: "maintenances/payments/networkPreferences"
        });
      },
      getRemarks: function() {
        return baseService.fetch({
          url: "enumerations/senderToReceiverInfo"
        });
      },
      getSuggestedNetwork : function(model){
        return baseService.add({
          url : "payments/derivingNetworkType",
          data: model
        });
      }
    };
  };

  return new AdhocPaymentModel();
});