define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payee-list",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojtabs",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist",
    "ojs/ojavatar",
    "ojs/ojpagingcontrol"
], function(oj, ko, $, BeneficiaryDetailsModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            batchRequest = {
                batchDetailRequestList: []
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.payments = resourceBundle;
        self.beneficiaryName = ko.observable();
        self.accType = ko.observable();
        self.accDetails = ko.observable();
        self.createdBy = ko.observable();
        self.availableFor = ko.observable();
        self.payeeList = ko.observableArray();
        self.ddList = ko.observableArray();
        self.subPayees = ko.observableArray();
        self.isSubPayeeLoaded = ko.observable(false);
        self.payeeGroupImage = ko.observable();
        self.payeeName = ko.observableArray();
        self.type = ko.observable();
        self.payeeAccountTypeList = ko.observableArray([]);
        rootParams.dashboard.headerName(self.payments.beneficiaryDetails.labels.title);
        self.accountListDetailsDataSource = ko.observable();
        rootParams.baseModel.registerElement(["action-header", "search-box", "nav-bar", "modal-window", "internal-account-input"]);
        self.dataSourceCreated = ko.observable(false);
        self.menuLoaded = ko.observable(false);
        self.highlightedTab = ko.observable("accounts");
        self.accountsTable = ko.observable(true);
        self.demandDraftTable = ko.observable(false);
        self.choiseBoxOpened = ko.observable(false);
        self.avatarSize = ko.observable("xs");
        self.contentIdMap = ko.observable({});

        const categories = [
            "accounts",
            "dd"
        ];

        function getAccountTypeDescription(code) {
            return ko.utils.arrayFirst(self.payeeAccountTypeList(), function(element) {
                return element.code === code;
            }).description;
        }

        self.type(categories[0]);
        self.menuSelection = ko.observable("accounts");
        self.menuCountOptions = ko.observableArray();

        for (let j = 0; j < categories.length; j++) {
            self.menuCountOptions.push({
                id: categories[j],
                label: self.payments.payee[categories[j]]
            });
        }

        self.radioPayeeHandler = function(event) {
            if (event.detail.value !== event.detail.previousValue) {
                self.menuSelection(self.type());
            }
        };

        self.menuLoaded(true);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.showModule = function(module) {
            self.menuSelection(module.value);
        };

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        BeneficiaryDetailsModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        });

        function loadBatchImages() {
            BeneficiaryDetailsModel.batchRead(batchRequest).done(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                self.dataSourceCreated(false);

                self.accountListDetailsDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subPayees(), {
                    idAttribute: ["name"]
                }));

                ko.tasks.runEarly();
                self.dataSourceCreated(true);
            });
        }

        function loadBatchRequest(id) {
            batchRequest.batchDetailRequestList.push({
                methodType: "GET",
                uri: {
                    value: "/contents/{id}",
                    params: {
                        id: id
                    }
                },
                headers: {
                    "Content-Id": batchRequest.batchDetailRequestList.length + 1,
                    "Content-Type": "application/json"
                }
            });
        }

        self.fetchPayees = function() {
            batchRequest.batchDetailRequestList = [];
            self.dataSourceCreated(false);
            self.subPayees().length = 0;

            Promise.all([BeneficiaryDetailsModel.getPayeeAccountType(), BeneficiaryDetailsModel.fetchAccountDetails(self.type()), BeneficiaryDetailsModel.getCountries()]).then(function(response) {
                self.payeeAccountTypeList(response[0].enumRepresentations[0].data);

                const enumRepresentations = response[2].enumRepresentations,
                 countryCodeMap = {};

                if (enumRepresentations !== null) {
                    for (let j = 0; j < enumRepresentations[0].data.length; j++) {
                        countryCodeMap[enumRepresentations[0].data[j].code] = enumRepresentations[0].data[j].description;
                    }
                }

                const data = response[1];

                if (data.payeeGroups) {
                    for (let i = 0; i < data.payeeGroups.length; i++) {
                        const payee = data.payeeGroups[i].listPayees[0];
                        let bankName = "",
                            demandDraftPayeeType = null,
                            deliveryMode = null,
                            addressType = null,
                            branchCode = null;
                        const accountType = payee.domesticPayeeType && payee.domesticPayeeType === "INDIA" ? payee.indiaDomesticPayee.accountType : null,
                            payeeDetails = payee.domesticPayeeType ? payee[{
                                INDIA: "indiaDomesticPayee",
                                UK: "ukDomesticPayee",
                                SEPA: "sepaDomesticPayee"
                            }[payee.domesticPayeeType]] : payee;

                        if (payeeDetails.contentId) {
                            loadBatchRequest(payeeDetails.contentId.value);
                            self.contentIdMap()[payeeDetails.contentId.value] = ko.observable();
                        }

                        if (payee.payeeType === "INTERNAL") {
                            bankName = self.payments.payee.internalaccount;
                        } else {
                            branchCode = payeeDetails.bankDetails ? payeeDetails.bankDetails.code : null;
                            bankName = payeeDetails.bankDetails ? payeeDetails.bankDetails.name : null;
                        }

                        if (payeeDetails.demandDraftPayeeType) {
                            demandDraftPayeeType = payeeDetails.demandDraftPayeeType;
                            deliveryMode = payeeDetails.demandDraftDeliveryDTO.deliveryMode;
                            addressType = payeeDetails.demandDraftDeliveryDTO.addressType;
                            branchCode = payeeDetails.demandDraftDeliveryDTO.branch;
                        }

                        const image = demandDraftPayeeType !== null ? "payments/recipients-demand-drafts.svg" : (payeeDetails.transferMode || payeeDetails.transferValue) !== null ? "payments/recipients-mobile-email.svg" : "payments/recipients-accounts.svg";

                        self.subPayees.push({
                            name: data.payeeGroups[i].name,
                            nickName: payee.nickName,
                            accountNumber: payeeDetails.accountNumber,
                            bankName: bankName,
                            bankDetails: payeeDetails.bankDetails,
                            payeeAccessType: self.payments.payee[payeeDetails.payeeAccessType].toUpperCase(),
                            address: (payee.payeeType === "INTERNATIONAL" || payee.payeeType === "DEMANDDRAFT") && payee.address ? payee.address: null,
                            network: payeeDetails.network ? payeeDetails.network : null,
                            payeeType: payee.payeeType,
                            domesticPayeeType: payee.domesticPayeeType,
                            type: payee.payeeType === "DEMANDDRAFT" ? self.payments.payee[payee.payeeType + payee.demandDraftPayeeType] : accountType ? rootParams.baseModel.format(self.payments.payee.typeOfAccount, {
                                payeeAccountType: self.payments.payee[payee.payeeType],
                                accountType: getAccountTypeDescription(accountType)
                            }) : self.payments.payee[payee.payeeType],
                            typeOfAccount: accountType,
                            typeOfAccountDescription: accountType ? getAccountTypeDescription(accountType) : null,
                            payeeAccountTypeList: self.payeeAccountTypeList,
                            accountName: payeeDetails.accountName,
                            demandDraftPayeeType: payeeDetails.demandDraftPayeeType,
                            id: payee.id,
                            groupId: data.payeeGroups[i].groupId,
                            transferMode: payeeDetails.transferMode,
                            transferTo: payeeDetails.transferValue,
                            image: image,
                            payAtCity: payeeDetails.payAtCity,
                            payAtCountry: payeeDetails.payAtCountry,
                            countryCodeMap: countryCodeMap,
                            deliveryMode: deliveryMode,
                            addressType: addressType,
                            branchCode: branchCode,
                            totalPayeeCount: "1",
                            createdBy: payeeDetails.userDetails ? rootParams.baseModel.format(self.payments.payee.creatorName, {
                                firstName: payeeDetails.userDetails.firstName,
                                lastName: payeeDetails.userDetails.lastName
                            }) : "",
                            username: payee.createdBy,
                            contentId: payeeDetails.contentId ? payeeDetails.contentId.value : null,
                            preview: payeeDetails.contentId ? self.contentIdMap()[payeeDetails.contentId.value] : ko.observable(),
                            initials: oj.IntlConverterUtils.getInitials(data.payeeGroups[i].name.split(/\s+/)[0], data.payeeGroups[i].name.split(/\s+/)[1]),
                            paymentType: payeeDetails.paymentType,
                            sepaType: payeeDetails.sepaType,
                            iban: payeeDetails.iban
                        });
                    }
                }

                self.accountListDetailsDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subPayees(), {
                    idAttribute: ["name"]
                }));

                if (batchRequest.batchDetailRequestList.length) {
                    loadBatchImages();
                }

                self.dataSourceCreated(true);
            });
        };

        self.menuSelection.subscribe(function(newValue) {
            if (newValue === "accounts") {
                self.accountsTable(true);
                self.demandDraftTable(false);
            } else {
                self.accountsTable(false);
                self.demandDraftTable(true);
            }

            self.type(newValue);
            self.fetchPayees();
        });

        self.fetchPayees();
        rootParams.baseModel.registerComponent("payee-details", "payee");
        rootParams.baseModel.registerComponent("account-type-dialog", "payee");

        self.openChoiseBox = function() {
            $("#choiseDialog").trigger("openModal");
            self.choiseBoxOpened(true);
        };

        self.accountTypeModalCloseHandler = function() {
            self.choiseBoxOpened(false);
        };

        self.closeModal = function() {
            if (self.choiseBoxOpened()) {
                self.choiseBoxOpened(false);
                $("#choiseDialog").trigger("closeModal");
            }
        };
    };
});