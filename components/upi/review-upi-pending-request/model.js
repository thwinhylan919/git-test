define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            paymentstransfersupipost: function (referenceNo) {
                   const params = { referenceNo: referenceNo },
                 options = {
                    url: "/payments/transfers/upi/fundRequest/{referenceNo}/approve",
                    version: "v1"
                };

                return baseService.add(options, params);
            },
            getNewModel: function () {
                return {
                    amount: {
                        currency: null,
                        amount: null
                    },
                    valueDate: null,
                    remarks: null,
                    debitVPAId: null,
                    creditVPAId: null,
                    accountTransferDetails: {
                        createdBy: null,
                        creationDate: null,
                        lastUpdatedBy: null,
                        lastUpdatedDate: null,
                        version: null,
                        entityStatus: null,
                        recordStatus: null,
                        generatedPackageId: null,
                        configPackageId: null,
                        auditSequence: null,
                        id: null,
                        name: null,
                        nickName: null,
                        payeeType: null,
                        partyId: null,
                        groupId: null,
                        status: null,
                        alias: [{
                                type: null,
                                value: null,
                                description: null
                            }],
                        tokenId: null,
                        currency: null,
                        contentId: {
                            displayValue: null,
                            value: null
                        },
                        shared: null,
                        payeeAccessType: null,
                        userDetails: {
                            username: null,
                            title: null,
                            firstName: null,
                            middleName: null,
                            lastName: null,
                            emailId: null,
                            mobileNumber: null,
                            phoneNumber: null
                        },
                        transferMode: null,
                        accountNumber: null,
                        accountName: null,
                        bankDetails: {
                            name: null,
                            branch: null,
                            address: null,
                            city: null,
                            country: null,
                            codeType: null,
                            code: null
                        },
                        walkinDetails: {
                            recipientName: null,
                            recipientAddress: {
                                line1: null,
                                line2: null,
                                line3: null,
                                line4: null,
                                line5: null,
                                line6: null,
                                line7: null,
                                line8: null,
                                line9: null,
                                line10: null,
                                line11: null,
                                line12: null,
                                city: null,
                                state: null,
                                country: null,
                                postalCode: null
                            }
                        },
                        identificationDetails: [{
                                identificationType: null,
                                identificationNumber: null
                            }],
                        accountType: null,
                        adhocPayee: null
                    },
                    deviceDetails: {
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
                    },
                    sourceAccount: {
                        displayValue: null,
                        value: null
                    },
                    receiverName: null,
                    payeeDetails: {
                        createdBy: null,
                        creationDate: null,
                        lastUpdatedBy: null,
                        lastUpdatedDate: null,
                        version: null,
                        entityStatus: null,
                        recordStatus: null,
                        generatedPackageId: null,
                        configPackageId: null,
                        auditSequence: null,
                        id: null,
                        name: null,
                        nickName: null,
                        payeeType: null,
                        partyId: null,
                        groupId: null,
                        status: null,
                        alias: [{
                                type: null,
                                value: null,
                                description: null
                            }],
                        tokenId: null,
                        currency: null,
                        contentId: {
                            displayValue: null,
                            value: null
                        },
                        shared: null,
                        payeeAccessType: null,
                        userDetails: {
                            username: null,
                            title: null,
                            firstName: null,
                            middleName: null,
                            lastName: null,
                            emailId: null,
                            mobileNumber: null,
                            phoneNumber: null
                        },
                        adhocPayee: null
                    },
                    expiryDate: null,
                    transferId: null
                };
            }
        };
    };

    return new Model();
});