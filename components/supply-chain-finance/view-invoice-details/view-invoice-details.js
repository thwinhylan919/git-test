define([
    "ojL10n!resources/nls/view-invoice-details",
    "./model",
    "jquery",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function (resourceBundle, Model, $, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.invoicegetVar = ko.observable();
        self.invoicegetinvoiceRefNo = ko.observable();
        self.selectedRole = ko.observable();
        params.baseModel.registerElement("modal-window");

        self.showPage = ko.observable(false);
        self.commodityDetails = ko.observable(false);
        self.selectedRole(params.rootModel.params.role);
        self.invoicegetinvoiceRefNo(params.rootModel.params.invoiceNo);
        self.commentsValue = ko.observable();
        self.commodityList = ko.observableArray();
        self.acceptReject = ko.observable();
        self.comments = ko.observable();
        self.selectedInvoices = ko.observableArray();
        self.mepartygetVar = ko.observable();
        self.partyName = ko.observable();
        self.partyId = ko.observable();
        self.status = ko.observable();
        self.finalAddress = ko.observable();
        self.invoiceSearchgetpaymentStatus = ko.observable();
        self.invoiceCreationDate = ko.observable();
        self.invoiceSearchgetinvoiceStatus = ko.observable();
        params.baseModel.registerComponent("invoice-update-form", "supply-chain-finance");
        params.baseModel.registerComponent("preview-invoice-details", "supply-chain-finance");
        params.baseModel.registerComponent("invoice-update-status-review", "supply-chain-finance");
        params.baseModel.registerComponent("view-invoice", "supply-chain-finance");
        params.baseModel.registerComponent("request-finance-review", "supply-chain-finance");
        params.baseModel.registerElement("confirm-screen");

        self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.scf.dto.invoice.InvoiceRejectRequestDTO");

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(self.mepartygetVar().party.id.displayValue);
            self.partyName(self.mepartygetVar().party.personalDetails.fullName);
        });

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? !params.rootModel.previousState.fromEdit ? params.rootModel.previousState.data : getNewKoModel() : getNewKoModel();

        function setAddress(address1, address2, address3, address4, street, country, pin) {
            let address, addressArray;

            if (address1) {
                address = address1;

                if (address2) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(address2);
                }

                if (address3) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(address3);
                }

                if (address4) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(address4);
                }

                if (street) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(street);
                }

                if (country) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(country);
                }

                if (pin) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(pin);
                }

            } else {
                address = "";
            }

            return address;
        }

        self.setStatus = function (invoiceStatus, paymentStatus) {

            if (invoiceStatus !== null) {
                const jsonDataInvStatus = self.nls.AllStatus.InvoiceStatus;

                return jsonDataInvStatus[invoiceStatus] ? jsonDataInvStatus[invoiceStatus] : jsonDataInvStatus.OTHERS;
            }

            if (paymentStatus !== null) {
                const jsonDataPaymentStatus = self.nls.AllStatus.PaymentStatus;

                return jsonDataPaymentStatus[paymentStatus] ? jsonDataPaymentStatus[paymentStatus] : jsonDataPaymentStatus.OTHERS;
            }
        };

        Model.invoiceget(self.invoicegetinvoiceRefNo(), self.selectedRole()).then(function (response) {
            self.invoicegetVar(response.invoice);

            if (self.selectedRole && self.invoicegetVar().invoiceId) {

                let address;

                if (self.selectedRole() === "B" && self.invoicegetVar().supplierAddress) {
                    address = setAddress(self.invoicegetVar().supplierAddress.line1, self.invoicegetVar().supplierAddress.line2, self.invoicegetVar().supplierAddress.city, self.invoicegetVar().supplierAddress.country, self.invoicegetVar().supplierAddress.zipCode);
                } else if (self.selectedRole() === "S" && self.invoicegetVar().associatedParty && self.invoicegetVar().associatedParty.address) {
                    address = setAddress(self.invoicegetVar().associatedParty.address.line1, self.invoicegetVar().associatedParty.address.line2, self.invoicegetVar().associatedParty.address.city, self.invoicegetVar().associatedParty.address.country, self.invoicegetVar().associatedParty.address.zipCode);
                } else {
                    address = "";
                }

                self.finalAddress(address);

                if (self.invoicegetVar().remarks) {
                    self.commentsValue(self.invoicegetVar().remarks);
                } else {
                    self.commentsValue(self.nls.Custom.Comments);
                }

                if (self.invoicegetVar().commodities && self.invoicegetVar().commodities.length > 0) {
                    let i;

                    for (i = 0; i < self.invoicegetVar().commodities.length; i++) {
                        self.commodityList().push({
                            commodityCode: i,
                            name: self.invoicegetVar().commodities[i].name,
                            description: self.invoicegetVar().commodities[i].description,
                            quantity: self.invoicegetVar().commodities[i].quantity,
                            costPerUnit: self.invoicegetVar().commodities[i].costPerUnit,
                            totalCost: self.invoicegetVar().commodities[i].totalCost
                        });
                    }

                    self.commodityDetails(true);
                }

                self.showPage(true);
            }

            self.invoiceSearchgetpaymentStatus(self.setStatus(null, self.invoicegetVar().paymentStatus));
            self.invoiceCreationDate(self.invoicegetVar().invoiceDate);
            self.invoiceSearchgetinvoiceStatus(self.setStatus(self.invoicegetVar().invoiceStatus, null));
        });

        self.goToConfirmScreen = function (data) {
            let transactionName;

            if (self.acceptReject() === "R") {
                transactionName = self.nls.rejectComponentHeader;
            } else {
                transactionName = self.nls.componentHeader;
            }

            params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: transactionName,
                customFields: {
                    resourceBundle: self.nls,
                    additionalData: self,
                    fromDetailView: true,
                    invoiceNumber: data.jsonNode ? data.jsonNode.invoiceNumber : self.invoicegetVar().invoiceNumber ? self.invoicegetVar().invoiceNumber : "",
                    invoiceRefNumber: data.jsonNode ? data.jsonNode.invoiceRefNo : self.invoicegetinvoiceRefNo() ? self.invoicegetinvoiceRefNo() : "",
                    comments: self.comments(),
                    status: self.acceptReject(),
                    overLayTitle: self.acceptReject() === "R" ? self.nls.invoiceReject : self.nls.invoiceCancel
                },
                confirmScreenExtensions: {
                    confirmScreenMsgEval: function (data) {
                        if (self.acceptReject() === "R") {
                            return self.nls.rejectConfirmMessage;
                        }

                        return self.nls.cancelConfirmMessage;
                    },
                    isSet: true,
                    template: "confirm-screen/invoice-accept-reject"
                }
            });
        };

        self.acceptCall = function () {
            return new Promise(function (resolve, reject) {
                Model.acceptPost(self.invoicegetVar().invoiceId, ko.toJSON(ko.mapping.toJS(self.modelInstance.invoiceDetails))).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.cancelCall = function () {
            return new Promise(function (resolve, reject) {
                Model.cancelPost(self.invoicegetVar().invoiceId, ko.toJSON(ko.mapping.toJS(self.modelInstance.invoiceDetails))).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.preview = function () {
            params.dashboard.openRightPanel("preview-invoice-details", {
                invoiceNo: self.invoicegetVar().invoiceNumber,
                role: self.selectedRole(),
                invoiceDetails: self.invoicegetVar(),
                programName: self.invoicegetVar().program.programName,
                partyDetails: self.mepartygetVar()
            }, self.nls.overlayTitle);
        };

        self.rejectCall = function () {
            return new Promise(function (resolve, reject) {
                Model.rejectPost(self.invoicegetVar().invoiceId, ko.toJSON(ko.mapping.toJS(self.modelInstance.invoiceDetails))).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.dataSource28 = new oj.ArrayTableDataSource(self.commodityList, {
            idAttribute: "commodityCode"
        });

        self.onClickNo36 = function () {
            $("#invoice-cancellation").trigger("closeModal");
        };

        self.onClickAccept71 = function () {
            self.acceptReject("A");
            self.modelInstance.invoiceDetails.invoice.invoiceNumber(self.invoicegetVar().invoiceNumber);
            self.modelInstance.invoiceDetails.invoice.acceptanceAmount.amount(self.invoicegetVar().totalAmount.amount);
            self.modelInstance.invoiceDetails.invoice.acceptanceAmount.currency(self.invoicegetVar().totalAmount.currency);
            self.modelInstance.invoiceDetails.invoice.supplierName(self.invoicegetVar().supplierName);
            self.modelInstance.invoiceDetails.invoice.program.programName(self.invoicegetVar().program.programName);
            self.modelInstance.invoiceDetails.invoice.program.role("B");
            self.modelInstance.invoiceDetails.invoice.invoiceDueDate(self.invoicegetVar().invoiceDueDate);
            self.modelInstance.invoiceDetails.invoice.totalAmount.amount(self.invoicegetVar().totalAmount.amount);
            self.modelInstance.invoiceDetails.invoice.totalAmount.currency(self.invoicegetVar().totalAmount.currency);
            self.selectedInvoices.push(self.invoicegetVar());
            params.dashboard.loadComponent("invoice-update-status-review", self);
        };

        self.onClickReject52 = function () {
            self.acceptReject("R");
            $("#invoice-rejection").trigger("openModal");
        };

        self.onClickEdit17 = function () {
            params.dashboard.loadComponent("invoice-update-form", {
                invoiceData: self.invoicegetVar,
                invoiceNo: self.invoicegetinvoiceRefNo,
                selectedRole: self.selectedRole
            });
        };

        self.onClickCancelInvoice62 = function () {
            self.acceptReject("C");
            $("#invoice-cancellation").trigger("openModal");
        };

        self.onClickYes87 = function () {
            $("#invoice-cancellation").trigger("closeModal");
            self.modelInstance.invoiceDetails.invoice.invoiceNumber(self.invoicegetVar().invoiceNumber);
            self.modelInstance.invoiceDetails.invoice.associatedParty.name(self.invoicegetVar().associatedParty.name);
            self.modelInstance.invoiceDetails.invoice.program.programName(self.invoicegetVar().program.programName);
            self.modelInstance.invoiceDetails.invoice.program.role("S");
            self.modelInstance.invoiceDetails.invoice.invoiceDueDate(self.invoicegetVar().invoiceDueDate);
            self.modelInstance.invoiceDetails.invoice.totalAmount.amount(self.invoicegetVar().totalAmount.amount);
            self.modelInstance.invoiceDetails.invoice.totalAmount.currency(self.invoicegetVar().totalAmount.currency);

            self.cancelCall().then(function (invoiceNo, data) {
                self.goToConfirmScreen(invoiceNo, data);
            });
        };

        self.onClickNoReject = function () {
            $("#invoice-rejection").trigger("closeModal");
        };

        self.onClickYesReject = function () {
            const tracker = document.getElementById("reject_tracker");

            if (params.baseModel.showComponentValidationErrors(tracker)) {
                $("#invoice-rejection").trigger("closeModal");
                self.modelInstance.invoiceDetails.invoice.invoiceNumber(self.invoicegetVar().invoiceNumber);
                self.modelInstance.invoiceDetails.invoice.remarks(self.comments());
                self.modelInstance.invoiceDetails.invoice.supplierName(self.invoicegetVar().supplierName);
                self.modelInstance.invoiceDetails.invoice.program.programName(self.invoicegetVar().program.programName);
                self.modelInstance.invoiceDetails.invoice.program.role("B");
                self.modelInstance.invoiceDetails.invoice.invoiceDueDate(self.invoicegetVar().invoiceDueDate);
                self.modelInstance.invoiceDetails.invoice.totalAmount.amount(self.invoicegetVar().totalAmount.amount);
                self.modelInstance.invoiceDetails.invoice.totalAmount.currency(self.invoicegetVar().totalAmount.currency);

                self.rejectCall().then(function (invoiceNo, data) {
                    self.goToConfirmScreen(invoiceNo, data);
                });
            }
        };

        self.onClickRequestFinance = function () {
            self.modelInstance.payLoad.programCode(self.invoicegetVar().program.programCode);
            self.modelInstance.payLoad.counterpartyId(self.invoicegetVar().associatedParty.id.value);
            self.modelInstance.payLoad.role(self.invoicegetVar().program.role);
            self.modelInstance.payLoad.totalAmount.currency(self.invoicegetVar().totalAmount.currency);
            self.modelInstance.payLoad.invoices.push(self.invoicegetVar());

            const amount = Math.min(self.invoicegetVar().outstandingAmount.amount, self.invoicegetVar().acceptanceAmount.amount * self.invoicegetVar().maxFinancePercentage / 100);

            self.modelInstance.payLoad.totalAmount.amount(amount);

            params.dashboard.loadComponent("request-finance-review", {
                data: self.modelInstance,
                fromDetailInvoice: true
            });
        };

        self.onClickCancel16 = function () {
            params.dashboard.switchModule();
        };

        self.onClickBack99 = function () {
            params.dashboard.hideDetails();
        };

        self.downloadInvoice = function () {
            $("#passwordDialog").trigger("openModal");
            Model.downloadInvoice(self.invoicegetinvoiceRefNo(), self.selectedRole());
        };

        self.ok = function () {
            $("#passwordDialog").trigger("closeModal");
        };
    };
});