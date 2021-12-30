define([
    "./model",
    "ojL10n!resources/nls/split-money-list",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojavatar",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojinputtext",
    "ojs/ojconveyorbelt"
], function(Model, resourceBundle, ko, oj) {
    "use strict";

    return function(params) {
        const self = this,
            batchRequest = {
                batchDetailRequestList: []
            },
            getNewKoModel = function() {
                const KoModel = Model.getNewModel();

                return ko.mapping.fromJS(KoModel);
            };

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.dataLoaded = ko.observable(false);
        self.addAdhocContributors = ko.observable(false);
        params.baseModel.registerElement("search-box");
        params.baseModel.registerComponent("split-bill-request", "upi");
        self.adhocContributorList = ko.observableArray();
        self.refreshList = ko.observable(true);
        self.imageUploadFlag = ko.observable(false);
        self.contentIdMap = ko.observable({});

        let maxPayer;

        ko.utils.extend(self, params.rootModel);
        self.contributorsList = ko.observableArray();
        self.avatarList = ko.observableArray();
        self.modelInstance = params.rootModel.params && params.rootModel.params.fromBack ? ko.mapping.fromJS(params.rootModel.params.modelInstance) : getNewKoModel();

        if (params.rootModel.params && params.rootModel.params.fromBack) {
            self.dataLoaded(params.rootModel.params.dataLoaded);
            maxPayer = params.rootModel.params.maxPayer;
            self.contributorsList(params.rootModel.params.contributorsList);
            self.avatarList(params.rootModel.params.avatarList);
        }

        self.onClickDeleteContributor85 = function(newValue) {
            const obj = ko.utils.arrayFirst(self.avatarList(), function(element) {
                return element.vpaId === newValue.vpaId;
            });

            self.avatarList.remove(obj);

            if (self.contributorsList().indexOf(obj) !== -1) { self.contributorsList()[self.contributorsList().indexOf(obj)].isSelected.removeAll(); }
        };

        self.onClickAddAdhocContributor16 = function() {
            if (maxPayer <= self.avatarList().length) {
                params.baseModel.showMessages(null, [self.nls.SelectContributors.maxPayeeLimit], "ERROR");
            } else {
                self.addAdhocContributors(true);
                self.adhocContributorList.push("");
            }
        };

        self.onClickProceed18 = function() {
            if (maxPayer <= self.avatarList().length) {
                params.baseModel.showMessages(null, [self.nls.SelectContributors.maxPayeeLimit], "ERROR");
            } else if (self.avatarList().length === 0) {
                params.baseModel.showMessages(null, [self.nls.SelectContributors.minPayeeLimit], "ERROR");
            } else if (params.rootModel.params && params.rootModel.params.fromBack) {
                params.dashboard.loadComponent("split-bill-request", ko.mapping.toJS({
                    currentDate: self.params.currentDate,
                    validityInDays: self.params.validityInDays,
                    maxDate: self.params.maxDate,
                    avatarList: self.params.avatarList,
                    contributorsLoaded: self.params.contributorsLoaded,
                    myAmount: self.params.myAmount,
                    payeeMap: self.params.payeeMap,
                    vpaIdArray: self.params.vpaIdArray,
                    vpaArrayMap: self.params.vpaArrayMap,
                    userName: self.params.userName,
                    userInitials: self.params.userInitials,
                    dataLoaded: self.params.dataLoaded,
                    contributorsList: self.params.contributorsList,
                    maxPayer: self.params.maxPayer,
                    modelInstance: self.modelInstance,
                    dataObj  : self.params.dataObj,
                    fromBack: true
                }));
            } else {
                params.dashboard.loadComponent("split-bill-request", ko.mapping.toJS({
                    dataLoaded: self.dataLoaded,
                    contributorsList: self.contributorsList,
                    avatarList: self.avatarList,
                    maxPayer: maxPayer,
                    modelInstance: self.modelInstance,
                    fromBack: false
                }));
            }
        };

        self.onClickDeleteadhoccontributor51 = function(index) {
            self.adhocContributorList.splice(index, 1);
        };

        self.onClickAddAdhocContributor3 = function() {
            Model.checkValidity(self.adhocContributorList()[self.adhocContributorList().length - 1]).then(function(responseDTO) {
                if (responseDTO.unique) {

                    if (maxPayer <= (self.avatarList().length + self.adhocContributorList().length)) {
                        params.baseModel.showMessages(null, [self.nls.SelectContributors.maxPayeeLimit], "ERROR");
                    } else {
                        self.adhocContributorList.push("");
                    }
                } else {
                    params.baseModel.showMessages(null, [params.baseModel.format(self.nls.SelectContributors.invalidVPA, {
                        VPAId: self.adhocContributorList()[self.adhocContributorList().length - 1]
                    })], "ERROR");
                }
            });
        };

        self.onClickDone10 = function() {
            Model.checkValidity(self.adhocContributorList()[self.adhocContributorList().length - 1]).then(function(responseDTO) {
                if (!responseDTO.unique) {
                    params.baseModel.showMessages(null, [params.baseModel.format(self.nls.SelectContributors.invalidVPA, {
                        VPAId: self.adhocContributorList()[self.adhocContributorList().length - 1]
                    })], "ERROR");
                } else {
                    for (let i = 0; i < self.adhocContributorList().length; i++) {
                        if (self.adhocContributorList()[i] !== "") {
                            self.avatarList.push({
                                name: null,
                                initial: oj.IntlConverterUtils.getInitials(self.adhocContributorList()[i].split(/[\.\_\-]/)[0], self.adhocContributorList()[i].split(/[\.\_\-]/)[1]),
                                vpaId: self.adhocContributorList()[i],
                                contentId: null
                            });
                        }
                    }

                    self.adhocContributorList.removeAll();
                    self.addAdhocContributors(false);
                }
            });
        };

        self.onClickBack83 = function() {
            self.addAdhocContributors(false);
            self.adhocContributorList.removeAll();
        };

        self.selectionChangeHandler = function(event) {
            if (event.detail.value.length > 0) {
                if (maxPayer <= self.avatarList().length) {
                    params.baseModel.showMessages(null, [self.nls.SelectContributors.maxPayeeLimit], "ERROR");
                } else {
                    self.avatarList.push(ko.utils.arrayFirst(self.contributorsList(), function(element) {
                        return element.vpaId === event.detail.value[0];
                    }));
                }
            } else if (event.detail.previousValue[0] && event.detail.value.length === 0) {
                self.avatarList.remove(ko.utils.arrayFirst(self.contributorsList(), function(element) {
                    return element.vpaId === event.detail.previousValue[0];
                }));
            }
        };

        /**
         * This function is used set batchRequest for payee image.
         *
         * @memberOf split-money-list
         * @function loadBatchRequest
         * @param {string} id  - It is contentId for payee image.
         * @returns {void}
         */
        function loadBatchRequest(id) {
            if (Object.keys(self.contentIdMap()).length !== batchRequest.batchDetailRequestList.length) {
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
        }
        /**
         * This function is used set payee list.
         *
         * @memberOf split-money-list
         * @function subPayees
         * @param {object} payeeList  - It is list of payees in payee group.
         * @returns {void}
         */

        function subPayees(payeeList, groupContentId) {

            for (let i = 0; i < payeeList.length; i++) {
                const contentId = payeeList[i].contentId && payeeList[i].contentId.value ? payeeList[i].contentId.value : groupContentId;

                if (contentId) {

                    if (!self.contentIdMap()[contentId]) {
                        self.contentIdMap()[contentId] = ko.observable();
                        loadBatchRequest(contentId);
                    }
                }

                self.contributorsList.push({
                    name: payeeList[i].name,
                    initial: oj.IntlConverterUtils.getInitials(payeeList[i].name.split(/\s+/)[0], payeeList[i].name.split(/\s+/)[1]),
                    vpaId: payeeList[i].vpaId,
                    isSelected: ko.observableArray(),
                    contentId: contentId ? self.contentIdMap()[contentId] : ko.observable(null)
                });

            }
        }
        /**
         * This function is used set payee image.
         *
         * @memberOf split-money-list
         * @function loadBatchImages
         * @returns {void}
         */

        function loadBatchImages() {
            Model.batchRead(batchRequest).then(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    if (responseDTO.contentDTOList[0].contentId.value) { self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content); }
                }
            });
        }

        /**
         * This function is used set payee list from payee group.
         *
         * @memberOf split-money-list
         * @function setContributorsList
         * @param {object} data  - It is list of payee groups.
         * @returns {void}
         */
        function setContributorsList(data) {
            for (let i = 0; i < data.length; i++) {
                subPayees(data[i].listPayees, data[i].contentId ? data[i].contentId.value : null);
            }
        }

        if (!(params.rootModel.params && params.rootModel.params.fromBack)) {
            Promise.all([Model.getPayeeMaintenance(), Model.paymentspayeeGroupget()]).then(function(response) {
                self.imageUploadFlag(ko.utils.arrayFirst(response[0].configurationDetails, function(element) {
                    return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue);

                maxPayer = Number(ko.utils.arrayFirst(response[0].configurationDetails, function(element) {
                    return element.propertyId === "UPI_SPLIT_BILL_MAX_CONTRIBUTORS";
                }).propertyValue);

                setContributorsList(response[1].payeeGroups);

                if (batchRequest.batchDetailRequestList.length) {
                    loadBatchImages();
                }

                self.dataLoaded(true);
            });

        }

        self.dataSource91 = new oj.ArrayTableDataSource(self.contributorsList, { idAttribute: "vpaId" });
    };
});