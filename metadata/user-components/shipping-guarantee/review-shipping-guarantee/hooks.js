define([
    "./model",
    "knockout",
    "ojs/ojcore"
], function (Model, ko, oj) {
    "use strict";

    return function () {
        let self,
         params;

                function mepartyrelationspartyIdgetCall(partyId, payload, config) {
            return Model.mepartyrelationspartyIdget(partyId, payload, config);
        }

                function enumerationscountrygetCall(payload, config) {
            return Model.enumerationscountryget(payload, config);
        }

                function locationscountrycountrycitycitybranchCodegetCall(country, city, payload, config) {
            return Model.locationscountrycountrycitycitybranchCodeget(country, city, payload, config);
        }

                function financialInstitutionbicCodeDetailsBICCodegetCall(BICCode, payload, config) {
            return Model.financialInstitutionbicCodeDetailsBICCodeget(BICCode, payload, config);
        }

                function tradeIncotermsgetCall(q, sortBy, count, payload, config) {
            return Model.tradeIncotermsget(q, sortBy, count, payload, config);
        }

                function productsshippingGuaranteegetCall(paymentType, revolving, payload, config) {
            return Model.productsshippingGuaranteeget(paymentType, revolving, payload, config);
        }

                function shippingGuaranteespostCall(payload, config) {
            return Model.shippingGuaranteespost(payload, config);
        }

                function enumerationstransportationModesgetCall(payload, config) {
            return Model.enumerationstransportationModesget(payload, config);
        }

                function onClickConfirm9() {
            shippingGuaranteespostCall(ko.mapping.toJSON(self.letterOfCreditDetails)).then(function (response) {
                let hostReferenceNumber = null;

                if (response.shippingGuarantee && response.shippingGuarantee.applicationNumber) {
                    hostReferenceNumber = response.shippingGuarantee.applicationNumber;
                } else if (response.shippingGuarantee && response.shippingGuarantee.id) {
                    hostReferenceNumber = response.shippingGuarantee.id;
                } else {
                    hostReferenceNumber = null;
                }

                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: response,
                    hostReferenceNumber: hostReferenceNumber,
                    transactionName: self.resourceBundle.heading.ReviewShippingGuarantee,
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: self.getSuccessMessage,
                        isSet: true,
                        taskCode: "TF_AF_CSG",
                        template: "confirm-screen/trade-finance"
                    }
                });
            });
        }

                function onClickBack44() {
            const parameters = {
                mode: "EDIT",
                letterOfCreditDetails: ko.mapping.toJS(self.letterOfCreditDetails),
                currencyListOptions: params.rootModel.params.currencyListOptions
            };

            params.dashboard.loadComponent("initiate-shipping-guarantee", parameters);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            params.baseModel.registerElement("confirm-screen");
            params.baseModel.registerComponent("attach-documents", "trade-finance");
            params.baseModel.registerComponent("shipping-guarantees", "shipping-guarantee");
            self.letterOfCreditDetails = ko.mapping.toJS(params.rootModel.params.data);
            self.displayLcValue = self.letterOfCreditDetails.letterOfCredit;
            self.mode = ko.observable(params.rootModel.params.mode);
            self.resourceBundle = self.nls;
            self.lcLinkageYes = self.nls.lcLinkageYes;
            self.transactionType = "SHIPPING_GUARANTEE";
            self.multiGoodsSupported = params.rootModel.params.multiGoodsSupported ? params.rootModel.params.multiGoodsSupported : ko.observable(false);
            self.transportationModes = ko.observableArray();
            self.transporationModeDes = ko.observable();

            self.stages = [
                {
                    stageName: self.nls.sgDetails,
                    templateName: "trade-finance/lc-details"
                },
                {
                    stageName: self.nls.shipmentDetailsSG,
                    templateName: "trade-finance/shipment-details"
                },
                {
                    stageName: self.nls.instructions,
                    templateName: "trade-finance/instructions-details"
                },
                {
                    stageName: self.nls.attachments,
                    templateName: "attach-documents"
                }
            ];

            self.attachedDocuments = ko.observableArray();
            self.documentPresentationDays = ko.observable(0);
            self.datasourceForDraftReview = ko.observable();
            self.docList = ko.observableArray();
            self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.docList, { idAttribute: "id" }));
            self.billingDraftsLoaded = ko.observable(false);
            self.creditAvailableWithSelected = ko.observable();
            self.documentsLoaded = ko.observable(false);
            self.autoReinstatement = ko.observable();
            self.clauseTableArrayForReview = [];
            self.clauseModalHeading = ko.observable();
            self.selectedClauses = ko.observable();
            self.beneName = ko.observable();
            self.goodsLists = ko.observableArray();
            self.reviewTransactionName = [];
            self.reviewTransactionName.header = self.resourceBundle.review;
            self.reviewTransactionName.reviewHeader = self.resourceBundle.confirmShippingGuarantee;
            self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists, { idAttribute: "code" });

            self.beneAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };

            self.reviewFlag = ko.observable(true);
            self.dataLoaded = ko.observable(false);
            self.additionalBankDetails = params.rootModel.params.additionalBankDetails ? params.rootModel.params.additionalBankDetails : ko.observable();
            self.availableWithDetails = ko.observable();
            self.applicantName = ko.observable();

            self.applicantAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };

            self.dropdownLabels = params.rootModel.params.dropdownLabels ? params.rootModel.params.dropdownLabels : ko.observable();

            if (self.mode() === "approval") {
                self.dropdownLabels = {
                    branch: ko.observable(),
                    country: ko.observable(),
                    product: ko.observable(),
                    incoterm: ko.observable(),
                    baseDateDescription: ko.observable()
                };
            }

            self.docTblColumns = null;

            if (params.baseModel.large()) {
                self.docTblColumns = [
                    { headerText: self.nls.docName },
                    { headerText: self.nls.original },
                    { headerText: self.nls.copies }
                ];
            } else {
                self.docTblColumns = [
                    { headerText: self.nls.docName },
                    { headerText: self.nls.original },
                    { headerText: self.nls.copies },
                    { headerText: self.nls.clause }
                ];
            }

            self.getSuccessMessage = function () {
                return self.resourceBundle.shippingGuaranteeSuccessful;
            };

            self.getRowId = function (rowIndex) {
                return ++rowIndex;
            };

            require([
                "ojL10n!resources/nls/generic",
                "ojL10n!resources/nls/document-details",
                "ojL10n!resources/nls/lc-details",
                "ojL10n!resources/nls/instruction-details",
                "ojL10n!resources/nls/shipment-details",
                "ojL10n!resources/nls/trade-finance-errors",
                "ojL10n!resources/nls/trade-finance-common"
            ], function (Generic, documentDetails, lcDetails, instructionsDetails, shipmentDetailsSG, tradeFinanceErrors, tradeFinanceCommon) {
                self.resourceBundle.generic = Generic;
                self.resourceBundle.documents = documentDetails;
                self.resourceBundle.lcDetails = lcDetails;
                self.resourceBundle.instructionsDetails = instructionsDetails;
                self.resourceBundle.shipmentDetails = shipmentDetailsSG;
                self.resourceBundle.tradeFinanceErrors = tradeFinanceErrors;
                self.resourceBundle.common = tradeFinanceCommon;

                if (self.bankAddressOne && ko.isObservable(self.bankAddressOne)) {
                    self.financialInstitutionbicCodeDetailsBICCodegetBICCode(self.letterOfCreditDetails.availableWith);
                }

                if (self.letterOfCreditDetails.swiftId && self.letterOfCreditDetails.swiftId !== null) {
                    self.financialInstitutionbicCodeDetailsBICCodegetBICCode(self.letterOfCreditDetails.swiftId);
                }

                if (self.letterOfCreditDetails.partyId.value) {
                    self.mepartyrelationspartyIdgetpartyId(self.letterOfCreditDetails.partyId.value);
                }

                if (self.letterOfCreditDetails.attachedDocuments) {
                    self.attachedDocuments(self.letterOfCreditDetails.attachedDocuments);
                }

                self.locationscountrycountrycitycitybranchCodegetcountry("all");
                self.locationscountrycountrycitycitybranchCodegetcity("all");

                self.pageRendered = function () {
                    return true;
                };

                Promise.all([
                    mepartyrelationspartyIdgetCall(self.mepartyrelationspartyIdgetpartyId()),
                    enumerationscountrygetCall(),
                    locationscountrycountrycitycitybranchCodegetCall(self.locationscountrycountrycitycitybranchCodegetcountry(), self.locationscountrycountrycitycitybranchCodegetcity()),
                    tradeIncotermsgetCall(self.tradeIncotermsgetq(), self.tradeIncotermsgetsortBy(), self.tradeIncotermsgetcount()),
                    productsshippingGuaranteegetCall(self.productsshippingGuaranteegetpaymentType(), self.productsshippingGuaranteegetrevolving()),
                    financialInstitutionbicCodeDetailsBICCodegetCall(self.financialInstitutionbicCodeDetailsBICCodegetBICCode()),
                    enumerationstransportationModesgetCall()
                ]).then(function (response) {
                    self.bankAddressOne = ko.observable(null);
                    self.bankAddressTwo = ko.observable(null);
                    self.bankAddressThree = ko.observable(null);

                    if (self.letterOfCreditDetails.bankAddress && self.letterOfCreditDetails.bankAddress !== null) {
                        self.creditAvailableWithSelected("BANKADDRESS");

                        const input = self.letterOfCreditDetails.bankAddress, splitStringArray = input.split("_");

                        self.bankAddressOne(splitStringArray[0]);

                        if (splitStringArray[1]) {
                            self.bankAddressTwo(splitStringArray[1]);
                        }

                        if (splitStringArray[2]) {
                            self.bankAddressThree(splitStringArray[2]);
                        }
                    } else {
                        self.creditAvailableWithSelected("SWIFTCODE");
                    }

                    const beneCountry = response[1].enumRepresentations[0].data.filter(function (data) {
                            return data.code === self.letterOfCreditDetails.counterPartyAddress.country;
                        }), beneBranch = response[2].branchAddressDTO.filter(function (data) {
                            return data.id === self.letterOfCreditDetails.branchId;
                        });

                    self.additionalBankDetails(response[5]);

                    if (self.mode() === "approval") {
                        self.transportationModes(response[6]);
                        self.transporationModeDes(rootParams.baseModel.getDescriptionFromCode(self.transportationModes().enumRepresentations[0].data, self.letterOfCreditDetails.shipmentDetails.mode));

                        if (self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0) {
                            self.multiGoodsSupported(true);
                        }

                        self.dropdownLabels.branch(beneBranch[0].branchName);
                    } else {
                        self.transportationModes = params.rootModel.params.transportationModes;
                        self.transporationModeDes(params.baseModel.getDescriptionFromCode(ko.utils.unwrapObservable(self.transportationModes), self.letterOfCreditDetails.shipmentDetails.mode, "value", "label"));
                        self.dropdownLabels.branch(beneBranch[0].branchName);
                    }

                    self.beneAddress.country(beneCountry[0].description);
                    self.applicantName(response[0].party.personalDetails.fullName);

                    for (let i = 0; i < response[0].party.addresses.length; i++) {
                        if (response[0].party.addresses[i].type === "PST") {
                            self.applicantAddress.line1(response[0].party.addresses[i].postalAddress.line1);
                            self.applicantAddress.line2(response[0].party.addresses[i].postalAddress.line2);
                            self.applicantAddress.line3(response[0].party.addresses[i].postalAddress.line3);

                            const countryLabel = response[1].enumRepresentations[0].data.filter(function (country) {
                                return country.value === response[0].party.addresses[i].postalAddress.country;
                            });

                            self.applicantAddress.country(countryLabel[0].description);
                        }
                    }

                    if (self.multiGoodsSupported()) {
                        self.multiGoodsSupported(true);
                    } else {
                        self.multiGoodsSupported(false);
                    }

                    if (self.letterOfCreditDetails.documentPresentationDays && self.letterOfCreditDetails.documentPresentationDays !== null) {
                        self.documentPresentationDays(self.letterOfCreditDetails.documentPresentationDays);
                    }

                    self.beneName(self.letterOfCreditDetails.counterPartyName);
                    self.beneAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
                    self.beneAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
                    self.beneAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);

                    if (self.multiGoodsSupported() && self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0) {
                        self.goodsLists.removeAll();

                        for (let i = 0; i < self.letterOfCreditDetails.goods.length; i++) {
                            self.goodsLists.push({
                                code: self.letterOfCreditDetails.goods[i].code,
                                description: self.letterOfCreditDetails.goods[i].description,
                                noOfUnits: self.letterOfCreditDetails.goods[i].noOfUnits ? self.letterOfCreditDetails.goods[i].noOfUnits : "",
                                pricePerUnit: self.letterOfCreditDetails.goods[i].pricePerUnit ? self.letterOfCreditDetails.goods[i].pricePerUnit : ""
                            });
                        }
                    }

                    if (self.letterOfCreditDetails.document && self.letterOfCreditDetails.document.length > 0) {
                        for (let i = 0; i < self.letterOfCreditDetails.document.length; i++) {
                            self.docList.push({
                                id: self.letterOfCreditDetails.document[i].id,
                                name: self.letterOfCreditDetails.document[i].name,
                                originals: self.letterOfCreditDetails.document[i].originals,
                                copies: self.letterOfCreditDetails.document[i].copies ? self.letterOfCreditDetails.document[i].copies : ""
                            });
                        }

                        for (let i = 0; i < self.letterOfCreditDetails.document.length; i++) {
                            if (self.letterOfCreditDetails.document[i].clause && self.letterOfCreditDetails.document[i].clause.length > 0) {
                                self.clauseTableArrayForReview.push({
                                    docId: self.letterOfCreditDetails.document[i].id,
                                    docName: params.baseModel.format(self.resourceBundle.documents.labels.documentName, { docName: self.letterOfCreditDetails.document[i].name }),
                                    datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.letterOfCreditDetails.document[i].clause))
                                });
                            }
                        }

                        self.documentsLoaded(true);
                    }

                    self.dataLoaded(true);
                });
            });

            return true;
        }

        return {
            mepartyrelationspartyIdgetCall: mepartyrelationspartyIdgetCall,
            enumerationscountrygetCall: enumerationscountrygetCall,
            locationscountrycountrycitycitybranchCodegetCall: locationscountrycountrycitycitybranchCodegetCall,
            financialInstitutionbicCodeDetailsBICCodegetCall: financialInstitutionbicCodeDetailsBICCodegetCall,
            tradeIncotermsgetCall: tradeIncotermsgetCall,
            productsshippingGuaranteegetCall: productsshippingGuaranteegetCall,
            shippingGuaranteespostCall: shippingGuaranteespostCall,
            enumerationstransportationModesgetCall: enumerationstransportationModesgetCall,
            onClickConfirm9: onClickConfirm9,
            onClickBack44: onClickBack44,
            init: init
        };
    };
});