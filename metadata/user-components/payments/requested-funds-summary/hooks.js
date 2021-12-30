define([
    "./model",
    "knockout",
    "jquery",
    "ojs/ojcore"
], function (Model, ko, $, oj) {
    "use strict";

    return function () {
        let self,
         params;

                function instructionspayinsgetCall(payerName, payeeName, payerPartyId, payeePartyId, payload, config) {
            return Model.instructionspayinsget(payerName, payeeName, payerPartyId, payeePartyId, payload, config);
        }

                function instructionspayinsidputCall(id, payload, config) {
            return Model.instructionspayinsidput(id, payload, config);
        }

                function instructionspayinsreminderpostCall(payload, config) {
            return Model.instructionspayinsreminderpost(payload, config);
        }

                function walletstransferpaymentIdpatchCall(paymentId, payload, config) {
            return Model.walletstransferpaymentIdpatch(paymentId, payload, config);
        }

                function accountsdemandDepositgetCall(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config) {
            return Model.accountsdemandDepositget(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config);
        }

                function walletstransferpostCall(payload, config) {
            return Model.walletstransferpost(payload, config);
        }

                function MoneyTransfer78ValueChangeHook(newValue) {
            self.value = ko.observable();
            self.value = newValue;

            if (newValue === "sendMoney") {
                self.showSendMoneyTableDetails(true);
                self.showReceivedMoneyTableDetails(false);
            } else {
                self.showReceivedMoneyTableDetails(true);
                self.showSendMoneyTableDetails(false);
            }
        }

                function onClickSendReminder47(_event, data) {
            self.sendReminderDetails = data;
            $("#sendReminderModalWindow").trigger("openModal");

            oj.Context.getContext(document.querySelector("#sendReminderModalWindow")).getBusyContext().whenReady().then(function () {
                self.sendReminderToAmount(data.amount);
                self.sendReminderPayeeName(data.payerName);
                self.currency(data.currency);
            });

            self.displayModalWindow(true);
        }

                function onClickOk90(_event, data) {
            self.modelInstance.instructionspayinsreminderpostv1payload.amount.amount = self.sendReminderDetails.amount;
            self.modelInstance.instructionspayinsreminderpostv1payload.payeeName = self.sendReminderDetails.payee;
            self.modelInstance.instructionspayinsreminderpostv1payload.payerName = self.sendReminderDetails.payerName;
            self.modelInstance.instructionspayinsreminderpostv1payload.id = self.sendReminderDetails.id;
            self.modelInstance.instructionspayinsreminderpostv1payload.mobileNumber = self.sendReminderDetails.mobileNumber;
            self.modelInstance.instructionspayinsreminderpostv1payload.creationDate = self.sendReminderDetails.creationDate;
            self.modelInstance.instructionspayinsreminderpostv1payload.expiryDate = self.sendReminderDetails.expiryDate;

            instructionspayinsreminderpostCall(ko.toJSON(self.modelInstance.instructionspayinsreminderpostv1payload), null).then(function (data) {
                if (data) {
                    $("#sendReminderModalWindow").trigger("closeModal");
                }
            });
        }

                function onClickCancel30() {
            $("#sendReminderModalWindow").trigger("closeModal");
        }

                function onClickYes43(_event, data) {
            self.declinedStatus = ko.observable("Request declined successfully");
            self.declineRequestId = self.declinePayeeRequestDetails()[0].id;

            self.confirmScreenDetailsArray = [[{
                        label: self.nls.Amount,
                        value: self.declinePayeeRequestDetails()[0].amount,
                        currency: self.declinePayeeRequestDetails()[0].currency,
                        isCurrency: true
                    }]];

            self.modelInstance.instructionspayinsidputv1payload.requestStatus = "DEC";

            instructionspayinsidputCall(self.declineRequestId, ko.toJSON(self.modelInstance.instructionspayinsidputv1payload), null).then(function (data) {
                if (data) {
                    params.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.nls.componentHeader,
                        confirmationType: {
                            version: "v1",
                            name: null
                        },
                        confirmScreenExtensions: {
                            isSet: true,
                            successMessage: self.declinedStatus(),
                            confirmScreenDetails: self.confirmScreenDetailsArray,
                            template: "confirm-screen/payments-template"
                        }
                    });
                }
            });
        }

                function onClickNo45() {
            $("#declineModalWindow").trigger("closeModal");
        }

                function onClickPay60(_event, data) {
            self.userPayeeDetails = data;
            $("#payModalWindow").trigger("openModal");

            oj.Context.getContext(document.querySelector("#payModalWindow")).getBusyContext().whenReady().then(function () {
                self.amountToPay(data.amount);
                self.payToPayee(data.payee);
            });

            self.displayModalWindow(true);
        }

                function onClickDecline5(_event, data) {
            self.declinePayeeRequestDetails().push({
                amount: data.amount,
                creationDate: data.creationDate,
                status: data.requestStatus,
                expiryDate: data.expiryDate,
                note: data.note,
                payee: data.payee,
                id: data.id,
                currency: data.currency
            });

            $("#declineModalWindow").trigger("openModal");

            oj.Context.getContext(document.querySelector("#declineModalWindow")).getBusyContext().whenReady().then(function () {
                self.amountToDecline(data.amount);
                self.declinePayeeName(data.payee);
            });

            self.displayModalWindow(true);
        }

                function onClickYes93(_event, data) {
            self.modelInstance.walletstransferpostv1payload.party.displayValue = self.userPayeeDetails.payeePartyIdDisplayValue;
            self.modelInstance.walletstransferpostv1payload.party.value = self.userPayeeDetails.payeePartyIdValue;
            self.modelInstance.walletstransferpostv1payload.amount.amount = self.userPayeeDetails.amount;
            self.modelInstance.walletstransferpostv1payload.amount.currency = self.userPayeeDetails.currency;

            if (self.accountsdemandDepositgetVar()) {
                for (let i = 0; i < self.accountsdemandDepositgetVar().accounts.length; i++) {
                    if (self.accountsdemandDepositgetVar().accounts[i].productDTO && self.accountsdemandDepositgetVar().accounts[i].productDTO.productId === "WALLET") {
                        self.modelInstance.walletstransferpostv1payload.debitAccount.value = self.accountsdemandDepositgetVar().accounts[i].id.value;
                        self.modelInstance.walletstransferpostv1payload.debitAccount.displayValue = self.accountsdemandDepositgetVar().accounts[i].id.displayValue;
                    }
                }
            }

            self.payID = "";

            walletstransferpostCall(ko.toJSON(self.modelInstance.walletstransferpostv1payload), null).then(function (data) {
                if (data) {
                    self.payID = data.paymentId;
                }
            }).then(function (data) {
                walletstransferpaymentIdpatchCall(self.payID).then(function (data) {
                    if (data) {
                        self.modelInstance.instructionspayinsidputv1payload.requestStatus = "COM";
                    }
                }).then(function (data) {
                    instructionspayinsidputCall(self.userPayeeDetails.id, ko.toJSON(self.modelInstance.instructionspayinsidputv1payload), null).then(function (data) {
                        if (data) {
                            params.dashboard.loadComponent("confirm-screen", {
                                transactionResponse: data,
                                transactionName: self.nls.componentHeader,
                                confirmationType: {
                                    version: "v1",
                                    name: null
                                },
                                confirmScreenExtensions: {
                                    isSet: true,
                                    confirmScreenDetails: self.confirmScreenDetailsArray,
                                    template: "confirm-screen/payments-template"
                                }
                            });
                        }
                    });
                });
            });
        }

                function onClickNo74() {
            $("#payModalWindow").trigger("closeModal");
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            self.requestedFundSummaryDetails = ko.observable();
            self.receivedRequest = ko.observable();
            self.sendMoney = ko.observable();
            self.moneyTransfer = ko.observable("ReceivedMoney");
            params.baseModel.registerElement("confirm-requested-funds-summary", "payments");
            self.ReceivedMoneyTable = ko.observable();
            self.SendMoneyTable = ko.observable();
            self.showReceivedMoneyTableDetails = ko.observable(true);
            self.showSendMoneyTableDetails = ko.observable(false);
            self.dataSource = ko.observable();
            self.receivedMoneyFundsRequest = ko.observableArray();
            self.sendMoneyRequestDetails = ko.observableArray();
            self.actionStatusInitaited = ko.observable();
            self.actionStatusCompleted = ko.observable(false);
            self.payeeName = ko.observable(params.dashboard.userData.userProfile.userName);
            self.payerName = ko.observable(params.dashboard.userData.userProfile.userName);
            self.displayTableReceivedData = ko.observable(false);
            self.displayTableSentData = ko.observable(false);
            self.amount = ko.observable();
            self.declinePayeeRequestDetails = ko.observableArray([]);
            self.sendReminderDetails = ko.observable();
            self.userPayeeDetails = ko.observable();
            self.declinePayeeName = ko.observable();
            self.sendReminderToAmount = ko.observable();
            self.displayModalWindow = ko.observable(false);
            self.currentDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(rootParams.baseModel.getDate().getTime())));
            self.selectionModeRow = "none";
            self.dpn = ko.observable(false);
            self.sendMoneyLabel = ko.observable("Send Money");
            self.requestMoneyLabel = ko.observable("Request Money");
            self.sendReminderPayeeName = ko.observable();
            self.amountToPay = ko.observable();
            self.amountToDecline = ko.observable();
            self.payToPayee = ko.observable();
            self.currency = ko.observable();

            self.columnArray = [
                {
                    headerText: self.nls.requestDate,
                    field: "creationDate",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.fundsRequestedTo,
                    field: "payerName",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.Amount,
                    field: "amount",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.ExpiryDate,
                    field: "expiryDate",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.Remarks,
                    field: "note",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.Action,
                    field: "status",
                    sortable: "enabled"
                }
            ];

            self.columnArrayReceived = [
                {
                    headerText: self.nls.requestDate,
                    field: "creationDate",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.FundsRequestedFrom,
                    field: "payee",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.Amount,
                    field: "amount",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.ExpiryDate,
                    field: "expiryDate",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.Remarks,
                    field: "note",
                    sortable: "enabled"
                },
                {
                    headerText: self.nls.Action,
                    field: "status",
                    sortable: "enabled"
                }
            ];

            instructionspayinsgetCall(self.payerName(), self.instructionspayinsgetpayeeName(), self.instructionspayinsgetpayerPartyId(), self.instructionspayinsgetpayeePartyId()).then(function (response) {
                if (response) {
                    if (response.payIns) {
                        for (let i = 0; i < response.payIns.length; i++) {
                            if (response.payIns[i].requestStatus === "DEC") {
                                response.payIns[i].requestStatus = "Declined";
                            }

                            if (response.payIns[i].requestStatus === "COM") {
                                response.payIns[i].requestStatus = "Paid";
                            }

                            if (oj.IntlConverterUtils.dateToLocalIso(new Date(response.payIns[i].expiryDate).getTime()) < self.currentDate()) {
                                response.payIns[i].requestStatus = "Expired";
                            }

                            self.receivedMoneyFundsRequest().push({
                                amount: response.payIns[i].amount.amount,
                                creationDate: response.payIns[i].creationDate,
                                status: response.payIns[i].requestStatus,
                                expiryDate: response.payIns[i].expiryDate,
                                note: response.payIns[i].note,
                                payee: response.payIns[i].payeeName,
                                id: response.payIns[i].id,
                                initiatedAction: response.payIns[i].requestStatus,
                                currency: response.payIns[i].amount.currency,
                                mobileNumber: response.payIns[i].mobileNumber,
                                payerName: response.payIns[i].payerName,
                                payeePartyIdDisplayValue: response.payIns[i].payeePartyId.displayValue,
                                payeePartyIdValue: response.payIns[i].payeePartyId.value
                            });
                        }

                        self.displayTableReceivedData(true);
                    }
                }

                self.instructionspayinsgetVar(response);
            });

            instructionspayinsgetCall(self.instructionspayinsgetpayerName(), self.payeeName(), self.instructionspayinsgetpayerPartyId(), self.instructionspayinsgetpayeePartyId()).then(function (response) {
                if (response) {
                    if (response.payIns) {
                        for (let i = 0; i < response.payIns.length; i++) {
                            if (response.payIns[i].requestStatus === "DEC") {
                                response.payIns[i].requestStatus = "Rejected";
                            }

                            if (response.payIns[i].requestStatus === "COM") {
                                response.payIns[i].requestStatus = "Received";
                            }

                            self.sendMoneyRequestDetails().push({
                                amount: response.payIns[i].amount.amount,
                                creationDate: response.payIns[i].creationDate,
                                status: response.payIns[i].requestStatus,
                                expiryDate: response.payIns[i].expiryDate,
                                note: response.payIns[i].note,
                                payee: response.payIns[i].payeeName,
                                id: response.payIns[i].id,
                                sendReminder: response.payIns[i].requestStatus,
                                currency: response.payIns[i].amount.currency,
                                payerName: response.payIns[i].payerName
                            });
                        }

                        self.displayTableSentData(true);
                    }
                }

                self.instructionspayinsgetVar(response);
            });

            accountsdemandDepositgetCall(self.accountsdemandDepositgetstatus(), self.accountsdemandDepositgettaskCode(), self.accountsdemandDepositgetmodule(), self.accountsdemandDepositgetexpand(), self.accountsdemandDepositgetexcludeBaseCurrency(), self.accountsdemandDepositgetlmEnabled(), self.accountsdemandDepositgetaccountCurrency(), self.accountsdemandDepositgetproductType(), self.accountsdemandDepositgetaccountType()).then(function (response) {
                self.accountsdemandDepositgetVar(response);
            });

            return true;
        }

        return {
            instructionspayinsgetCall: instructionspayinsgetCall,
            instructionspayinsidputCall: instructionspayinsidputCall,
            instructionspayinsreminderpostCall: instructionspayinsreminderpostCall,
            walletstransferpaymentIdpatchCall: walletstransferpaymentIdpatchCall,
            accountsdemandDepositgetCall: accountsdemandDepositgetCall,
            walletstransferpostCall: walletstransferpostCall,
            MoneyTransfer78ValueChangeHook: MoneyTransfer78ValueChangeHook,
            onClickSendReminder47: onClickSendReminder47,
            onClickOk90: onClickOk90,
            onClickCancel30: onClickCancel30,
            onClickYes43: onClickYes43,
            onClickNo45: onClickNo45,
            onClickPay60: onClickPay60,
            onClickDecline5: onClickDecline5,
            onClickYes93: onClickYes93,
            onClickNo74: onClickNo74,
            init: init
        };
    };
});