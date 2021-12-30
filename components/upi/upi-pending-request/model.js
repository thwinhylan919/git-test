define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            paymentstransfersupiFundRequestget: function (vpaId, pendingFundRequestType) {
                const params = {
                    vpaId: vpaId,
                    pendingFundRequestType: pendingFundRequestType
                },
                 options = {
                    url: "/payments/transfers/upi/fundRequest?vpaId={vpaId}&pendingFundRequestType={pendingFundRequestType}",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            virtualPaymentAddressesget: function () {
                const params = {},
                 options = {
                    url: "/virtualPaymentAddresses",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            mepartyget: function () {
                const params = {},
                 options = {
                    url: "/me/party",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            paymentstransfersupiFundRequestreferenceNoapprovepost: function (referenceNo, payload) {
                const params = { referenceNo: referenceNo },
                 options = {
                    url: "/payments/transfers/upi/fundRequest/{referenceNo}/approve",
                    version: "v1",
                    data: payload,
                       headers: {
                        "X-Validate-Only": "Y"
                    }
                };

                return baseService.add(options, params);
            },
            paymentstransfersupiFundRequestreferenceNorejectpost: function (referenceNo, payload) {
                const params = { referenceNo: referenceNo },
                 options = {
                    url: "/payments/transfers/upi/fundRequest/{referenceNo}/reject",
                    version: "v1",
                    data: payload
                };

                return baseService.add(options, params);
            },
            fireBatch: function(batchRequest,type) {
              return baseService.batch({
                url: "batch"
              },{
                  type: type
              }, batchRequest);
            },
            fetchPayeeList: function() {
              return baseService.fetch({
                url: "payments/payeeGroup?expand=ALL&types=VPA"
              });
            },
            getHostDate: function() {
              return baseService.fetch({
                url: "payments/currentDate"
              });
            },
            getNewModel: function () {
                return {
                    version: null,
                    uuid: null,
                    platform: null,
                    model: null,
                    manufacturer: null,
                    virtual: null,
                    serial: null,
                    sim1IMEI: null,
                    sim2IMEI: null,
                    latitude: null,
                    longitude: null
                };
            }
        };
    };

    return new Model();
});
