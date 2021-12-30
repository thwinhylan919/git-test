define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ManageGoalCategory = function ManageGoalCategory() {
    const baseService = BaseService.getInstance();
    let id, modelInitialized = true;
    const Model = function() {
      this.goalAccountUpdateModel = {
        name: "",
        contentId: {
          value: ""
        },
        targetAmount: {
          amount: "",
          currency: ""
        },
        payoutDetails: {
          mode: ""
        }
      };

      this.withdrawAmountPayloadModel = {
        id: "",
            partyId: "",
            categoryId: "",
            contentId: {
              value: ""
            },
            availableBalance: {
              amount: "",
              currency: ""
            },
            account: {
              value: "",
              displayValue: ""
            },
            name: "",
            targetAmount: {
              amount: "",
              currency: ""
            },
            initialDepositAmount: {
              amount: "",
              currency: ""
            },
            initialDepositAccount: {
              value: "",
              displayValue: ""
            },
            tenure: {
              year: 0,
              month: 0,
              day: 0,
              date: ""
            },
            payoutDetails: {
              mode: null,
              typeRedemption : null,
              accountId : null,
              networkType : null,
              branch : null,
              accountName : null,
              bankCode : null,
              selfAccountId :{
                value: null,
                displayValue: null
              },
              amount: {
                amount: "",
                currency: ""
              }
            }
      };

      this.goalAccountTopupModel = {
        payinDetails: {
          contributionAmount: {
            currency: "",
            amount: ""
          },
          frequency: "Monthly",
          debitAccount: {
            value: "",
            displayValue: ""
          },
          startDate: "",
          endDate: ""
        }
      };

      this.goalAccountSIModel = {
        id: null,
        account: {
          displayValue: "",
          value: ""
        },
        partyId: "",
        payinDetails: {
          contributionAmount: {
            amount: null,
            currency: null
          },
          frequency: null,
          debitAccount: {
            value: null,
            displayValue: null
          },
          startDate: null,
          endDate: null
        }
      };
    };
    let updateGoalDeferred;
    const updateGoal = function(deferred, data) {
      const options = {
          url: "goals/{id}",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.update(options, params);
    };
    let reedemGoalDeferred;
    const reedemGoal = function(deferred, payload) {
      const options = {
          url: "goals/{id}/withdrawals",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.add(options, params);
    };
    let readGoalAccountDetailsDeferred;
    const readGoalAccountDetails = function(deferred) {
      const options = {
          url: "goals/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(options, params);
    };
    /*getTransactionListDeferred, getTransactionList = function(deferred,goalId) {
        let options = {
            url:'goals/{goalId}/transactions?fromDate=2014-01-03&toDate=2017-02-03',
            success: function(data) {
                deferred.resolve(data);
            },
            error: function(data) {
                deferred.reject(data);
            }
        },params={
            'goalId':goalId,
            'fromDate':fromDate,
            'toDate':toDate
        };
        baseService.fetch(options,params);
    },*/
    let getTransactionListDeferred;
    const getTransactionList = function(deferred, goalId) {
      const options = {
          url: "goals/{goalId}/transactions",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          goalId: goalId
        };

      baseService.fetch(options, params);
    };
    let getNetworkTypesDeferred;
    const getNetworkTypes = function(region, deferred) {
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
    let stopStandingInstructionDeferred;
    const stopStandingInstruction = function(deferred) {
      const options = {
          url: "goals/{id}/instruction",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.remove(options, params);
    };
    let startStandingInstructionDeferred;
    const startStandingInstruction = function(data, deferred) {
      const options = {
          url: "goals/{id}/instruction",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.add(options, params);
    };
    let topUpGoalDeferred;
    const topUpGoal = function(data, deferred) {
      const options = {
          url: "goals/{id}/funding",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.add(options, params);
    };
    let getBankDetailsDCCDeferred;
    const getBankDetailsDCC = function(code, network, deferred) {
      const options = {
          url: "financialInstitution/domesticClearingDetails?financialInstitutionCodeSearchType=S&financialInstitutionCode={code}&network={network}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          code: code,
          network: network
        };

      baseService.fetch(options, params);
    };
    let readCategoryDeferred;
    const readCategory = function(categoryId, deferred) {
      const options = {
          url: "goals/categories/{categoryId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          categoryId: categoryId
        };

      baseService.fetch(options, params);
    };
    let readProductDeferred;
    const readProduct = function(productId, deferred) {
      const options = {
          url: "goals/products/{productId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productId: productId
        };

      baseService.fetch(options, params);
    };
    let fetchBankConfigDeferred;
    const fetchBankConfig = function(deferred) {
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
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };
    let deleteImageDeffered;
    const deleteImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.remove(options, params);
    };
    let hostDateDeferred;
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
    let fetchMaxSizeDeffered;
    const fetchMaxSize = function(deferred) {
      const options = {
        url: "configurations/base/DocumentConfig/properties/DOCUMENT_SIZE",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      init: function(goalAccountId) {
        modelInitialized = true;
        id = goalAccountId;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readGoalAccountDetails: function() {
        readGoalAccountDetailsDeferred = $.Deferred();
        readGoalAccountDetails(readGoalAccountDetailsDeferred);

        return readGoalAccountDetailsDeferred;
      },
      updateGoal: function(updatepayload) {
        updateGoalDeferred = $.Deferred();
        updateGoal(updateGoalDeferred, updatepayload);

        return updateGoalDeferred;
      },
      reedemGoal: function(reedempayload) {
        reedemGoalDeferred = $.Deferred();
        reedemGoal(reedemGoalDeferred, reedempayload);

        return reedemGoalDeferred;
      },
      /*getTransactionList: function(goalId,fromDate,toDate) {
          getTransactionListDeferred = $.Deferred();
          getTransactionList(getTransactionListDeferred,goalId,fromDate,toDate);
          return getTransactionListDeferred;
      },*/
      getTransactionList: function(goalId) {
        getTransactionListDeferred = $.Deferred();
        getTransactionList(getTransactionListDeferred, goalId);

        return getTransactionListDeferred;
      },
      getNetworkTypes: function(region) {
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(region, getNetworkTypesDeferred);

        return getNetworkTypesDeferred;
      },
      stopStandingInstruction: function() {
        stopStandingInstructionDeferred = $.Deferred();
        stopStandingInstruction(stopStandingInstructionDeferred);

        return stopStandingInstructionDeferred;
      },
      startStandingInstruction: function(SIPayload) {
        startStandingInstructionDeferred = $.Deferred();
        startStandingInstruction(SIPayload, startStandingInstructionDeferred);

        return startStandingInstructionDeferred;
      },
      topUpGoal: function(topUpPayload) {
        topUpGoalDeferred = $.Deferred();
        topUpGoal(topUpPayload, topUpGoalDeferred);

        return topUpGoalDeferred;
      },
      getBankDetailsDCC: function(code, network) {
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, network, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
      },
      readCategory: function(categoryId) {
        readCategoryDeferred = $.Deferred();
        readCategory(categoryId, readCategoryDeferred);

        return readCategoryDeferred;
      },
      readProduct: function(productId) {
        readProductDeferred = $.Deferred();
        readProduct(productId, readProductDeferred);

        return readProductDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);

        return deleteImageDeffered;
      },
      fetchBankConfig: function() {
        fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);

        return fetchBankConfigDeferred;
      },
      fetchMaxSize: function() {
        fetchMaxSizeDeffered = $.Deferred();
        fetchMaxSize(fetchMaxSizeDeffered);

        return fetchMaxSizeDeffered;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);

        return hostDateDeferred;
      }
    };
  };

  return new ManageGoalCategory();
});