define([
    "./model",
    "ojs/ojcore",
    "jquery",
    "knockout"
], function (Model, oj, $, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function liabilitiesliabilityIdcollateralsgetCall(partyId, branchCode, currencyCode, liabilityId, payload, config) {
            return Model.liabilitiesliabilityIdcollateralsget(partyId, branchCode, currencyCode, liabilityId, payload, config);
        }

                function liabilitiesliabilityIdcollateralsIdgetCall(Id, liabilityId, payload, config) {
            return Model.liabilitiesliabilityIdcollateralsIdget(Id, liabilityId, payload, config);
        }

                function contentscontentIddeleteCall(contentId, transactionType, payload, config) {
            return Model.contentscontentIddelete(contentId, transactionType, payload, config);
        }

                function creditFacilitiesdocumentsgetCall(processCode, applicationCategoryCode, stageCode, payload, config) {
            return Model.creditFacilitiesdocumentsget(processCode, applicationCategoryCode, stageCode, payload, config);
        }

                function contentspostCall(payload, config) {
            return Model.contentspost(payload, config);
        }

                function liabilitiesgetCall(partyId, payload, config) {
            return Model.liabilitiesget(partyId, payload, config);
        }

                function CollateralID39ValueChangeHook(newValue) {
            liabilitiesliabilityIdcollateralsIdgetCall(newValue, self.liabilityId()).then(function (data) {
                self.availableAmount(data.collateralDTO.availableAmount.amount);
                self.availableAmountCurrency(data.collateralDTO.availableAmount.currency);
                self.collateralDescription(data.collateralDTO.collateralDesc);
                self.utilizedAmount(data.collateralDTO.utilizationAmount.amount);
                self.utilizedAmountCurrency(data.collateralDTO.utilizationAmount.currency);
                self.collateralAmount(data.collateralDTO.collateralValue.amount);
                self.collateralAmountCurrency(data.collateralDTO.collateralValue.currency);
                self.revisionDate(oj.IntlConverterUtils.dateToLocalIso(new Date(data.collateralDTO.revisionDate)));
            });
        }

                function onClickProceed48() {
            $("#changeCollateralModal").hide();
            self.openModal(false);
        }

                function onClickCancel33() {
            $("#changeCollateralModal").hide();
        }

                function onClickChangeCollateral31() {
            $("#changeCollateralModal").trigger("openModal");
        }

                function onClickUpload80(event, data) {
            const files = event.detail.files[0];

            self.document.attachedDocuments()[self.documentsListMap[data.id]].fileName(files.name);

            const formData = new FormData();

            formData.append("file", files);
            formData.append("transactionType", "MO");
            formData.append("moduleIdentifier", "CREDIT_FACILITY");
            formData.append("fileCount", 1);

            contentspostCall(formData).then(function (response) {
                if (response.contentDTOList.length && response.contentDTOList[0] && response.contentDTOList[0].contentId) {
                    self.document.attachedDocuments()[self.documentsListMap[data.id]].contentId.value(response.contentDTOList[0].contentId.value);
                }
            });
        }

                function onClickRemove62(data) {
            contentscontentIddeleteCall(data.contentId.value(), "MO").then(function () {
                data.fileName(null);
                data.contentId.value(null);
            });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.collateralId = ko.observable();
            self.collateralIdIndex = ko.observable();
            self.collateralAmount = ko.observable();
            self.collateralAmountCurrency = ko.observable();
            self.utilizedAmount = ko.observable();
            self.utilizedAmountCurrency = ko.observable();
            self.availableAmount = ko.observable();
            self.availableAmountCurrency = ko.observable();
            self.revisionDate = ko.observable();
            self.collateralDescription = ko.observable();
            self.openModal = ko.observable(!params.rootModel.collateralId);
            self.dataLoaded = ko.observable(true);
            self.collateralDocumentsUploadTracker = ko.observable();
            self.collateralList = ko.observableArray([]);
            self.reasonForModification = ko.observable();
            self.remarks = ko.observable();
            self.liabilityId = ko.observable();

            self.document = {
                processId: "COPS",
                stageId: "CPM_FA_COPS_INITI",
                attachedDocuments: ko.observableArray([])
            };

            ko.utils.extend(self, self.getStageState("collateral-revaluation-flow-stage1"));
            self.documentsListMap = {};
            params.baseModel.registerComponent("collateral-revaluation-details", "credit-facility");

            liabilitiesgetCall().then(function (response) {
                self.liabilityId(response.liabilitydtos[0].id);

                liabilitiesliabilityIdcollateralsgetCall("", "", "", response.liabilitydtos[0].id).then(function (data) {
                    self.collateralList(data.collateraldtos);
                    self.collateralId(self.collateralId() || params.rootModel.collateralId);
                });
            });

            creditFacilitiesdocumentsgetCall("COPS", "Perfection", "CPM_FA_COPS_INITI").then(function (response) {
                ko.utils.arrayForEach(response.document && response.document.documentsList, function (item) {
                    if (self.document.attachedDocuments().length !== response.document.documentsList.length) {
                        self.document.attachedDocuments.push({
                            id: item.id,
                            description: item.description,
                            name: item.name,
                            fileName: ko.observable(),
                            contentId: { value: ko.observable() }
                        });
                    }

                    self.documentsListMap[item.id] = Object.keys(self.documentsListMap).length;
                });
            });

            self.pageRendered = function () {
                if (self.openModal()) {
                    $("#changeCollateralModal").trigger("openModal");
                }

                return true;
            };

            return true;
        }

        return {
            liabilitiesliabilityIdcollateralsgetCall: liabilitiesliabilityIdcollateralsgetCall,
            liabilitiesliabilityIdcollateralsIdgetCall: liabilitiesliabilityIdcollateralsIdgetCall,
            contentscontentIddeleteCall: contentscontentIddeleteCall,
            creditFacilitiesdocumentsgetCall: creditFacilitiesdocumentsgetCall,
            contentspostCall: contentspostCall,
            liabilitiesgetCall: liabilitiesgetCall,
            CollateralID39ValueChangeHook: CollateralID39ValueChangeHook,
            onClickProceed48: onClickProceed48,
            onClickCancel33: onClickCancel33,
            onClickChangeCollateral31: onClickChangeCollateral31,
            onClickUpload80: onClickUpload80,
            onClickRemove62: onClickRemove62,
            init: init
        };
    };
});