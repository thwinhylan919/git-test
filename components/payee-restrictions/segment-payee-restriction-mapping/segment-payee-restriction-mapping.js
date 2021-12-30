/**
 * segment-payee-restriction-mapping.
 *
 * @module payee-restrictions
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} SegmentAuthenticationMapingModel
 * @requires {object} ResourceBundle
 */
define([
        "knockout",
    "./model",
    "ojL10n!resources/nls/segment-payee-restriction-mapping",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function(ko, SegmentAuthenticationMapingModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        rootParams.dashboard.headerName(self.nls.payeeSegment.header);
        self.enterpriseRole = ko.observable();
        self.segmentSelectedForRole = ko.observable(null);
        self.userSegmentsList = ko.observableArray();
        self.userSegmentsForRoleList = ko.observableArray();
        self.userSegmentsLoaded = ko.observable(false);
        self.userSegmentsForRoleLoaded = ko.observable(false);
        self.showCreateScreen =ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);
        rootParams.baseModel.registerComponent("payee-restrictions-landing", "payee-restrictions");
        rootParams.baseModel.registerComponent("create-payee-restrictions", "payee-restrictions");

        let targetType,targetValue;

        self.view = function() {
        if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("segmentTracker"))) {
            return;
        }

         targetType = self.segmentSelectedForRole() ? "SEGMENT" :"ROLE";
         targetValue = self.segmentSelectedForRole() ? self.segmentSelectedForRole(): self.enterpriseRole();

        SegmentAuthenticationMapingModel.listAllLimits(targetType, targetValue).then(function(data) {
            if (!data.payeeCountLimitList) {
                 self.showCreateScreen(true);
            }
            else{
            rootParams.dashboard.loadComponent("payee-restrictions-landing", ko.mapping.toJS({
                             targetType: targetType,
                             targetValue: targetValue,
                             userSegmentsList:self.userSegmentsList,
                             userSegmentsForRoleList:self.userSegmentsForRoleList,
                             userSegmentsLoaded:self.userSegmentsLoaded,
                             userSegmentsForRoleLoaded:self.userSegmentsForRoleLoaded,
                             enterpriseRole:self.enterpriseRole,
                             segmentSelectedForRole:self.segmentSelectedForRole,
                             showCreateScreen:self.showCreateScreen

                        }));
        }
        });
    };

       if(!(rootParams.rootModel.previousState && rootParams.rootModel.previousState.userSegmentsList)){
        SegmentAuthenticationMapingModel.listUserSegments().then(function(data) {
            self.userSegmentsList(data.enterpriseRoleDTOs);
            self.userSegmentsLoaded(true);
        });
       }

        self.openCreateMode =function(){
             rootParams.dashboard.loadComponent("create-payee-restrictions", ko.mapping.toJS({
                                 targetType: targetType,
                                 targetValue: targetValue,
                                 userSegmentsList:self.userSegmentsList,
                                 userSegmentsForRoleList:self.userSegmentsForRoleList,
                                 userSegmentsLoaded:self.userSegmentsLoaded,
                                 userSegmentsForRoleLoaded:self.userSegmentsForRoleLoaded,
                                 enterpriseRole:self.enterpriseRole,
                                 segmentSelectedForRole:self.segmentSelectedForRole,
                                 showCreateScreen:self.showCreateScreen
                             }));
        };

        self.back =function(){
            self.showCreateScreen(false);
        };

        self.enterpriseRoleChangeHandler = function() {
            self.userSegmentsForRoleLoaded(false);

            SegmentAuthenticationMapingModel.listUserSegmentsForRole(self.enterpriseRole()).then(function(data) {
                if (data && data.segmentdtos && data.segmentdtos.length > 0) {
                    self.userSegmentsForRoleList(data.segmentdtos);
                }

                self.userSegmentsForRoleLoaded(true);
            });
        };
    };
});