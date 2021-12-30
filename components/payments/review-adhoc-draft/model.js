define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    /**
     * Const ReviewAdhocPaymentModel - description.
     *
     * @return {type}  Description.
     */
    const ReviewAdhocPaymentModel = function() {
        const Model = function() {
                this.addressDetails = {
                    modeofDelivery: null,
                    addressType: null,
                    addressTypeDescription: "",
                    postalAddress: {
                        line1: "",
                        line2: "",
                        line3: "",
                        line4: "",
                        line5: "",
                        line6: "",
                        line7: "",
                        line8: "",
                        line9: "",
                        line10: "",
                        line11: "",
                        line12: "",
                        city: "",
                        state: "",
                        country: "",
                        zipCode: "",
                        branch: "",
                        branchName: ""
                    }
                };
            },
            baseService = BaseService.getInstance();
        /**
         * readAdhocPaymentDeferred - description
         *
         * @param  {type} paymentId description
         * @param  {type} deferred  description
         * @return {type}           description
         */
        let readAdhocPaymentDeferred;
        const readAdhocPayment = function(paymentId,paymentType, payeeStatus, deferred) {
          const options = {
            url: paymentId,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

          if (paymentType === "GENERIC" && payeeStatus==="INT") {
            options.url = "payments/generic/" + options.url;
          }else if (paymentType === "SELFFT") {
            options.url = "payments/transfers/self/" + options.url;
          } else if (paymentType === "INTERNALFT") {
            options.url = "payments/transfers/internal/" + options.url;
          } else if (paymentType === "INDIADOMESTICFT") {
            options.url = "payments/payouts/domestic/" + options.url;
          } else if (paymentType === "DOMESTICDRAFT") {
            options.url = "payments/drafts/domestic/" + options.url;
          } else if (paymentType === "PEER_TO_PEER") {
            options.url = "payments/transfers/peerToPeer/" + options.url;
          }

          baseService.fetch(options);
        };
        /**
         * getBranchDetailsDeferred - description
         *
         * @param  {type} branchCode description
         * @param  {type} deferred   description
         * @return {type}            description
         */
        let getBranchDetailsDeferred;
        const getBranchDetails = function(branchCode, deferred) {
            const options = {
                url: "locations/branches?branchCode={branchCode}",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            },
            params = {
                branchCode: branchCode
            };

            baseService.fetch(options, params);
        };
        /**
         * confirmPaymentDeferred - description
         *
         * @param  {type} paymentId   description
         * @param  {type} paymentType description
         * @param  {type} deferred    description
         * @return {type}             description
         */
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
                paymentType: paymentType
            };

            baseService.patch(options, params);
        };
        let getPartyAddressDeferred;
        const getPartyAddress = function(deferred) {
          const options = {
            url: "me/party",
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
            getNewModel: function() {
                return new Model();
            },
            readAdhocPayment: function(paymentId,paymentType, payeeStatus) {
                readAdhocPaymentDeferred = $.Deferred();
                readAdhocPayment(paymentId,paymentType, payeeStatus, readAdhocPaymentDeferred);

                return readAdhocPaymentDeferred;
            },
            getPartyAddress: function() {
                getPartyAddressDeferred = $.Deferred();
                getPartyAddress(getPartyAddressDeferred);

                return getPartyAddressDeferred;
              },
            getBranchDetails: function(branchCode) {
                getBranchDetailsDeferred = $.Deferred();
                getBranchDetails(branchCode, getBranchDetailsDeferred);

                return getBranchDetailsDeferred;
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
            batchRead: function(batchRequest, type) {
                fireBatchDeferred = $.Deferred();
                batchRead(fireBatchDeferred, batchRequest, type);

                return fireBatchDeferred;
            }
        };
    };

    return new ReviewAdhocPaymentModel();
});
