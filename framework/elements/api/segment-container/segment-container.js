define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/segment-container",
    "./model",
    "text!./segment-container.json",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojprogress",
    "ojs/ojinputnumber",
    "ojs/ojknockout",
    "ojs/ojprogress"
], function(oj, ko, $, resourceBundle, SegmentContainerModel, SegmentMap) {
    "use strict";

    return function(params) {

        const self = this,
            segmentMap = JSON.parse(SegmentMap);

        self.iconMap = {
            getStarted: "getStarted",
            completed: "completed",
            autoFilled: "autoFilled",
            inProgress: "inProgress"
        };

        let pageHeader;

        self.nls = resourceBundle;
        self.isDatasegmentset = ko.observable(false);
        self.review = ko.observable(false);
        self.selectedParty = ko.observable();

        self.productData = ko.observable({
            productId: null,
            module: null,
            rests: null,
            dataSegments: [],
            payload: null,
            data: null
        });

        self.dataSource = ko.observable();
        self.progressValue = ko.observable(0);
        self.remainingProgress = ko.observable(100);
        params.baseModel.registerElement("segment-wrapper");
        params.baseModel.registerElement("segment-review");
        params.baseModel.registerElement("modal-window");

        function loadNextSegment(event) {
            let currentSegmentIndex, nextSegment;
            const noOfSegements = self.productData().dataSegments.length;

            self.productData().dataSegments.forEach(function(item, index) {
                if (item.id === event.currentSegment().id) {
                    currentSegmentIndex = index;
                    item.status = "completed";
                }
            });

            if (currentSegmentIndex < noOfSegements - 1) {
                currentSegmentIndex++;
                nextSegment = self.productData().dataSegments[currentSegmentIndex];
                nextSegment.status = "inProgress";
                event.currentSegment(nextSegment);
            } else {
                self.back();
            }
        }

        self.goToSegment = function(event) {
            if (event.status !== "Completed") {
                event.status = "inProgress";
            }

            params.dashboard.loadComponent(
                "segment-wrapper", {
                    iconMap: self.iconMap,
                    selectedParty: self.selectedParty,
                    productData: self.productData(),
                    currentSegment: event,
                    saveAndReview: self.saveAndReview,
                    loadNextSegment: loadNextSegment,
                    back: self.back,
                    saveAsDraft: self.saveAsDraft,
                    goToSegment: self.goToSegment,
                    pageHeader: pageHeader
                }
            );
        };

        self.loadSegment = function(event) {
            self.productData().dataSegments.forEach(function(segment) {
                if (event.detail.items[0].key === segment.id) {
                    self.goToSegment(segment);
                }
            });
        };

        self.back = function(event) {
            params.dashboard.hideDetails();
        };

        self.saveAndReview = function() {
            if ($(".incomplete").length) {
                $(".incomplete").addClass("highlight-section");

                return false;
            }

            params.dashboard.loadComponent("segment-review", {
                productData: self.productData(),
                saveAsDraft: self.saveAsDraft,
                back: self.back,
                goToSegment: self.goToSegment,
                pageHeader: pageHeader
            });

        };

        self.saveAsDraft = function() {
            if (self.productData().payload && self.productData().dataSegments && self.productData().dataSegments.length) {
                self.productData().payload.stages = ko.observableArray();

                for (let t = 0; t < self.productData().dataSegments.length; t++) {
                    self.productData().payload.stages.push({
                        id: self.productData().dataSegments[t].id,
                        status: self.productData().dataSegments[t].status
                    });
                }
            }

            const options = {
                url: self.productData().rests.draft.url,
                version: self.productData().rests.draft.version,
                data: ko.toJSON({
                    payload: {
                        typeOf: "GenericAppicationDetailsDTO",
                        json: self.productData().payload
                    },
                    moduleId: self.productData().data.module,
                    draftName: self.productData().draftName(),
                    type: self.productData().data.type,
                    partyId: self.productData().data.partyId,
                    amount: {
                        amount: self.productData().data.amount,
                        currency: self.productData().data.currency
                    },
                    status: "DRAFT"
                })
            };

            SegmentContainerModel.postDraftData(options).then(function(data) {
                params.baseModel.registerComponent(
                    self.productData().confirmPage,
                    self.productData().module
                );

                params.dashboard.loadComponent(self.productData().confirmPage, {
                    data: data,
                    mode: "draft"
                });
            });
        };

        const initialiseSegments = function(productData) {
            if (params.rootModel.previousState && params.rootModel.previousState.productData) {
                self.productData(params.rootModel.previousState.productData);

                const noOfSegements = self.productData().dataSegments.length;

                self.productData().dataSegments.forEach(function(segment) {
                    if (segment.status === "completed") {
                        self.progressValue(self.progressValue() + (100 / noOfSegements));
                    }
                });

                self.remainingProgress(100 - self.progressValue());
            } else {
                if (productData.jsonData) {
                    productData = productData.jsonData;
                }

                const moduleData = segmentMap.product[productData.productId],
                    dataSegments = productData.dataSegments ? productData.dataSegments : moduleData.defaultSegments;

                self.productData().productId = productData.productId;
                self.productData().module = moduleData.module;
                self.productData().confirmPage = moduleData.confirmPage;
                self.productData().rests = moduleData.rests;
                self.productData().partySelector = moduleData.partySelector;
                params.baseModel.registerComponent(self.productData().partySelector, self.productData().module);
                self.productData().payload = productData.payload ? productData.payload : {};
                self.productData().data = productData.data;
                self.productData().stages = productData.payload && productData.payload.stages ? productData.payload.stages() : {};

                for (let z = 0; z < dataSegments.length; z++) {
                    const segmentId = dataSegments[z];

                    if (segmentMap.segments[segmentId] && self.productData().stages.length && segmentMap.segments[segmentId].id === self.productData().stages[z].id()) {
                        segmentMap.segments[segmentId].status = self.productData().stages[z].status();
                    } else {
                        segmentMap.segments[segmentId].status = "getStarted";
                    }

                    self.productData().dataSegments.push(segmentMap.segments[segmentId]);

                    params.baseModel.registerComponent(
                        segmentMap.segments[segmentId].id,
                        self.productData().module
                    );
                }
            }

            pageHeader = self.nls.productHeader[self.productData().productId].header;
            params.dashboard.headerName(pageHeader);

            self.dataSource = new oj.ArrayTableDataSource(self.productData().dataSegments, {
                idAttribute: "id"
            });

            self.isDatasegmentset(true);
        };

        initialiseSegments(params.rootModel.params);
    };
});