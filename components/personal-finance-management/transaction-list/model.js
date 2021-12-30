define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const TransactionList = function TransactionList() {
        const model = function() {
                this.recategorizationPayload = {
                    transactionReferenceId: null,
                    subSequenceId: null,
                    categoryId: null,
                    subCategoryId: null,
                    splitId: null
                };

                this.createSpendCategoryPayload = {
                    code: null,
                    name: null,
                    description: null,
                    contentId: null,
                    subCategoryList: []
                };

                this.splitObject = {
                    categoryId: [],
                    subcategoryId: [],
                    amount: "",
                    subcategoryList: []
                };

                this.splitPayloadElement = {
                    categoryId: null,
                    subcategoryId: null,
                    transactionAmount: {
                        currency: "",
                        amount: 0
                    }
                };

                this.splitPayload = {
                    splitTransactions: []
                };
            },
            baseService = BaseService.getInstance();
        let listTransactionsDeferred;
        const listTransactions = function(filter, deferred) {
            const url = "expenditures" + filter,
                options = {
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
        let listAllCategoriesDeferred;
        const listAllCategories = function(deferred) {
            const options = {
                url: "expenditures/spendUserCategories?expand=ALL",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let recategorizeTransactionDeferred;
        const recategorizeTransaction = function(payload, deferred) {
            const options = {
                url: "expenditures",
                data: payload,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.update(options);
        };
        let addCategoryDeferred;
        const addCategory = function(payload, deferred) {
            const options = {
                url: "expenditures/spendUserCategories",
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
        let splitxnDeferred;
        const splitxn = function(payload, txnId, subSeqId, deferred) {
            const options = {
                    url: "expenditures/{txnId};subSequenceId={subSeqId}/split",
                    data: payload,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    txnId: txnId,
                    subSeqId: subSeqId
                };

            baseService.update(options, params);
        };
        let listAccountsDeferred;
        const listAccounts = function(deferred) {
            const options = {
                url: "accounts/demandDeposit?taskCode=SP_N_FCT",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let persistHostTransactionsLocallyDeferred;
        const persistHostTransactionsLocally = function(deferred) {
            const options = {
                url: "expenditures?spendTransactionType=DDA",
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
            getNewModel: function() {
                return new model();
            },
            listTransactions: function(filter) {
                listTransactionsDeferred = $.Deferred();
                listTransactions(filter, listTransactionsDeferred);

                return listTransactionsDeferred;
            },
            listAllCategories: function() {
                listAllCategoriesDeferred = $.Deferred();
                listAllCategories(listAllCategoriesDeferred);

                return listAllCategoriesDeferred;
            },
            listAccounts: function() {
                listAccountsDeferred = $.Deferred();
                listAccounts(listAccountsDeferred);

                return listAccountsDeferred;
            },
            recategorizeTransaction: function(payload) {
                recategorizeTransactionDeferred = $.Deferred();
                recategorizeTransaction(payload, recategorizeTransactionDeferred);

                return recategorizeTransactionDeferred;
            },
            addCategory: function(payload) {
                addCategoryDeferred = $.Deferred();
                addCategory(payload, addCategoryDeferred);

                return addCategoryDeferred;
            },
            splitxn: function(payload, txnId, subSeqId) {
                splitxnDeferred = $.Deferred();
                splitxn(payload, txnId, subSeqId, splitxnDeferred);

                return splitxnDeferred;
            },
            getHostDate: function() {
                hostDateDeferred = $.Deferred();
                getHostDate(hostDateDeferred);

                return hostDateDeferred;
            },
            persistHostTransactionsLocally: function() {
                persistHostTransactionsLocallyDeferred = $.Deferred();
                persistHostTransactionsLocally(persistHostTransactionsLocallyDeferred);

                return persistHostTransactionsLocallyDeferred;
            }
        };
    };

    return new TransactionList();
});