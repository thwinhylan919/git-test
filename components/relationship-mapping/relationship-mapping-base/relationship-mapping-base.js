define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/relationship-mapping"
], function (ko, relationshipMappingBaseModel, resourceBundle) {
  "use strict";

  /**
   * Return function - description.
   *
   * @param  {type} rootParams - Description.
   * @return {type}            Description.
   */
  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.helpResource = resourceBundle.help;
    self.relationshipMappingBaseLoaded = ko.observable(false);
    self.relationshipMappingBase = ko.observable();
    self.currentView = ko.observable("");
    self.createOrUpdate = ko.observable("");
    self.relationshipArray = ko.observable([]);
    self.version = ko.observable("");
    self.rmKey = ko.observable("");
    self.initialRelationshipArray = [];
    self.approvalView = ko.observable(false);

    self.reviewTransactionName = {
      header: self.nls.reviewHeader1,
      reviewHeader: self.nls.reviewHeader
    };

    rootParams.dashboard.headerName(self.nls.relationshipMappingMaintenance);

    if (rootParams && rootParams.rootModel && rootParams.rootModel.params && rootParams.rootModel.params.data) {
      self.createPayloadToReview = ko.mapping.toJS(rootParams.rootModel.params.data);
    }

    relationshipMappingBaseModel.fetchRelationshipEnum().then(function (enumData) {
      relationshipMappingBaseModel.fetchRelationshipMapping().then(function (data) {
        let relMapLen = 0;

        if (data.accountRelationshipMaintenaces) {
          data = data.accountRelationshipMaintenaces[0];
          self.version(data.version);
          self.rmKey(data.maintenanceId);
        }

        if (self.createPayloadToReview) {
          data = self.createPayloadToReview;
          self.approvalView(true);
        }

        if (data.accountRelationshipMaintenaceDTOs) {
          relMapLen = data.accountRelationshipMaintenaceDTOs.length;
        }

        const reEnumLen = enumData.enumRepresentations[0].data.length;

        if (relMapLen > 0) {
          let initialRelArrayCount = 0;

          for (let i = 0; i < reEnumLen; i++) {
            self.relationshipArray()[i] = {};

            for (let j = 0; j < relMapLen; j++) {
              if (data.accountRelationshipMaintenaceDTOs[j].relationshipCode === enumData.enumRepresentations[0].data[i].code) {
                self.relationshipArray()[i] = {
                  Selected: ko.observable(["checked"]),
                  channelRelId: enumData.enumRepresentations[0].data[i].code,
                  channekRelDesc: rootParams.baseModel.format(self.nls.relationshipMappingDescription, {
                    relationshipId: enumData.enumRepresentations[0].data[i].code,
                    relationshipDescrip: enumData.enumRepresentations[0].data[i].description
                  }),
                  hostRelId: ko.observable(data.accountRelationshipMaintenaceDTOs[j].hostRelationshipCode),
                  disabled: ko.observable(false)
                };

                self.initialRelationshipArray[initialRelArrayCount++] = {
                  Selected: ["checked"],
                  channelRelId: enumData.enumRepresentations[0].data[i].code,
                  channekRelDesc: rootParams.baseModel.format(self.nls.relationshipMappingDescription, {
                    relationshipId: enumData.enumRepresentations[0].data[i].code,
                    relationshipDescrip: enumData.enumRepresentations[0].data[i].description
                  }),
                  hostRelId: data.accountRelationshipMaintenaceDTOs[j].hostRelationshipCode,
                  disabled: false
                };

                break;
              }

              if (j === relMapLen - 1) {
                self.relationshipArray()[i] = {
                  Selected: ko.observable([]),
                  channelRelId: enumData.enumRepresentations[0].data[i].code,
                  channekRelDesc: rootParams.baseModel.format(self.nls.relationshipMappingDescription, {
                    relationshipId: enumData.enumRepresentations[0].data[i].code,
                    relationshipDescrip: enumData.enumRepresentations[0].data[i].description
                  }),
                  hostRelId: ko.observable(""),
                  disabled: ko.observable(true)
                };
              }
            }
          }

          self.createOrUpdate("update");

          if (self.createPayloadToReview) {
            self.currentView("review");
          } else {
            self.currentView("view");
          }

          self.relationshipMappingBase("review-relationship-mapping");
          rootParams.baseModel.registerComponent("review-relationship-mapping", "relationship-mapping");
        } else {
          let m;

          for (m = 0; m < reEnumLen; m++) {
            self.relationshipArray()[m] = {
              Selected: ko.observable([]),
              channelRelId: enumData.enumRepresentations[0].data[m].code,
              channekRelDesc: rootParams.baseModel.format(self.nls.relationshipMappingDescription, {
                relationshipId: enumData.enumRepresentations[0].data[m].code,
                relationshipDescrip: enumData.enumRepresentations[0].data[m].description
              }),
              hostRelId: ko.observable(""),
              disabled: ko.observable(true)
            };
          }

          self.createOrUpdate("create");
          self.currentView("create");
          self.relationshipMappingBase("create-relationship-mapping");
          rootParams.baseModel.registerComponent("create-relationship-mapping", "relationship-mapping");
        }

        self.relationshipMappingBaseLoaded(true);
      });
    });

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.viewRelationshipMatrix = function () {
      rootParams.baseModel.registerComponent("relationship-matrix-base", "relationship-matrix");
      rootParams.dashboard.loadComponent("relationship-matrix-base", self);
    };
  };
});