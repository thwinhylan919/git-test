define([
    "./model",
    "knockout",
    "ojs/ojcore",
    "jquery"
], function (Model, ko, oj, $) {
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

                function productsshippingGuaranteeproductIdgetCall(productId, productType, payload, config) {
            return Model.productsshippingGuaranteeproductIdget(productId, productType, payload, config);
        }

                function shippingGuaranteesidchargesgetCall(id, q, payload, config) {
            return Model.shippingGuaranteesidchargesget(id, q, payload, config);
        }

                function enumerationstransportationModesgetCall(payload, config) {
            return Model.enumerationstransportationModesget(payload, config);
        }

                function onClickBack36() {
            history.back();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            params.baseModel.registerComponent("attach-documents", "trade-finance");
            params.baseModel.registerComponent("shipping-guarantees", "shipping-guarantee");
            self.letterOfCreditDetails = ko.mapping.toJS(params.rootModel.params.data);
            self.mode = ko.observable(params.rootModel.params.mode);
            self.resourceBundle = self.nls;
            self.transactionType = "SHIPPING_GUARANTEE";
            self.linkedLC = params.rootModel.params.lc_number;
            self.sgNumber = params.rootModel.params.sg_number;
            self.attachedDocuments = ko.observableArray();
            self.deletedDocuments = ko.observableArray();
            self.contractModified = ko.observable(false);
            self.chargesDetailsLoaded = ko.observable(false);
            self.adviceList = ko.observableArray();
            self.datasourceForAdvices = ko.observable();
            self.sectionName = ko.observable("main");
            self.commisionList = ko.observableArray();
            self.commissionDataSource = ko.observable();
            self.chargesList = ko.observableArray();
            self.chargesDataSource = ko.observable();
            self.transporationModeDes = ko.observable();
            self.transportationModes = ko.observableArray();

            let chargesLength, commissionLength;

            params.dashboard.headerName(params.baseModel.format(self.nls.viewSGHeader, { sgNumber: self.sgNumber }));

            let sgDetails;

            if (self.linkedLC !== "") {
                sgDetails = params.baseModel.format(self.nls.sgDetailsLinkedLC, { lcNumber: self.linkedLC });
            } else {
                sgDetails = self.nls.sgDetails;
            }

            self.menuSelection = ko.observable();
            self.menuOptions = ko.observableArray();

            self.getRowId = function (rowIndex) {
                return ++rowIndex;
            };

            self.fetchCharges = function () {
                shippingGuaranteesidchargesgetCall(params.rootModel.params.sg_number).then(function (data) {
                    self.chargesDetailsLoaded(false);
                    chargesLength = data.charges[0].charges && data.charges[0].charges.length ? data.charges[0].charges.length : 0;
                    commissionLength = data.charges[0].commissions ? data.charges[0].commissions.length : 0;

                    if (commissionLength > 0) {
                        self.commisionList(data.charges[0].commissions);
                        self.commissionDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.commisionList())));
                    } else {
                        self.commissionDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                    }

                    if (chargesLength > 0) {
                        self.chargesList(data.charges[0].charges);
                        self.chargesDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.chargesList(), { idAttribute: "chargesForAmendment" })));
                    }

                    self.chargesDetailsLoaded(true);
                });
            };

            self.adviceDetails = {
                message: ko.observable(),
                eventDesc: ko.observable(),
                eventDate: ko.observable(),
                description: ko.observable(),
                dcnNo: ko.observable()
            };

            self.openAdviceDetails = function (dcnNo) {
                for (let i = 0; i < self.letterOfCreditDetails.advices.length; i++) {
                    if (dcnNo === self.letterOfCreditDetails.advices[i].dcnNo) {
                        self.adviceDetails.dcnNo(dcnNo);
                        self.adviceDetails.eventDesc(self.letterOfCreditDetails.advices[i].eventDesc);
                        self.adviceDetails.eventDate(self.letterOfCreditDetails.advices[i].eventDate);
                        break;
                    }
                }

                $("#adviceDialog").trigger("openModal");
            };

            self.menuOptions([
                {
                    id: "main",
                    label: self.nls.viewDetails,
                    templatePath: self.nls.viewDetails
                },
                {
                    id: "attachedDocs",
                    label: self.nls.viewAttachedDocuments,
                    templatePath: self.nls.viewAttachedDocuments
                },
                {
                    id: "charges",
                    label: self.nls.charges,
                    templatePath: "trade-finance/view-guarantees/bank-guarantee-charges"
                },
                {
                    id: "viewAdvice",
                    label: self.nls.viewAdvice,
                    templatePath: "trade-finance/advices"
                }
            ]);

            self.menuSelection("main");

            self.stages = [
                {
                    stageName: sgDetails,
                    templateName: "trade-finance/lc-details"
                },
                {
                    stageName: self.nls.shipmentDetailsSG,
                    templateName: "trade-finance/shipment-details"
                },
                {
                    stageName: self.nls.instructions,
                    templateName: "trade-finance/instructions-details"
                }
            ];

            self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
                const menuOption = self.menuOptions().filter(function (data) {
                    return data.id === newValue;
                });

                self.showSection(menuOption[0].label, menuOption[0].id);
            });

            self.showSection = function (sectionName, id) {
                switch (sectionName) {
                case self.nls.viewDetails:
                    break;
                case self.nls.viewAttachedDocuments:
                    break;
                case self.nls.charges:
                    self.fetchCharges();
                    break;
                case self.nls.viewAdvice:
                    break;
                }

                self.sectionName(id);
            };

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
            self.datasourceForGoodsReview = ko.observable();
            self.goodsLists = ko.observableArray();
            self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists, { idAttribute: "code" });
            self.multiGoodsSupported = ko.observable(false);
            self.reviewTransactionName = [];

            self.beneAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };

            self.reviewFlag = ko.observable(true);
            self.dataLoaded = ko.observable(false);
            self.additionalBankDetails = ko.observable();
            self.availableWithDetails = ko.observable();
            self.applicantName = ko.observable();

            self.applicantAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };

            self.dropdownLabels = {
                country: ko.observable(),
                product: ko.observable(),
                branch: ko.observable(),
                incoterm: ko.observable()
            };

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

            const qQuery = { criteria: [] };

            require([
                "ojL10n!resources/nls/generic",
                "ojL10n!resources/nls/document-details",
                "ojL10n!resources/nls/lc-details",
                "ojL10n!resources/nls/instruction-details",
                "ojL10n!resources/nls/shipment-details",
                "ojL10n!resources/nls/trade-finance-errors",
                "ojL10n!resources/nls/trade-finance-common"
            ], function (Generic, documentDetails, lcDetails, instructionsDetails, shipmentDetails, tradeFinanceErrors, tradeFinanceCommon) {
                self.resourceBundle.generic = Generic;
                self.resourceBundle.documents = documentDetails;
                self.resourceBundle.lcDetails = lcDetails;
                self.resourceBundle.instructionsDetails = instructionsDetails;
                self.resourceBundle.shipmentDetails = shipmentDetails;
                self.resourceBundle.tradeFinanceErrors = tradeFinanceErrors;
                self.resourceBundle.common = tradeFinanceCommon;

                if (self.bankAddressOne && ko.isObservable(self.bankAddressOne)) {
                    self.financialInstitutionbicCodeDetailsBICCodegetBICCode(self.letterOfCreditDetails.availableWith);
                }

                if (self.letterOfCreditDetails.swiftId && self.letterOfCreditDetails.swiftId !== null) {
                    self.financialInstitutionbicCodeDetailsBICCodegetBICCode(self.letterOfCreditDetails.swiftId);
                }

                if (self.letterOfCreditDetails.advisingBankCode && self.letterOfCreditDetails.advisingBankCode !== null) {
                    self.financialInstitutionbicCodeDetailsBICCodegetBICCode(self.letterOfCreditDetails.advisingBankCode);
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

                if (self.letterOfCreditDetails.incoterm && self.letterOfCreditDetails.incoterm.code) {
                    qQuery.criteria.push({
                        operand: "code",
                        operator: "EQUALS",
                        value: [self.letterOfCreditDetails.incoterm.code]
                    });
                }

                self.tradeIncotermsgetq(JSON.stringify(qQuery));
                self.productsshippingGuaranteeproductIdgetproductId("SGLC");

                Promise.all([
                    mepartyrelationspartyIdgetCall(self.mepartyrelationspartyIdgetpartyId()),
                    enumerationscountrygetCall(),
                    locationscountrycountrycitycitybranchCodegetCall(self.locationscountrycountrycitycitybranchCodegetcountry(), self.locationscountrycountrycitycitybranchCodegetcity()),
                    financialInstitutionbicCodeDetailsBICCodegetCall(self.financialInstitutionbicCodeDetailsBICCodegetBICCode()),
                    tradeIncotermsgetCall(self.tradeIncotermsgetq(), self.tradeIncotermsgetsortBy(), self.tradeIncotermsgetcount()),
                    productsshippingGuaranteeproductIdgetCall(self.productsshippingGuaranteeproductIdgetproductId(), self.productsshippingGuaranteeproductIdgetproductType()),
                    enumerationstransportationModesgetCall()
                ]).then(function (response) {
                    self.bankAddressOne = ko.observable(null);
                    self.bankAddressTwo = ko.observable(null);
                    self.bankAddressThree = ko.observable(null);

                    if (self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y") {
                        self.multiGoodsSupported(true);
                    }

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

                    self.dropdownLabels.branch(beneBranch[0].branchName);
                    self.beneAddress.country(beneCountry[0].description);
                    self.availableWithDetails(response[3]);
                    self.additionalBankDetails(response[3]);
                    self.dropdownLabels.incoterm(response[4].incotermList[0].description);
                    self.dropdownLabels.product(response[5].product.name);
                    self.transportationModes(response[6]);
                    self.transporationModeDes(rootParams.baseModel.getDescriptionFromCode(self.transportationModes().enumRepresentations[0].data, self.letterOfCreditDetails.shipmentDetails.mode));
                    self.applicantName(response[0].party.personalDetails.fullName);

                    for (let i = 0; i < response[0].party.addresses.length; i++) {
                        if (response[0].party.addresses[i].type === "PST") {
                            self.applicantAddress.line1(response[0].party.addresses[i].postalAddress.line1);
                            self.applicantAddress.line2(response[0].party.addresses[i].postalAddress.line2);
                            self.applicantAddress.line3(response[0].party.addresses[i].postalAddress.line3);
                            self.applicantAddress.country(rootParams.baseModel.getDescriptionFromCode(response[1].enumRepresentations[0].data, response[0].party.addresses[i].postalAddress.country));
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

                    if (self.letterOfCreditDetails.draftsRequired.toString() === "true" && self.letterOfCreditDetails.billingDrafts && self.letterOfCreditDetails.billingDrafts.length > 0) {
                        self.datasourceForDraftReview = new oj.ArrayTableDataSource(self.letterOfCreditDetails.billingDrafts);
                        self.billingDraftsLoaded(true);
                    }

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

                    if (self.letterOfCreditDetails.attachedDocuments) {
                        self.attachedDocuments.removeAll();

                        for (let k = 0; k < self.letterOfCreditDetails.attachedDocuments.length; k++) {
                            self.attachedDocuments.push({
                                contentId: self.letterOfCreditDetails.attachedDocuments[k].contentId,
                                documentName: self.letterOfCreditDetails.attachedDocuments[k].documentName,
                                category: self.letterOfCreditDetails.attachedDocuments[k].category,
                                type: self.letterOfCreditDetails.attachedDocuments[k].type,
                                remarks: self.letterOfCreditDetails.attachedDocuments[k].remarks,
                                newDocument: false
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

                    function setAdviceList() {
                        if (self.letterOfCreditDetails.advices) {
                            self.adviceList(self.letterOfCreditDetails.advices);
                            self.datasourceForAdvices(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.adviceList(), { idAttribute: "dcnNo" })));
                        }
                    }

                    setAdviceList();
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
            productsshippingGuaranteeproductIdgetCall: productsshippingGuaranteeproductIdgetCall,
            shippingGuaranteesidchargesgetCall: shippingGuaranteesidchargesgetCall,
            enumerationstransportationModesgetCall: enumerationstransportationModesgetCall,
            onClickBack36: onClickBack36,
            init: init
        };
    };
});