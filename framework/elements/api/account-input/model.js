define([
    "baseService",
    "baseModel"
], function (BaseService, BaseModel) {
    "use strict";

    const AccountDetailsModel = function () {
        const baseService = BaseService.getInstance(),
            baseModel = BaseModel.getInstance();

        return {
            fetchAccountData: function (type, taskCode) {
                let accounts = [];
                const batchRequest = [];

                if (Array.isArray(type)) {
                    accounts = type;
                } else {
                    accounts.push(type);
                }

                let sequenceId = 0;

                accounts.forEach(function (urlType) {
                    const queryParams = Object.assign({}, baseModel.QueryParams.get(null, urlType), {
                        taskCode: taskCode
                    });

                    urlType = baseModel.QueryParams.remove(urlType);

                    batchRequest.push({
                        headers: {
                            "Content-Id": sequenceId,
                            "Content-Type": "application/json"
                        },
                        uri: {
                            value: baseModel.format(baseModel.QueryParams.add("/accounts/{urlType}", queryParams), {
                                urlType: urlType
                            })
                        },
                        methodType: "GET"
                    });

                    sequenceId++;
                });

                return baseService.fetchWidget({
                    url: "batch",
                    mockedUrl: "framework/json/design-dashboard/accounts/batch-account.json"
                }, {}, {
                    batchDetailRequestList: batchRequest
                });
            },
            fetchBankAddress: function (bankCode) {
                return baseService.fetch({
                    url: "locations/branches?branchCode={bankCode}"
                }, {
                    bankCode: bankCode
                });
            }
        };
    };

    return new AccountDetailsModel();
});