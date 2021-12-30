define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const LimitPackageModel = function() {
        let params;
        const baseService = BaseService.getInstance();
        let fetchLimitTransactionsDeffered;
        const fetchLimitTransactions = function(deffered) {
            const options = {
                url: "resourceTasks?aspects=limit&executable=true",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchTransactionGroupDeffered;
        const fetchTransactionGroup = function(deffered) {
            const options = {
                url: "taskGroups?taskAspect=limit",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getTransactionGroupNameDeffered;
        const getTransactionGroupName = function(taskGroupId, deffered) {
            const params = {
                    taskGroupId: taskGroupId
                },
                options = {
                    url: "taskGroups/{taskGroupId}",
                    success: function(data) {
                        deffered.resolve(data);
                    },
                    error: function(data) {
                        deffered.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let fetchAccessPointDeffered;
        const fetchAccessPoint = function(deffered) {
            const options = {
                url: "accessPoints",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchAccessPointGroupDeffered;
        const fetchAccessPointGroup = function(deffered) {
            const options = {
                url: "accessPointGroups",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchEnterpriseRolesDeffered;
        const fetchEnterpriseRoles = function(deffered) {
            const options = {
                url: "enterpriseRoles?isLocal=true",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchCurrenciesDeffered;
        const fetchCurrencies = function(deffered) {
            const options = {
                url: "currency",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let createNewPackageDeffered;
        const createNewPackage = function(payload, deffered) {
            const options = {
                url: "limitPackages",
                data: payload,
                success: function(data, status, jqXhr) {
                    deffered.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                    deffered.reject(data, status, jqXhr);
                }
            };

            baseService.add(options);
        };
        let updatePackageDeffered;
        const updatePackage = function(payload, deffered) {
            const params = {
                    id: JSON.parse(payload).key.id
                },

                options = {
                    url: "limitPackages/{id}",
                    data: payload,
                    success: function(data, status, jqXhr) {
                        deffered.resolve(data, status, jqXhr);
                    },
                    error: function(data) {
                        deffered.reject(data);
                    }
                };

            baseService.update(options, params);
        };
        let fetchCummulativeLimitsDeffered;
        const fetchCummulativeLimits = function(limitCurrency, deffered) {
            params = {
                limitCurrency: limitCurrency
            };

            const options = {
                url: "financialLimits?limitType=PER&limitCurrency={limitCurrency}",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options, params);
        };
        let fetchTransactionLimitsDeffered;
        const fetchTransactionLimits = function(limitCurrency, deffered) {
            params = {
                limitCurrency: limitCurrency
            };

            const options = {
                url: "financialLimits?limitType=TXN&limitCurrency={limitCurrency}",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options, params);
        };
        let fetchCoolingLimitsDeffered;
        const fetchCoolingLimits = function(limitCurrency, deffered) {
            params = {
                limitCurrency: limitCurrency
            };

            const options = {
                url: "financialLimits?limitType=DUR&limitCurrency={limitCurrency}",
                success: function(data) {
                    deffered.resolve(data);
                },
                error: function(data) {
                    deffered.reject(data);
                }
            };

            baseService.fetch(options, params);
        };
        let fetchSystemConfigurationDetailsDeferred;
        const fetchSystemConfigurationDetails = function(deferred) {
            const options = {
                url: "configurations/base/limitconfig/properties/ACCESS_POINT_SPECIFIC_LIMIT",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchEffectiveTodayDetailsDeffered;
        const fetchEffectiveTodayDetails = function(deffered) {
                const options = {
                    url: "limitPackages/config/effectiveToday",
                    success: function(data) {
                        deffered.resolve(data);
                    },
                    error: function(data) {
                        deffered.reject(data);
                    }
                };

                baseService.fetch(options);
            },
            getTargetLinkageModel = function() {
                let targetLimitLinkagesObj = {};

                targetLimitLinkagesObj = {
                    target: {
                        value: null,
                        name: null,
                        type: {
                            id: null,
                            name: null,
                            mandatory: true
                        }
                    },
                    limits: [{
                            limitId: null,
                            limitName: null,
                            limitDescription: null,
                            limitType: "PER",
                            maxAmount: null,
                            maxCount: null,
                            periodicity: "DAILY",
                            currency: null
                        },
                        {
                            limitId: null,
                            limitName: null,
                            limitDescription: null,
                            limitType: "PER",
                            maxAmount: null,
                            maxCount: null,
                            periodicity: "MONTHLY",
                            currency: null
                        }, {
                            limitId: null,
                            limitName: null,
                            limitDescription: null,
                            limitType: "TXN",
                            amountRange: null,
                            currency: null
                        }, {
                            limitId: null,
                            limitName: null,
                            limitDescription: null,
                            limitType: "DUR",
                            durationLimitSlots: null,
                            currency: null
                        }
                    ],
                    effectiveDate: null,
                    expiryDate: null,
                    editable: true
                };

                return targetLimitLinkagesObj;
            },
            getPackageModel = function() {
                let obj = {};

                obj = {
                    key: {
                        id: null
                    },
                    accessPointValue: null,
                    accessPointGroupType: null,
                    description: null,
                    currency: null,
                    owner: {
                        key: {
                            value: "RETAIL",
                            type: "ROLE"
                        }
                    },
                    targetLimitLinkages: [getTargetLinkageModel()],
                    assignableToList: [{
                        key: {
                            value: null,
                            type: null
                        }
                    }]
                };

                return obj;
            };

        return {
            fetchLimitTransactions: function() {
                fetchLimitTransactionsDeffered = $.Deferred();
                fetchLimitTransactions(fetchLimitTransactionsDeffered);

                return fetchLimitTransactionsDeffered;
            },
            fetchTransactionGroup: function() {
                fetchTransactionGroupDeffered = $.Deferred();
                fetchTransactionGroup(fetchTransactionGroupDeffered);

                return fetchTransactionGroupDeffered;
            },
            getTransactionGroupName: function(taskGroupId) {
                getTransactionGroupNameDeffered = $.Deferred();
                getTransactionGroupName(taskGroupId, getTransactionGroupNameDeffered);

                return getTransactionGroupNameDeffered;
            },
            fetchAccessPoint: function() {
                fetchAccessPointDeffered = $.Deferred();
                fetchAccessPoint(fetchAccessPointDeffered);

                return fetchAccessPointDeffered;
            },
            fetchAccessPointGroup: function() {
                fetchAccessPointGroupDeffered = $.Deferred();
                fetchAccessPointGroup(fetchAccessPointGroupDeffered);

                return fetchAccessPointGroupDeffered;
            },
            fetchEnterpriseRoles: function() {
                fetchEnterpriseRolesDeffered = $.Deferred();
                fetchEnterpriseRoles(fetchEnterpriseRolesDeffered);

                return fetchEnterpriseRolesDeffered;
            },
            fetchCurrencies: function() {
                fetchCurrenciesDeffered = $.Deferred();
                fetchCurrencies(fetchCurrenciesDeffered);

                return fetchCurrenciesDeffered;
            },
            createNewPackage: function(payload) {
                createNewPackageDeffered = $.Deferred();
                createNewPackage(payload, createNewPackageDeffered);

                return createNewPackageDeffered;
            },
            updatePackage: function(payload) {
                updatePackageDeffered = $.Deferred();
                updatePackage(payload, updatePackageDeffered);

                return updatePackageDeffered;
            },
            fetchCummulativeLimits: function(limitCurrency) {
                fetchCummulativeLimitsDeffered = $.Deferred();
                fetchCummulativeLimits(limitCurrency, fetchCummulativeLimitsDeffered);

                return fetchCummulativeLimitsDeffered;
            },
            fetchTransactionLimits: function(limitCurrency) {
                fetchTransactionLimitsDeffered = $.Deferred();
                fetchTransactionLimits(limitCurrency, fetchTransactionLimitsDeffered);

                return fetchTransactionLimitsDeffered;
            },
            fetchCoolingLimits: function(limitCurrency) {
                fetchCoolingLimitsDeffered = $.Deferred();
                fetchCoolingLimits(limitCurrency, fetchCoolingLimitsDeffered);

                return fetchCoolingLimitsDeffered;
            },
            fetchSystemConfigurationDetails: function() {
                fetchSystemConfigurationDetailsDeferred = $.Deferred();
                fetchSystemConfigurationDetails(fetchSystemConfigurationDetailsDeferred);

                return fetchSystemConfigurationDetailsDeferred;
            },
            fetchEffectiveTodayDetails: function() {
                fetchEffectiveTodayDetailsDeffered = $.Deferred();
                fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);

                return fetchEffectiveTodayDetailsDeffered;
            },
            getTargetLinkageModel: function() {
                return new getTargetLinkageModel();
            },
            getTransactionGroupModel: function() {
                return new getTargetLinkageModel();
            },
            getPackageModel: function() {
                return new getPackageModel();
            }
        };
    };

    return new LimitPackageModel();
});