define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MoneyTransferModel = function() {
    const Model = function() {
        this.internalPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          status: null,
          payeeId: null,
          dealId: null
        };

        this.P2PPaymentModel = {
          amount: {
            currency: "",
            amount: ""
          },
          transferMode: "",
          transferValue: "",
          remarks: "",
          payeeId: null,
          purpose: "",
          debitAccountId: {
            displayValue: null,
            value: ""
          }
        };

        this.networkSuggestionModel = {
            txnAmount: {
                amount: null,
                currency: null
            },
            taskCodes: "PC_F_CDFT",
            bankCode: null,
            payeeId: null
        };

        this.internalPayLaterModel = {
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          statusType: null,
          payeeId: null,
          dealId: null
        };

        this.selfPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          creditAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          dealId: null
        };

        this.selfPayLaterModel = {
          amount: {
            currency: null,
            amount: null
          },
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          creditAccountId: {
            displayValue: null,
            value: null
          },
          statusType: null,
          dealId: null
        };

        this.internationalPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          status: null,
          payeeId: null,
          otherDetails: {
           line1: null,
            line2:null,
            line3:null,
            line4:null
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
          intermediaryBankNetwork:null,
          charges: null,
          dealId: null
        };

        this.internationalPayLaterModel = {
          paymentType: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          statusType: null,
          payeeId: null,
          otherDetails: {
            line1: null,
            line2:null,
            line3:null,
            line4:null
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
          intermediaryBankNetwork:null,
          charges: null,
          dealId: null
        };

        this.domesticPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          network: null,
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          payeeId: null,
          sepaDomestic: {
            amount: {
              currency: null,
              amount: null
            },
            payeeId: null,
            oinNumber: null,
            oinDescription: null
          },
          charges: null
        };

        this.domesticPayLaterModel = {
          paymentType: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          network: null,
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          payeeId: null,
          sepaDomesticPayout: {
            amount: {
              currency: null,
              amount: null
            },
            payeeId: null,
            oinNumber: null,
            oinDescription: null
          },
          charges: null
        };

        this.favoritesModel = {
          id: null,
          transactionType: null,
          payeeId: null,
          amount: {
            currency: null,
            amount: null
          },
          debitAccountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          creditAccountId: {
            displayValue: null,
            value: null
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
          intermediaryBankNetwork:null,
          network: null,
          purpose: null,
          remarks: null,
          payeeGroupId: null,
          valueDate: null,
          payeeNickName: null,
          charges: null,
          payeeAccountName: null,
          otherDetails: {
            line1: null,
            line2 :null,
            line3:null,
            line4 :null
          },
          otherPurposeText: null
        };

        this.P2PPayment = {
          amount: {
            currency: "",
            amount: ""
          },
          transferMode: "",
          transferValue: "",
          remarks: "",
          purpose: "",
          payeeId: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: ""
          }
        };

        this.otherDetails= {
            line1: null,
            line2 :null,
            line3:null,
            line4 :null
          };

        this.WalletToWalletModel = {
          payeeAccount: null,
          debitAccount: {
            displayValue: null,
            value: null
          },
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          party: {
            displayValue: null,
            value: null
          }
        };

        this.otherDetails= {
          line1: null,
          line2 :null,
          line3:null,
          line4 :null
        };
      },
      baseService = BaseService.getInstance();
    let getPayeeListDeferred;
    const getPayeeList = function(isSIBoolean, deferred) {
      let url;

      if (isSIBoolean) {
        url = "payments/payeeGroup?types=INTERNAL,INDIADOMESTIC";
      } else {
        url = "payments/payeeGroup?types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC,PEERTOPEER";
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
    let getPayeeSubListDeferred;
    const getPayeeSubList = function(groupId, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: groupId
        };

      baseService.fetch(options, params);
    };
    let readPayeeGroupDeferred;
    const readPayeeGroup = function (groupId, deferred) {
      const options = {
        url: "payments/payeeGroup/" + groupId + "/payees",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let initiatePaymentDeferred;
    const initiatePayment = function(model, param1, param2, date, deferred) {
      let url;

      if (date === "now") {
        url = "payments/{paymentType}/{transferType}";
      } else {
        url = "payments/instructions/{paymentType}/{transferType}";
      }

      const options = {
          url: url,
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          paymentType: param1,
          transferType: param2
        };

      baseService.add(options, params);
    };
    let verifyPaymentDeferred;
    const verifyPayment = function(param1, param2, paymentId, date, deferred) {
      let url;

      if (date === "now") {
        url = "payments/{paymentType}/{transferType}/{paymentId}";
      } else {
        url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
      }

      const options = {
          url: url,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          paymentType: param1,
          transferType: param2,
          paymentId: paymentId
        };

      baseService.patch(options, params);
    };
    let confirmPaymentDeferred;
    const confirmPayment = function(param1, param2, paymentId, otp, date, deferred) {
      let url;

      if (date === "now") {
        url = "payments/{paymentType}/{transferType}/{paymentId}/authentication";
      } else {
        url = "payments/instructions/{paymentType}/{transferType}/{paymentId}/authentication";
      }

      const options = {
          url: url,
          headers: {
            TOKEN_ID: otp
          },
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          paymentType: param1,
          transferType: param2,
          paymentId: paymentId
        };

      baseService.update(options, params);
    };
    let getTransferDataDeferred;
    const getTransferData = function(paymentId, param1, param2, date, deferred) {
      let url;

      if (date === "now") {
        url = "payments/{paymentType}/{transferType}/{paymentId}";
      } else {
        url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
      }

      const options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          paymentType: param1,
          transferType: param2,
          paymentId: paymentId
        };

      baseService.fetch(options, params);
    };
    let getPayeeDataDeferred;
    const getPayeeData = function(payeeId, groupId, payeeType, deferred) {
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
          groupId: groupId,
          payeeType: payeeType,
          payeeId: payeeId
        };

      baseService.fetch(options, params);
    };
    let addFavoritesDeferred;
    const addFavorites = function(model, deferred) {
      const options = {
        url: "payments/favorites",
        data: model,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let getRepeatDeferred;
    const getRepeateIntervals = function(deferred) {
      const options = {
        url: "enumerations/paymentFrequency",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };
    let deleteFavouriteDeferred;
    const deleteFavourite = function(paymentId, transactionType, deferred) {
      const options = {
          url: "payments/favorites?transactionId={paymentId}&&type={transactionType}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          paymentId: paymentId,
          transactionType: transactionType
        };

      baseService.remove(options, params);
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

    let listOfPropertiesDeferred;
    const listOfProperties = function (deferred) {
      const options = {
        url: "maintenances/payments",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    let transferToWalletDeferred;
    const transferToWallet = function(payload,deferred) {
      const options = {
        url: "wallets/transfer",
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

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getNetworkTypes: function() {
        return baseService.fetch({
          url: "enumerations/networkType?REGION=INDIA"
        });
      },
      fetchAccountData: function(type) {
        let accounts = [];
        const promises = [];

        if (Array.isArray(type)) {
            accounts = type;
        } else {
            accounts.push(type);
        }

        accounts.forEach(function(urlType) {
            const url = "accounts/" + urlType;

            promises.push(baseService.fetchWidget({
                url: url,
                mockedUrl: "framework/json/design-dashboard/accounts/demand-deposit.json"
            }));
        });

        return Promise.all(promises).then(function(values) {
            return values.reduce(function(acc, value) {
                return acc.concat(value.accounts || value || []);
            }, []);
        });
    },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      getPayeeList: function(isSIBoolean) {
        getPayeeListDeferred = $.Deferred();
        getPayeeList(isSIBoolean, getPayeeListDeferred);

        return getPayeeListDeferred;
      },
      getPayeeSubList: function(groupId) {
        getPayeeSubListDeferred = $.Deferred();
        getPayeeSubList(groupId, getPayeeSubListDeferred);

        return getPayeeSubListDeferred;
      },
      initiatePayment: function(model, param1, param2, date) {
        initiatePaymentDeferred = $.Deferred();
        initiatePayment(model, param1, param2, date, initiatePaymentDeferred);

        return initiatePaymentDeferred;
      },
      listOfProperties: function () {
        listOfPropertiesDeferred = $.Deferred();
        listOfProperties(listOfPropertiesDeferred);

        return listOfPropertiesDeferred;
      },
      verifyPayment: function(param1, param2, paymentId, date) {
        verifyPaymentDeferred = $.Deferred();
        verifyPayment(param1, param2, paymentId, date, verifyPaymentDeferred);

        return verifyPaymentDeferred;
      },
      confirmPayment: function(param1, param2, paymentId, otp, date) {
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(param1, param2, paymentId, otp, date, confirmPaymentDeferred);

        return confirmPaymentDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);

        return listAccessPointDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);

        return getTransferDataDeferred;
      },
      getPayeeData: function(payeeId, groupId, payeeType) {
        getPayeeDataDeferred = $.Deferred();
        getPayeeData(payeeId, groupId, payeeType, getPayeeDataDeferred);

        return getPayeeDataDeferred;
      },
      readPayeeGroup: function (groupId) {
        readPayeeGroupDeferred = $.Deferred();
        readPayeeGroup(groupId, readPayeeGroupDeferred);

        return readPayeeGroupDeferred;
      },
      addFavorites: function(model) {
        addFavoritesDeferred = $.Deferred();
        addFavorites(model, addFavoritesDeferred);

        return addFavoritesDeferred;
      },
      getRepeateIntervals: function() {
        getRepeatDeferred = $.Deferred();
        getRepeateIntervals(getRepeatDeferred);

        return getRepeatDeferred;
      },
      deleteFavourite: function(paymentId, transactionType) {
        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);

        return deleteFavouriteDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      transferToWallet: function(payload) {
        transferToWalletDeferred = $.Deferred();
        transferToWallet(payload,transferToWalletDeferred);

        return transferToWalletDeferred;
      },
      getCharges: function() {
        baseService.fetch({
          url: "charges"
        });
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      /**
       * Fetches maintenances.
       *
       * @returns {Promise}  Returns the promise object.
       */
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
      getExchangeRate: function(data) {
        return baseService.fetch({
          url: "forex/rates?branchCode={branchCode}&ccy1Code={ccy1}&ccy2Code={ccy2}"
        }, {
          branchCode: data.branchCode,
          ccy1: data.ccy1Code,
          ccy2: data.ccy2Code
        });
      },
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
      },
      getRemarks: function() {
        return baseService.fetch({
          url: "enumerations/senderToReceiverInfo"
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getNetworkPreferences: function() {
        return baseService.fetch({
          url: "maintenances/payments/networkPreferences"
        });
      },
      getSuggestedNetwork : function(model){
        return baseService.add({
          url : "payments/derivingNetworkType",
          data: model
        });
      },
      fetchForexDealCreationFlag: function() {
        return baseService.fetch({
          url: "me/partyPreferences"
        });
      }
    };
  };

  return new MoneyTransferModel();
});
