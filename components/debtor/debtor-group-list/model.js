define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const BillerListModel = function() {
        const Model = function() {
            this.editPayerModel = {
                nickName: null,
                groupId: null,
                domesticPayerType: "SEPA",
                contentId: null,
                sepaDomesticPayer: {
                    iban: null,
                    bankDetails: {
                        code: null
                    },
                    sepaPayerType: "DIR"
                }
            };
        };
        let modelInitialized = false;
        const baseService = BaseService.getInstance(),
            /* variable to make sure that in case there is no change
             * in model no additional fetch requests are fired.*/
            errors = {
                InitializationException: function() {
                    let message = "";

                    message += "\nObject can't be initialized without a valid submission Id. ";
                    message += "\nPlease make sure the submission id is present.";
                    message += "\nProper initialization has to be:";
                    message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

                    return message;
                }(),
                ObjectNotInitialized: function() {
                    let message = "";

                    message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
                    message += "\nProper initialization has to be: ";
                    message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

                    return message;
                }()
            },
            objectInitializedCheck = function() {
                if (!modelInitialized) {
                    throw new Error(errors.ObjectNotInitialized);
                }
            };
        let deleteDebtorDeferred;
        const deleteDebtor = function(groupId, payerId, deferred) {
            const options = {
                    url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    },
                    error: function(data, status, jqXHR) {
                        deferred.reject(data, status, jqXHR);
                    }
                },
                params = {
                    groupId: groupId,
                    payerId: payerId
                };

            baseService.remove(options, params);
        };
        let deleteDebtorGroupDeferred;
        const deleteDebtorGroup = function(groupId, deferred) {
            const options = {
                    url: "payments/payerGroup/{groupId}",
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    },
                    error: function(data, status, jqXHR) {
                        deferred.reject(data, status, jqXHR);
                    }
                },
                params = {
                    groupId: groupId
                };

            baseService.remove(options, params);
        };
        let getDebtorsListDeferred;
        const getDebtorsList = function(deferred) {
            const options = {
                url: "payments/payerGroup?expand=ALL",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
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
        let editPayerDeferred;
        const editPayer = function(payload, data, deferred) {
            const options = {
                    url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    },
                    error: function(data, status, jqXHR) {
                        deferred.reject(data, status, jqXHR);
                    }
                },
                params = {
                    payerId: data.payerId,
                    groupId: data.groupId
                };

            baseService.update(options, params);
        };

        return {
            init: function() {
                modelInitialized = true;
            },
            getNewModel: function() {
                return new Model();
            },
            deleteDebtor: function(groupId, payerId) {
                objectInitializedCheck();
                deleteDebtorDeferred = $.Deferred();
                deleteDebtor(groupId, payerId, deleteDebtorDeferred);

                return deleteDebtorDeferred;
            },
            deleteDebtorGroup: function(groupId) {
                objectInitializedCheck();
                deleteDebtorGroupDeferred = $.Deferred();
                deleteDebtorGroup(groupId, deleteDebtorGroupDeferred);

                return deleteDebtorGroupDeferred;
            },
            getDebtorsList: function() {
                objectInitializedCheck();
                getDebtorsListDeferred = $.Deferred();
                getDebtorsList(getDebtorsListDeferred);

                return getDebtorsListDeferred;
            },
            getPayerMaintenance: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            batchRead: function(batchRequest, type) {
                fireBatchDeferred = $.Deferred();
                batchRead(fireBatchDeferred, batchRequest, type);

                return fireBatchDeferred;
            },
            retrieveImageTypeSuuport: function() {
                return baseService.fetch({
                    url: "maintenances/payments/payeecontent"
                });
            },
            editPayer: function(payload, params) {
                editPayerDeferred = $.Deferred();
                editPayer(payload, params, editPayerDeferred);

                return editPayerDeferred;
            }
        };
    };

    return new BillerListModel();
});