define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/adhoc-payments",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function(ko, $, ReviewAdhocPaymentModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;
        let taskCode, confirmScreenDetailsArray;

        self.network = ko.observable();
        ko.utils.extend(self, Params.rootModel);
        self.payments = ResourceBundle.payments;
        self.paymentTemplate = ko.observable();
        self.payeeTemplate = ko.observable();
        self.domesticPayeeType = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.paymentType = ko.observable();
        self.branchName = ko.observable();
        self.branchesLoaded = ko.observable(true);
        self.branches = ko.observableArray();
        self.branchCode = ko.observable();
        self.purpose = ko.observable();
        self.purposeText = ko.observable();
        self.chargesDescription = ko.observable();
        self.isCorrespondenceChargesLoaded = ko.observable(true);
        self.successMessage = ko.observable();
        self.adhocPaymentFlag = ko.observable(true);
        self.transactionPurposeList = ko.observableArray();
        self.isStandingInstruction = ko.observable();
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;
        self.charges = ko.observable();
        self.paymentId = Params.readData ? Params.readData.paymentId : self.params.data ? ko.utils.unwrapObservable(self.params.data.paymentId) : self.params.paymentId();
        self.payeeStatus = self.params.transferData ? self.params.transferData.payeeStatus : "INT";
        self.typeofPayment = self.payeeStatus === "DEL" ? self.params.transferData.paymentType : "GENERIC";
        self.payeeAccountType = self.params.transferData ? self.params.transferData.reInitiateData.payeeAccountType : null;

        self.corpPSheader = "";
        self.paymentData = ko.observable();
        self.chargesData = ko.observable();
        self.chargesSum = ko.observable();
        self.valueDate = ko.observable();
        self.serviceChargesLoaded = ko.observable(false);
        self.typeOfAccountDescription = ko.observable();
        self.payeeDetails = self.params.data && self.params.data.payeeDetails ? ko.mapping.toJS(self.params.data.payeeDetails) : self.params.payeeDetails ? ko.mapping.toJS(self.params.payeeDetails) : null;
        self.paymentTransferData = self.params.data ? self.params.data.paymentTransferData ? self.params.data.paymentTransferData() : self.params.paymentTransferData ? self.params.paymentTransferData() : ko.observable() : ko.observable();
        self.countriesMap = {};
        self.payeeCountryDescription = ko.observable();
        self.ukNetworkType = ko.observable();
        self.confirmScreenExtensions = self.params.confirmScreenExtensions;

        let intermediaryBankDetailsPromise,intermediaryBankNetwork;

        self.dispose = null;

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            } else if (jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
            }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            } else if (jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
            }
        };

        function serviceCharges(urlParams) {
            if (urlParams.network !== "IMPS") {
                ReviewAdhocPaymentModel.getServiceCharges(urlParams).then(function(chargesResponse) {
                    if (chargesResponse && chargesResponse.paymentChargeDetails && chargesResponse.paymentChargeDetails.length > 0) {
                        self.chargesData(chargesResponse.paymentChargeDetails);

                        let sum = 0,
                            j = 0;

                        for (j = 0; j < self.chargesData().length; j++) {
                            sum = sum + self.chargesData()[j].serviceCharge.amount;
                        }

                        self.chargesSum(sum);
                        self.serviceChargesLoaded(true);
                        self.dataLoaded(true);
                    }
                });
            }
        }

        function getinternalConfirmScreen() {
            confirmScreenDetailsArray = [
                [{
                        label: self.payments.moneytransfer.transferto,
                        value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.accountName : self.paymentTransferData().payeeDetails.accountName
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: self.paymentTransferData().amount ? self.paymentTransferData().amount.amount : self.paymentTransferData().instructionDetails.amount.amount,
                        currency: self.paymentTransferData().amount ? self.paymentTransferData().amount.currency : self.paymentTransferData().instructionDetails.amount.currency,
                        isCurrency: true
                    }
                ],
                [{
                        label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                        value: self.payeeDetails.accountNumber,
                        isInternalAccNo : true
                    },
                    {
                        label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accounttype,
                        value: self.payments.payee.accinternal
                    }
                ],
                [{
                        label: self.payments.moneytransfer.transferfrom,
                        value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                    },
                    {
                        label: self.payments.moneytransfer.transferon,
                        value: self.paymentTransferData().valueDate ? self.paymentTransferData().valueDate : self.paymentTransferData().instructionDetails.startDate,
                        isDate: true
                    }
                ]
            ];
        }

        function getAmountValues(type) {
            if(type === "amount") {
                return self.paymentTransferData().amount ? self.paymentTransferData().amount.amount : self.paymentTransferData().instructionDetails.amount.amount;
            } else if (type === "currency") {
                return self.paymentTransferData().amount ? self.paymentTransferData().amount.currency : self.paymentTransferData().instructionDetails.amount.currency;
            }
        }

        function formIndiaDomesticConfirmScreenArray(){
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferto,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.indiaDomesticPayee.accountName : self.paymentTransferData().payeeDetails.indiaDomesticPayee.accountName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: getAmountValues("amount"),
                            currency: getAmountValues("currency"),
                            isCurrency: true
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails.indiaDomesticPayee.accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                            value: Params.baseModel.format(self.payments.moneytransfer.typeOfAccount, {
                                payeeAccountType: self.payments.payee.accdomestic,
                                accountType: self.typeOfAccountDescription()
                            })
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeDetails.indiaDomesticPayee.bankDetails.code,
                                self.payeeDetails.indiaDomesticPayee.bankDetails.name,
                                self.payeeDetails.indiaDomesticPayee.bankDetails.city,
                                self.payeeDetails.indiaDomesticPayee.bankDetails.country
                            ]
                        },
                        {
                            label: self.payments.payee.payvia,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.indiaDomesticPayee.network ? self.paymentData().payeeDetails.indiaDomesticPayee.network : self.network() : self.paymentTransferData().payeeDetails.indiaDomesticPayee.network ? self.paymentTransferData().payeeDetails.indiaDomesticPayee.network : self.paymentData().payoutDetails.instructionDetails.network
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: self.paymentTransferData().valueDate ? self.paymentTransferData().valueDate : self.paymentTransferData().instructionDetails.startDate,
                            isDate: true
                        }
                    ]
                ];
        }

        function getDomesticConfirmScreen() {
            if (self.payeeDetails.domesticPayeeType === "INDIA") {
                formIndiaDomesticConfirmScreenArray();
            } else if (self.payeeDetails.domesticPayeeType === "UK") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferto,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.ukDomesticPayee.accountName : self.paymentTransferData().payeeDetails.ukDomesticPayee.accountName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: getAmountValues("amount"),
                            currency: getAmountValues("currency"),
                            isCurrency: true
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails.ukDomesticPayee.accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.accdomestic
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeDetails.ukDomesticPayee.bankDetails.code,
                                self.payeeDetails.ukDomesticPayee.bankDetails.name,
                                self.payeeDetails.ukDomesticPayee.bankDetails.city,
                                self.payeeDetails.ukDomesticPayee.bankDetails.country
                            ]
                        },
                        {
                            label: self.payments.payee.payvia,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.ukDomesticPayee.network ? self.paymentData().payeeDetails.ukDomesticPayee.network : self.network() : self.paymentTransferData().payeeDetails.ukDomesticPayee.network ? self.paymentTransferData().payeeDetails.ukDomesticPayee.network : self.paymentData().payoutDetails.instructionDetails.network
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: self.paymentTransferData().valueDate ? self.paymentTransferData().valueDate : self.paymentTransferData().instructionDetails.startDate,
                            isDate: true
                        }
                    ]
                ].concat(self.ukNetworkType() === "URG" ? [
                    [{
                        label: self.payments.moneytransfer.paymentdetails,
                        value: self.paymentTransferData().otherDetails ? [self.paymentTransferData().otherDetails.line1,self.paymentTransferData().otherDetails.line2,self.paymentTransferData().otherDetails.line3,self.paymentTransferData().otherDetails.line4] : [self.paymentTransferData().instructionDetails.otherDetails.line1,self.paymentTransferData().instructionDetails.otherDetails.line2,self.paymentTransferData().instructionDetails.otherDetails.line3,self.paymentTransferData().instructionDetails.otherDetails.line4]
                    }]
                ] : []);
            } else if (self.payeeDetails.domesticPayeeType === "SEPA") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferto,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.sepaDomesticPayee.accountName : self.paymentTransferData().payeeDetails.sepaDomesticPayee.accountName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: getAmountValues("amount"),
                            currency: getAmountValues("currency"),
                            isCurrency: true
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails.sepaDomesticPayee.accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.accdomestic
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeDetails.sepaDomesticPayee.bankDetails.code,
                                self.payeeDetails.sepaDomesticPayee.bankDetails.name,
                                self.payeeDetails.sepaDomesticPayee.bankDetails.city,
                                self.payeeDetails.sepaDomesticPayee.bankDetails.country
                            ]
                        },
                        {
                            label: self.payments.payee.payvia,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.sepaDomesticPayee.network ? self.paymentData().payeeDetails.sepaDomesticPayee.network : self.network() : self.paymentTransferData().payeeDetails.sepaDomesticPayee.network ? self.paymentTransferData().payeeDetails.sepaDomesticPayee.network : self.paymentData().payoutDetails.instructionDetails.network
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: self.paymentTransferData().valueDate ? self.paymentTransferData().valueDate : self.paymentTransferData().instructionDetails.startDate,
                            isDate: true
                        }
                    ]
                ];
            }
        }

        function getInternationalConfirmScreen() {
            confirmScreenDetailsArray = [
                [{
                        label: self.payments.moneytransfer.transferto,
                        value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.accountName : self.paymentTransferData().payeeDetails.accountName
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: self.paymentTransferData().amount ? self.paymentTransferData().amount.amount : self.paymentTransferData().instructionDetails.amount.amount,
                        currency: self.paymentTransferData().amount ? self.paymentTransferData().amount.currency : self.paymentTransferData().instructionDetails.amount.currency,
                        isCurrency: true
                    }
                ],
                [{
                        label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                        value: self.payeeDetails.accountNumber
                    },
                    {
                        label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                        value: self.payments.payee.accinternational
                    }
                ],
                [{
                        label: self.payments.payee.codetype[self.paymentData().payeeDetails.bankDetails.codeType],
                        value: [
                            self.payeeDetails.bankDetails.code,
                            self.payeeDetails.bankDetails.name,
                            self.payeeDetails.bankDetails.city,
                            self.payeeDetails.bankDetails.address,
                            self.countriesMap[self.payeeDetails.bankDetails.country] ? self.countriesMap[self.payeeDetails.bankDetails.country] : self.payeeDetails.bankDetails.country
                        ]
                    },
                    {
                        label: self.payments.moneytransfer.paymentdetails,
                        value: self.paymentTransferData().otherDetails ? [self.paymentTransferData().otherDetails.line1,self.paymentTransferData().otherDetails.line2,self.paymentTransferData().otherDetails.line3,self.paymentTransferData().otherDetails.line4] : [self.paymentTransferData().instructionDetails.otherDetails.line1,self.paymentTransferData().instructionDetails.otherDetails.line2,self.paymentTransferData().instructionDetails.otherDetails.line3,self.paymentTransferData().instructionDetails.otherDetails.line4]
                    }
                ],
                [{
                        label: self.payments.moneytransfer.transferfrom,
                        value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                    },
                    {
                        label: self.payments.moneytransfer.transferon,
                        value: self.paymentTransferData().valueDate ? self.paymentTransferData().valueDate : self.paymentTransferData().instructionDetails.startDate,
                        isDate: true
                    }
                ],
                [{
                    label: self.payments.payee.payvia,
                    value: self.payments.payee.codetype[self.paymentData().payeeDetails.bankDetails.codeType]
                }]
            ].concat(self.payeeDetails.intermediaryBankDetails ? [
                    [{
                        label: self.payments.moneytransfer.internationalPayee.intermediatoryBankDetails,
                        value: intermediaryBankNetwork === "SPE" ? [self.payeeDetails.intermediaryBankDetails.name, self.payeeDetails.intermediaryBankDetails.address, self.payeeDetails.intermediaryBankDetails.city, self.payeeDetails.intermediaryBankDetails.country] : [self.payeeDetails.intermediaryBankDetails.code, self.payeeDetails.intermediaryBankDetails.name, self.payeeDetails.intermediaryBankDetails.city, self.payeeDetails.intermediaryBankDetails.country]
                    }]
                ] : []).concat(self.payeeDetails.address.line1 || self.payeeDetails.address.line2 || self.payeeDetails.address.city || self.payeeDetails.address.country ? [
                    [{
                        label: self.payments.payee.international.payeeDetails,
                        value: [self.payeeDetails.address.line1,self.payeeDetails.address.line2,self.payeeDetails.address.city,self.payeeCountryDescription()]
                    }]
                ] : []);
        }

        function setTypeOfAccount(type, payeeDTO) {
            if (type === "INDIADOMESTICFT") {
                return ReviewAdhocPaymentModel.getPayeeAccountType("INDIA").then(function(typeOfAccountData) {
                    self.typeOfAccountDescription(ko.utils.arrayFirst(typeOfAccountData.enumRepresentations[0].data, function(element) {
                        return element.code === payeeDTO.indiaDomesticPayee.accountType;
                    }).description);
                });
            }
        }

        function getDomesticData(data) {
            self.corpPSheader = Params.baseModel.format(self.payments.moneytransfer.corpheader, {
                transaction: self.payments.payee.accdomestic
            });

            const details = data.domesticPayoutReadResponse ? data.domesticPayoutReadResponse : data.domesticPayoutInstructionReadResponse ? data.domesticPayoutInstructionReadResponse : data;

            if (details) {
                self.valueDate(details.payoutDetails.valueDate);
            } else if (data.domesticPayoutInstructionReadResponse) {
                self.valueDate(data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.startDate);
            }

            self.paymentTemplate("review-payment-domestic");
            self.payeeTemplate("review-domestic-payee");

            if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "INDIADOMESTICFT_PAYLATER") {
                self.domesticPayeeType("INDIA");
            } else if (data.paymentType === "UKPAYMENTS" || data.paymentType === "UKPAYMENTS_PAYLATER") {
                self.domesticPayeeType("UK");
            } else if (data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT" || data.paymentType === "SEPACREDITTRANSFER_PAYLATER" || data.paymentType === "SEPACARDPAYMENT_PAYLATER") {
                self.domesticPayeeType("SEPA");
            }

            taskCode = "PC_F_DOM";

            if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "UKPAYMENTS" || data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT") {
                self.paymentData(details);
                self.purpose(details.payoutDetails.purpose);

                if (self.purpose() === "OTH") {
                    self.purposeText(details.payoutDetails.purposeText);
                }

                self.paymentTransferData(details.payoutDetails);
            } else {
                self.paymentData(data.domesticPayoutInstructionReadResponse);
                self.purpose(data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.purpose);

                if (self.purpose() === "OTH") {
                    self.purposeText(data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.purposeText);
                }

                self.paymentTransferData(data.domesticPayoutInstructionReadResponse.payoutDetails);
            }

            const payeeDetails = data.payeeReadResponse ? data.payeeReadResponse.payeeDTO : data.payeeDetails ? data.payeeDetails : null;

            self.payeeDetails = payeeDetails;

            if (Params.payeeDetails) {
                Params.payeeDetails(data.payeeReadResponse.payeeDTO);
            }

            if(self.domesticPayeeType()==="UK"){
                self.ukNetworkType(data.payeeReadResponse.payeeDTO.ukDomesticPayee.paymentType);
            }

            if (self.purpose() !== "OTH") {
                self.getPurposeText();
            } else {
                self.dataLoaded(true);
            }
        }

        function setConfirmScreenExtensions() {
            if (typeof self.confirmScreenDetails === "function") {
                self.confirmScreenDetails(confirmScreenDetailsArray);
            } else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: taskCode,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/payments-template",
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus
                });
            }
        }

         function setCountryMap(data){
          for (let j = 0; j < data.enumRepresentations[0].data.length; j++) {
        self.countriesMap[data.enumRepresentations[0].data[j].code] = data.enumRepresentations[0].data[j].description;
      }
        }

        self.noteInternational = ko.observable();

        function setNote(data){
          let codeDescription;

            if(self.paymentTransferData().instructionDetails){

                 codeDescription = ko.utils.arrayFirst(data.enumRepresentations[0].data, function(config) {
                                    return config.code === self.paymentData().payoutDetails.instructionDetails.remarks.split("/")[1];
                                }).description;

                self.noteInternational([codeDescription , self.paymentData().payoutDetails.instructionDetails.remarks.split("/")[2]]);
            }
            else{
                codeDescription = ko.utils.arrayFirst(data.enumRepresentations[0].data, function(config) {
                                    return config.code === self.paymentData().payoutDetails.remarks.split("/")[1];
                                }).description;

                self.noteInternational([codeDescription , self.paymentData().payoutDetails.remarks.split("/")[2]]);
            }
        }

        function setIntermediaryBankDetails(){
            if(self.paymentTransferData().intermediaryBankNetwork){
            intermediaryBankNetwork = self.paymentTransferData().intermediaryBankNetwork;

            if (intermediaryBankNetwork === "SWI")
                {intermediaryBankDetailsPromise = ReviewAdhocPaymentModel.getBankDetailsBIC(self.paymentTransferData().intermediaryBankDetails.code);}
            else if (intermediaryBankNetwork === "NAC")
                {intermediaryBankDetailsPromise = ReviewAdhocPaymentModel.getBankDetailsNCC(self.paymentTransferData().intermediaryBankDetails.code);}
            else if (intermediaryBankNetwork === "SPE"){
                self.payeeDetails.intermediaryBankDetails = self.paymentTransferData().intermediaryBankDetails;
                intermediaryBankDetailsPromise =Promise.resolve();
            }
        }
        else if(self.paymentTransferData().instructionDetails && self.paymentTransferData().instructionDetails.intermediaryBankNetwork){
            intermediaryBankNetwork = self.paymentTransferData().instructionDetails.intermediaryBankNetwork;

            if (intermediaryBankNetwork === "SWI")
                {intermediaryBankDetailsPromise = ReviewAdhocPaymentModel.getBankDetailsBIC(self.paymentTransferData().instructionDetails.intermediaryBankDetails.code);}
            else if (intermediaryBankNetwork === "NAC")
                {intermediaryBankDetailsPromise = ReviewAdhocPaymentModel.getBankDetailsNCC(self.paymentTransferData().instructionDetails.intermediaryBankDetails.code);}
            else if (intermediaryBankNetwork === "SPE"){
                self.payeeDetails.intermediaryBankDetails = self.paymentTransferData().instructionDetails.intermediaryBankDetails;
                intermediaryBankDetailsPromise =Promise.resolve();
            }

        }
        else
            {intermediaryBankDetailsPromise =Promise.resolve();}
        }

        ReviewAdhocPaymentModel.readAdhocPayment(self.paymentId, self.typeofPayment, self.payeeStatus).done(function(data) {
            if (data !== null) {
                self.paymentType(data.paymentType);

                let paymentType, transactionAmount, transactionCurrency, debitAccountId, networkType;

                if (data.paymentType === "INTERNATIONALFT" || data.paymentType === "INTERNATIONALFT_PAYLATER") {
                    paymentType = "INTERNATIONALFT";

                    self.corpPSheader = Params.baseModel.format(self.payments.moneytransfer.corpheader, {
                        transaction: self.payments.payee.accinternational
                    });

                    self.paymentTemplate("review-payment-international");
                    self.payeeTemplate("review-international-payee");
                    taskCode = "PC_F_IT";

                    if (data.paymentType === "INTERNATIONALFT") {
                        transactionAmount = data.internationalPayoutReadResponse.payoutDetails.amount.amount;
                        transactionCurrency = data.internationalPayoutReadResponse.payoutDetails.amount.currency;
                        debitAccountId = data.internationalPayoutReadResponse.payoutDetails.debitAccountId.value;
                        self.paymentData(data.internationalPayoutReadResponse);
                        self.charges(data.internationalPayoutReadResponse.payoutDetails.charges);
                        self.paymentTransferData(data.internationalPayoutReadResponse.payoutDetails);
                    } else {
                        transactionAmount = data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.amount;
                        transactionCurrency = data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.currency;
                        debitAccountId = data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.debitAccountId.value;
                        self.paymentData(data.internationalPayoutInstructionReadResponse);
                        self.charges(data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.charges);
                        self.paymentTransferData(data.internationalPayoutInstructionReadResponse.payoutDetails);
                    }

                    self.payeeDetails = data.payeeReadResponse.payeeDTO;

                    if (Params.payeeDetails) {
                        Params.payeeDetails(data.payeeReadResponse.payeeDTO);
                    }

                    setIntermediaryBankDetails();

                    networkType = data.payeeReadResponse.payeeDTO.network;
                    self.network(data.payeeReadResponse.payeeDTO.network);

                    Promise.all([intermediaryBankDetailsPromise,ReviewAdhocPaymentModel.getCountries() ,ReviewAdhocPaymentModel.getRemarks()]).then(function(responseData) {
                      if(responseData[0] && intermediaryBankNetwork && intermediaryBankNetwork!=="SPE"){
                    self.payeeDetails.intermediaryBankDetails = {
                        code: responseData[0].code,
                        name: responseData[0].name,
                        branch: responseData[0].branchName,
                        address: responseData[0].branchAddress.line1,
                        city: responseData[0].branchAddress.city,
                        country: responseData[0].branchAddress.country
                    };
                }

                    setCountryMap(responseData[1]);
                    setNote(responseData[2]);

                    if(self.payeeDetails.address.country){
                        self.payeeCountryDescription(self.countriesMap[self.payeeDetails.address.country]);
                    }

                    self.getChargesDescription();
                    getInternationalConfirmScreen();
                    setConfirmScreenExtensions();
                    });
                } else if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "INDIADOMESTICFT_PAYLATER" || data.paymentType === "UKPAYMENTS" || data.paymentType === "UKPAYMENTS_PAYLATER" || data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT" || data.paymentType === "SEPACREDITTRANSFER_PAYLATER" || data.paymentType === "SEPACARDPAYMENT_PAYLATER") {
                    paymentType = data.paymentType.split("_")[0];

                    if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "UKPAYMENTS" || data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT") {
                        const details = data.domesticPayoutReadResponse ? data.domesticPayoutReadResponse : data;

                        transactionAmount = details.payoutDetails.amount.amount;
                        transactionCurrency = details.payoutDetails.amount.currency;
                        debitAccountId = details.payoutDetails.debitAccountId.value;
                        networkType = details.payoutDetails.network;
                    } else {
                        transactionAmount = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.amount;
                        transactionCurrency = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.currency;
                        debitAccountId = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.debitAccountId.value;
                        networkType = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.network;
                    }

                    const payeeReadResponse = data.payeeReadResponse ? data.payeeReadResponse.payeeDTO : data.payeeDetails ? data.payeeDetails : null;

                    if (payeeReadResponse.indiaDomesticPayee && payeeReadResponse.indiaDomesticPayee.accountType) {
                        payeeReadResponse.indiaDomesticPayee.accountType = payeeReadResponse.indiaDomesticPayee.accountType || self.payeeAccountType;
                    }

                    if (paymentType === "INDIADOMESTICFT") {
                    setTypeOfAccount(paymentType, payeeReadResponse).then(function() {
                        getDomesticData(data);
                        getDomesticConfirmScreen();
                        setConfirmScreenExtensions();
                    });
                  }else{
                    getDomesticData(data);
                    getDomesticConfirmScreen();
                    setConfirmScreenExtensions();
                  }
                } else if (data.paymentType === "INTERNALFT" || data.paymentType === "INTERNALFT_PAYLATER") {
                    self.checkforInternal(data);
                }

                if (data.paymentType !== "INTERNALFT" && data.paymentType !== "INTERNALFT_PAYLATER") {
                    ReviewAdhocPaymentModel.getChargesMaintenances().then(function(maintenanceRespnse) {
                        let checkServiceChargesEnabled, s = 0;

                        if (Params.dashboard.appData.segment === "RETAIL") {
                            for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                                checkServiceChargesEnabled = ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function(config) {
                                    return config.propertyId === "RETAIL_SERVICE_CHARGES_ENABLED";
                                }).propertyValue === "Y";
                            }
                        } else if (Params.dashboard.appData.segment === "CORP") {
                            for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                                checkServiceChargesEnabled = ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function(config) {
                                    return config.propertyId === "CORPORATE_SERVICE_CHARGES_ENABLED";
                                }).propertyValue === "Y";
                            }
                        }

                        if (checkServiceChargesEnabled) {
                            serviceCharges({
                                paymentType: paymentType,
                                transactionAmount: transactionAmount,
                                transactionCurrency: transactionCurrency,
                                debitAccountId: debitAccountId,
                                network: networkType
                            });
                        }
                    });

                    setConfirmScreenExtensions();
                }
            }
        });

        self.checkforInternal = function(data) {
            self.corpPSheader = Params.baseModel.format(self.payments.moneytransfer.corpheader, {
                transaction: self.payments.payee.accinternal
            });

            self.paymentTemplate("review-payment-internal");
            self.payeeTemplate("review-internal-payee");
            taskCode = "PC_F_INTRNL";

            if (data.paymentType === "INTERNALFT") {
                const details = data.internalTransferReadResponse ? data.internalTransferReadResponse : data;

                self.paymentData(details);
                self.purpose(details.transferDetails.purpose);

                if (self.purpose() === "OTH") {
                    self.purposeText(details.transferDetails.purposeText);
                }

                self.paymentTransferData(details.transferDetails);
            } else {
                self.paymentData(data.internalTransferInstructionReadResponse);
                self.purpose(data.internalTransferInstructionReadResponse.transferDetails.instructionDetails.purpose);

                if (self.purpose() === "OTH") {
                    self.purposeText(data.internalTransferInstructionReadResponse.transferDetails.instructionDetails.purposeText);
                }

                self.paymentTransferData(data.internalTransferInstructionReadResponse.transferDetails);
            }

            if (data.payeeReadResponse && data.payeeReadResponse.payeeDTO) {
                self.branchName(data.payeeReadResponse.payeeDTO.branchCode);
            }

            self.payeeDetails = data.payeeReadResponse ? data.payeeReadResponse.payeeDTO : data.payeeDetails ? data.payeeDetails : null;

            if (Params.payeeDetails) {
                Params.payeeDetails(data.payeeReadResponse.payeeDTO);
            }

            if (self.purpose() !== "OTH") {
                self.getPurposeText();
            } else {
                self.dataLoaded(true);
            }

            getinternalConfirmScreen();
            setConfirmScreenExtensions();
        };

        self.getChargesDescription = function() {
            ReviewAdhocPaymentModel.getCharges().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.charges() === data.enumRepresentations[0].data[i].code) {
                            self.chargesDescription(data.enumRepresentations[0].data[i].description);
                            break;
                        }
                    }
                }

                self.dataLoaded(true);
            });
        };

        self.getPurposeText = function() {
            ReviewAdhocPaymentModel.getTransferPurpose(self.paymentType()).done(function(data) {
                if (data.linkageList.length > 0) {
                    for (let i = 0; i < data.linkageList[0].purposeList.length; i++) {
                        self.transactionPurposeList.push({
                            text: data.linkageList[0].purposeList[i].description,
                            value: data.linkageList[0].purposeList[i].code
                        });

                        if (self.purpose() === data.linkageList[0].purposeList[i].code) {
                            self.purposeText(data.linkageList[0].purposeList[i].description);
                            break;
                        }
                    }
                }

                self.dataLoaded(true);
            });
        };
    };
});
