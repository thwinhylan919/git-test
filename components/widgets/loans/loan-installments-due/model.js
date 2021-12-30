define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const InstallmentsDueModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.installmentSummary = {
                    accountNo: null,
                    partyName: null,
                    amount: {
                        currency: null,
                        amount: null
                    },
                    paymentMethod:null,
                    dueDate: null,
                    autoPayment: null,
                    nickName: null,
                    value: null
                };
            };

        let getLoanAccountsDeferred;
        const getLoanAccounts = function (deferred) {
            const options = {
                url: "accounts/loan",
                success: function (data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function (data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };

        return {
            getNewModel: function (modelData) {
                return new Model(modelData);
            },
            getLoanAccounts: function () {
                getLoanAccountsDeferred = $.Deferred();
                getLoanAccounts(getLoanAccountsDeferred);

                return getLoanAccountsDeferred;
            }
        };
    };

    return new InstallmentsDueModel();
});