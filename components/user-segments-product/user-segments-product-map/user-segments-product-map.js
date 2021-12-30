define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/user-segments-product",
    "promise",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojtable",
    "ojs/ojdatacollection-utils",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout"
], function(oj, ko, $, UserSegmentProductMapModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = UserSegmentProductMapModel.getNewModel();

                return KoModel;
            };

        self.payload = getNewKoModel().UserSegmentModel;
        self.productMapArray = ko.observableArray();
        self.tasksLoaded = ko.observable(true);
        self.rowTemplateValue = ko.observable("rowTemplate");
        rootParams.baseModel.registerElement("confirm-screen");
        self.datasource = ko.observable();
        self.productsMapped = ko.observable(false);
        self.prevMode = ko.observable();
        self.prevReviewMode = ko.observable();
        self.productsTemplateId = ko.observable();
        self.expired = ko.observable();
        self.approverReview = ko.observable(false);
        self.productData = ko.observable();
        self.confirmClicked = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.header.productMapping);
        self.productModule = ko.observable(self.resource.productMapping.productModule[self.params.productModuleId]);

        let productModule = self.params.productModuleId,
            productType = self.params.productTypeId;

        self.productType = self.params.productType;
        self.maintenanceId = self.params.maintenanceId;
        self.userSegmentId = self.params.enterpriseRole;
        self.entityName = self.params.entityName;
        self.entityNameId = self.params.entityNameId;
        self.entityType = self.params.entityType;
        self.mode = ko.observable(self.params.mode);
        self.productHeading = ko.observable(self.params.mode);
        self.groupValid = ko.observable();
        self.invalidTracker = ko.observable();
        self.tracker = ko.observable();
        self.editArray = ko.observableArray();
        self.version = ko.observable();
        self.approvalView = ko.observable(false);
        self.segmentDataLoaded = ko.observable(false);
        self.showMode = ko.observable(self.mode() === "VIEW" || self.mode() === "REVIEW");

        if (rootParams && rootParams.rootModel && rootParams.rootModel.params && rootParams.rootModel.params.data) {
            self.createPayloadToReview = ko.mapping.toJS(rootParams.rootModel.params.data);
        }

        self.back = function() {
            self.confirmClicked(false);

            if (self.prevMode() === "VIEW") {
                self.productHeading(self.resource.common.view);
                self.mode("VIEW");
                self.prevMode("");
                self.view();
            } else if (self.prevMode() === "CREATE") {
                self.productHeading(self.resource.generic.common.create);
                self.mode("CREATE");
                self.prevMode("");
                self.fetchProductList();
            } else if (self.prevMode() === "EDIT") {
                self.productHeading(self.resource.generic.common.edit);
                self.mode("EDIT");
                self.prevMode("VIEW");
                self.productsTemplateId("row_Template_products_edit");
            } else if (self.prevMode() === "REVIEW") {
                if (self.mode() === "EDIT") {
                    self.productHeading(self.resource.common.view);
                    self.mode("VIEW");
                    self.prevMode("");
                    self.view();
                } else if (self.mode() === "CREATE") {
                    history.back();
                }
            } else { history.back(); }

            self.showMode(self.mode() === "VIEW" || self.mode() === "REVIEW");
        };

        self.checkExpiryDate = function(expiryDate) {
            if (expiryDate && Date.parse(expiryDate) < Date.parse(rootParams.baseModel.getDate())) {
                self.expired("Expired!");
            } else {
                self.expired("Active");
            }

            return self.expired();
        };

        self.save = function() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                const productids = [];

                for (let i = 0; i < self.datasource.data().length; i++) {
                    if (self.datasource.data()[i].productsMapped.product[0] === "checked") { productids.push(self.datasource.data()[i].productId); }
                }

                self.productHeading(self.resource.common.review);
                self.prevMode(self.mode());
                self.mode("REVIEW");
                self.showMode(true);
                self.productsTemplateId("row_Template_products_read");
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.edit = function() {
            if (self.prevReviewMode() !== self.mode()) {
                self.prevReviewMode(self.prevMode());
            }

            self.prevMode(self.mode());

            if (self.prevReviewMode() === "CREATE") {
                self.productHeading(self.resource.generic.common.create);
                self.mode("CREATE");
            } else {
                self.productHeading(self.resource.generic.common.edit);
                self.mode("EDIT");
            }

            self.showMode(self.mode() === "VIEW" || self.mode() === "REVIEW");

            self.datasource.data().forEach(function(entry) {
                if (entry.productsMapped.product.length === 0) {
                    entry.checkedValue("false");
                }
            });

            self.productsTemplateId("row_Template_products_read");
        };

        if (self.createPayloadToReview) {
            self.approvalView(true);

            if(self.createPayloadToReview.maintenance.entity.key.value !== "retailuser" && self.createPayloadToReview.maintenance.entity.key.value !== "corporateuser"){
                UserSegmentProductMapModel.fetchSegmentDetails(self.createPayloadToReview.maintenance.entity.key.value).then(function(data) {
                    self.userSegmentId = data.segmentDTO.enterpriseRole;
                    self.entityName = data.segmentDTO.name;

                    UserSegmentProductMapModel.fetchProductTypes().then(function(data) {
                        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                            if (data.enumRepresentations[0].data[i].code === self.createPayloadToReview.maintenance.productType) {
                                self.productType = data.enumRepresentations[0].data[i].description;
                            }
                        }

                        self.segmentDataLoaded(true);
                        ko.tasks.runEarly();
                    });
                });
            }
            else{
                self.userSegmentId = self.createPayloadToReview.maintenance.entity.key.value;

                UserSegmentProductMapModel.fetchProductTypes().then(function(data) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (data.enumRepresentations[0].data[i].code === self.createPayloadToReview.maintenance.productType) {
                            self.productType = data.enumRepresentations[0].data[i].description;
                        }
                    }

                    self.segmentDataLoaded(true);
                    ko.tasks.runEarly();
                });
            }

            self.productModule = self.resource.productMapping.productModule[self.createPayloadToReview.maintenance.productModule];
            productModule = self.createPayloadToReview.maintenance.productModule;
            productType = self.createPayloadToReview.maintenance.productType;
        } else {
            self.segmentDataLoaded(true);
        }

        if (self.transactionId) {
            self.mode("REVIEW");
            self.showMode(true);

            if (self.params && self.params.data && self.params.data.userSegmentId) {
                switch (self.params.data.userSegmentId()) {
                    case "administrator":
                        self.userSegmentName = self.resource.productMapping.administrator;
                        break;
                    case "retailuser":
                        self.userSegmentName = self.resource.productMapping.retailuser;
                        break;
                    case "corporateuser":
                        self.userSegmentName = self.resource.productMapping.corporateuser;
                        break;
                }
            }

            self.tasksLoaded(false);

            UserSegmentProductMapModel.productList(productModule, productType).then(function(data) {
                $.map(data.tdProductDTOList, function(productDataLocal) {
                    productDataLocal.productsMapped = {
                        product: []
                    };

                    if (productDataLocal.expiryDate) { productDataLocal.productExpiryDate = productDataLocal.expiryDate; } else { productDataLocal.productExpiryDate = self.resource.productMapping.notAvailable; }

                    productDataLocal.expiredFlag = self.checkExpiryDate(productDataLocal.productExpiryDate);

                    if (productDataLocal.amountParameters) {
                        productDataLocal.currency = productDataLocal.amountParameters[0].currency;
                        productDataLocal.minAmount = productDataLocal.amountParameters[0].minAmount.amount;
                        productDataLocal.maxAmount = productDataLocal.amountParameters[0].maxAmount.amount;
                    }

                    return productDataLocal;
                });

                let x = 0;

                for (let i = 0; i < data.tdProductDTOList.length; i++) {
                    for (let j = 0; j < data.tdProductDTOList[i].amountParameters.length; j++) {
                        self.editArray().push({
                            indexValue: x,
                            minimumValue: data.tdProductDTOList[i].amountParameters[j].minAmount,
                            maximumValue: data.tdProductDTOList[i].amountParameters[j].maxAmount
                        });

                        x++;
                    }
                }

                self.productMapArray = data.tdProductDTOList;

                self.productArray = ko.observable(self.productMapArray.map(function(row) {
                    Object.keys(row).forEach(function(attr) {
                        row[attr] = ko.observable(row[attr]);
                    });

                    return row;
                }));

                if (data.tdProductDTOList.length > 0) {
                    const productdataList = [];

                    for (let i = 0; i < data.tdProductDTOList.length; i++) {
                        for (let j = 0; j < data.tdProductDTOList[i].amountParameters().length; j++) {
                            const productdata = ko.toJS(data.tdProductDTOList[i]);

                            if (j !== 0) {
                                productdata.name = "";
                            }

                            productdata.rowId = productdata.productId + data.tdProductDTOList[i].amountParameters()[j].currency;
                            productdata.currency = data.tdProductDTOList[i].amountParameters()[j].currency;
                            productdata.minAmount = ko.observable(data.tdProductDTOList[i].amountParameters()[j].minAmount.amount);
                            productdata.maxAmount = ko.observable(data.tdProductDTOList[i].amountParameters()[j].maxAmount.amount);
                            productdata.checkedValue = ko.observable();
                            productdata.amountParameters = [];
                            productdata.amountParameters[0] = data.tdProductDTOList[i].amountParameters()[j];
                            productdataList.push(productdata);
                        }
                    }

                    self.datasource = new oj.ArrayTableDataSource(productdataList, {
                        idAttribute: ["rowId"]
                    });
                }

                if (self.datasource) {
                    for (let i = 0; i < self.datasource.data.length; i++) {
                        if (!self.approvalView()) {
                            if (self.params.data.productIds() && self.params.data.productIds().length > 0) {
                                for (let j = 0; j < self.params.data.productIds().length; j++) {
                                    if (self.datasource.data[i].productId === self.params.data.productIds()[j].id) { self.datasource.data[i].productsMapped.product[0] = "checked"; }
                                }
                            }
                        } else if (self.createPayloadToReview.maintenance.productMainItems && self.createPayloadToReview.maintenance.productMainItems.length > 0) {
                            for (let j = 0; j < self.createPayloadToReview.maintenance.productMainItems.length; j++) {
                                if (self.datasource.data[i].productId === self.createPayloadToReview.maintenance.productMainItems[j].id) {
                                    self.datasource.data[i].productsMapped.product[0] = "checked";

                                    if (self.datasource.data[i].currency === self.createPayloadToReview.maintenance.productMainItems[j].maxAmount.currency) {
                                        if (self.datasource.data[i].minAmount !== self.createPayloadToReview.maintenance.productMainItems[j].minAmt.amount) {
                                            self.datasource.data[i].minAmount(self.createPayloadToReview.maintenance.productMainItems[j].minAmt.amount);
                                        }

                                        if (self.datasource.data[i].maxAmount !== self.createPayloadToReview.maintenance.productMainItems[j].maxAmount.amount) {
                                            self.datasource.data[i].maxAmount(self.createPayloadToReview.maintenance.productMainItems[j].maxAmount.amount);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                self.productsTemplateId("row_Template_products_read");
                self.tasksLoaded(true);
            });

            self.productHeading("");
            self.approverReview(true);
        }

        self.confirm = function() {
            self.confirmClicked(true);
            self.payload.maintenance = {};
            self.payload.maintenance.entity = {};
            self.payload.maintenance.entity.key = {};

            if (self.entityNameId === "") {
                self.payload.maintenance.entity.key.value = self.params.enterpriseRole;
            } else {
                self.payload.maintenance.entity.key.value = self.entityNameId;
            }

            self.payload.maintenance.entity.key.type = self.entityType;
            self.payload.maintenance.productModule = productModule;
            self.payload.maintenance.productType = productType;
            self.payload.maintenance.productMainItems = [];

            if (self.version()) {
                self.payload.maintenance.version = self.version();
            }

            for (let i = 0; i < self.datasource.data().length; i++) {
                if (self.datasource.data()[i].productsMapped.product[0] === "checked") {
                    self.payload.maintenance.productMainItems.push({
                        id: self.datasource.data()[i].productId,
                        minAmt: {
                            currency: self.datasource.data()[i].currency,
                            amount: self.datasource.data()[i].minAmount
                        },
                        maxAmount: {
                            currency: self.datasource.data()[i].currency,
                            amount: self.datasource.data()[i].maxAmount
                        }
                    });
                }
            }

            if (self.prevMode() === "CREATE") {
                if (self.maintenanceId) {
                    UserSegmentProductMapModel.updateProductMapping(ko.toJSON(self.payload), self.maintenanceId).then(function(data) {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: data,
                            transactionName: self.resource.header.productMapping
                        }, self);
                    });
                } else {
                    UserSegmentProductMapModel.addProductMapping(ko.toJSON(self.payload)).then(function(data) {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: data,
                            transactionName: self.resource.header.productMapping
                        }, self);
                    });
                }
            } else if (self.prevMode() === "EDIT") {
                UserSegmentProductMapModel.updateProductMapping(ko.toJSON(self.payload), self.maintenanceId).then(function(data) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.resource.header.productMapping
                    }, self);
                });
            }
        };

        self.fetchProductList = function() {
            self.tasksLoaded(false);

            UserSegmentProductMapModel.productList(productModule, productType).then(function(data) {
                $.map(data.tdProductDTOList, function(productDataLocal) {
                    productDataLocal.productsMapped = {
                        product: []
                    };

                    if (productDataLocal.expiryDate) {
                        productDataLocal.productExpiryDate = productDataLocal.expiryDate;
                    } else {
                        productDataLocal.productExpiryDate = self.resource.productMapping.notAvailable;
                    }

                    productDataLocal.expiredFlag = self.checkExpiryDate(productDataLocal.productExpiryDate);
                    productDataLocal.checkedValue = null;

                    if (productDataLocal.amountParameters) {
                        productDataLocal.currency = productDataLocal.amountParameters[0].currency;
                        productDataLocal.minAmount = productDataLocal.amountParameters[0].minAmount.amount;
                        productDataLocal.maxAmount = productDataLocal.amountParameters[0].maxAmount.amount;
                    }

                    return productDataLocal;
                });

                let x = 0;

                for (let i = 0; i < data.tdProductDTOList.length; i++) {
                    for (let j = 0; j < data.tdProductDTOList[i].amountParameters.length; j++) {
                        self.editArray().push({
                            indexValue: x,
                            minimumValue: data.tdProductDTOList[i].amountParameters[j].minAmount,
                            maximumValue: data.tdProductDTOList[i].amountParameters[j].maxAmount
                        });

                        x++;
                    }
                }

                self.productMapArray = data.tdProductDTOList;

                self.productArray = ko.observable(self.productMapArray.map(function(row) {
                    Object.keys(row).forEach(function(attr) {
                        row[attr] = ko.observable(row[attr]);
                    });

                    return row;
                }));

                if (data.tdProductDTOList.length > 0) {
                    const productdataList = [];

                    for (let i = 0; i < data.tdProductDTOList.length; i++) {
                        for (let j = 0; j < data.tdProductDTOList[i].amountParameters().length; j++) {
                            const productdata = ko.toJS(data.tdProductDTOList[i]);

                            if (j !== 0) {
                                productdata.name = "";
                            }

                            productdata.rowId = productdata.productId + data.tdProductDTOList[i].amountParameters()[j].currency;
                            productdata.currency = data.tdProductDTOList[i].amountParameters()[j].currency;
                            productdata.minAmount = ko.observable(data.tdProductDTOList[i].amountParameters()[j].minAmount.amount);
                            productdata.maxAmount = ko.observable(data.tdProductDTOList[i].amountParameters()[j].maxAmount.amount);
                            productdata.checkedValue = ko.observable();
                            productdata.amountParameters = [];
                            productdata.amountParameters[0] = data.tdProductDTOList[i].amountParameters()[j];
                            productdataList.push(productdata);
                        }
                    }

                    self.datasource = new oj.ArrayTableDataSource(productdataList, {
                        idAttribute: ["rowId"]
                    });

                    self.datasource.data = ko.observable(self.datasource.data);
                    self.tasksLoaded(true);
                }

                self.productsTemplateId("row_Template_products_read");
            });
        };

        if (self.mode() === "CREATE") {
            self.productHeading(self.resource.generic.common.create);
            self.fetchProductList();
        }

        self.view = function() {
            UserSegmentProductMapModel.fetchMappedProducts(self.maintenanceId).then(function(data1) {
                self.tasksLoaded(false);

                UserSegmentProductMapModel.productList(productModule, productType).then(function(data) {
                    $.map(data.tdProductDTOList, function(productDataLocal) {
                        productDataLocal.productsMapped = {
                            product: []
                        };

                        if (productDataLocal.expiryDate) {
                            productDataLocal.productExpiryDate = productDataLocal.expiryDate;
                        } else {
                            productDataLocal.productExpiryDate = self.resource.productMapping.notAvailable;
                        }

                        productDataLocal.expiredFlag = self.checkExpiryDate(productDataLocal.productExpiryDate);
                        productDataLocal.checkedValue = null;

                        return productDataLocal;
                    });

                    self.productMapArray = data.tdProductDTOList;

                    self.productArray = ko.observable(self.productMapArray.map(function(row) {
                        Object.keys(row).forEach(function(attr) {
                            row[attr] = ko.observable(row[attr]);
                        });

                        return row;
                    }));

                    if (self.productMapArray.length > 0) {
                        const productdataList = [];
                        let x = 0;

                        for (let i = 0; i < self.productMapArray.length; i++) {
                            for (let j = 0; j < self.productMapArray[i].amountParameters().length; j++) {
                                const productdata = ko.toJS(self.productMapArray[i]);

                                if (j !== 0) {
                                    productdata.name = "";
                                }

                                productdata.rowId = productdata.productId + self.productMapArray[i].amountParameters()[j].currency;
                                productdata.currency = self.productMapArray[i].amountParameters()[j].currency;
                                productdata.minAmount = ko.observable(self.productMapArray[i].amountParameters()[j].minAmount.amount);
                                productdata.maxAmount = ko.observable(self.productMapArray[i].amountParameters()[j].maxAmount.amount);
                                productdata.checkedValue = ko.observable();
                                productdata.amountParameters = [];
                                productdata.amountParameters[0] = self.productMapArray[i].amountParameters()[j];
                                productdataList.push(productdata);

                                self.editArray().push({
                                    indexValue: x,
                                    minimumValue: self.productMapArray[i].amountParameters()[j].minAmount,
                                    maximumValue: self.productMapArray[i].amountParameters()[j].maxAmount
                                });

                                x++;
                            }
                        }

                        self.datasource = new oj.ArrayTableDataSource(productdataList, {
                            idAttribute: ["rowId"]
                        });

                        self.datasource.data = ko.observable(self.datasource.data);
                    }

                    for (let i = 0; i < self.datasource.data().length; i++) {
                        if (data1.maintenance && data1.maintenance.productMainItems && data1.maintenance.productMainItems.length > 0) {
                            for (let j = 0; j < data1.maintenance.productMainItems.length; j++) {
                                if (self.datasource.data()[i].productId === data1.maintenance.productMainItems[j].id) {
                                    self.datasource.data()[i].productsMapped.product[0] = "checked";

                                    if (self.datasource.data()[i].currency === data1.maintenance.productMainItems[j].maxAmount.currency) {
                                        if (self.datasource.data()[i].minAmount !== data1.maintenance.productMainItems[j].minAmt.amount) {
                                            self.datasource.data()[i].minAmount(data1.maintenance.productMainItems[j].minAmt.amount);
                                        }

                                        if (self.datasource.data()[i].maxAmount !== data1.maintenance.productMainItems[j].maxAmount.amount) {
                                            self.datasource.data()[i].maxAmount(data1.maintenance.productMainItems[j].maxAmount.amount);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (data1.maintenance.version) {
                        self.version(data1.maintenance.version);
                    }

                    self.productsTemplateId("row_Template_products_read");
                    self.tasksLoaded(true);
                });
            });
        };

        self.validateMinAmount = [{
            validate: function(value) {
                const regex = new RegExp("^[0-9]*$");

                if (!regex.test(value)) {
                    throw new oj.ValidatorError("", self.resource.validationErrors.validateAmount);
                }

                return true;
            }
        }];

        if (self.mode() === "VIEW") {
            self.productHeading(self.resource.common.view);
            self.view();
        }

        self.checkBoxHandler = function(event) {
            if (event) {
                if (event.detail.value.length === 0) {
                    const prodId = event.target.id;

                    self.datasource.data().forEach(function(entry) {
                        if (entry.productId === prodId) {
                            entry.checkedValue("false");
                            entry.productsMapped.product[0] = null;
                        }
                    });
                }

                if (event.detail.value.length !== 0) {
                    const productsId = event.target.id;

                    self.datasource.data().forEach(function(entry) {
                        if (entry.productId === productsId) {
                            entry.checkedValue("true");
                            entry.productsMapped.product[0] = "checked";
                        }
                    });
                }
            }
        };
    };
});