define([
    "ojs/ojcore",
    "knockout",

    "./model",

    "ojL10n!resources/nls/review-relationship-mapping",
    "ojs/ojtable",
    "ojs/ojcheckboxset",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext"
  ],
  function (oj, ko, reviewRelationshipMappingBaseModel, resourceBundle) {
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
      self.reviewResource = resourceBundle;

      const getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(reviewRelationshipMappingBaseModel.getNewModel());

        return KoModel;
      };

      self.checkedRelationshipArray = [];

      if (self.currentView() === "view") {
        const relArrayLen = self.relationshipArray().length,
          initialRelationshipArrayLen = self.initialRelationshipArray.length;

        for (let i = 0; i < relArrayLen; i++) {
          for (let j = 0; j < initialRelationshipArrayLen; j++) {
            if (self.relationshipArray()[i].channelRelId === self.initialRelationshipArray[j].channelRelId) {
              self.relationshipArray()[i].Selected(["checked"]);
              self.relationshipArray()[i].hostRelId(self.initialRelationshipArray[j].hostRelId);
              self.relationshipArray()[i].disabled(false);
              break;
            }

            if (j === initialRelationshipArrayLen - 1) {
              self.relationshipArray()[i].Selected([]);
              self.relationshipArray()[i].hostRelId("");
              self.relationshipArray()[i].disabled(true);
            }
          }
        }

        self.reviewDataSource = new oj.ArrayTableDataSource(self.relationshipArray(), {
          idAttribute: "channelRelId"
        });
      } else {
        let l;
        const reviewRelPayLen = self.relationshipArray().length;
        let countChecked = 0;

        for (l = 0; l < reviewRelPayLen; l++) {
          if (self.relationshipArray()[l].Selected()[0] === "checked") {
            self.checkedRelationshipArray[countChecked] = self.relationshipArray()[l];
            countChecked++;
          }
        }

        self.reviewDataSource = new oj.ArrayTableDataSource(self.checkedRelationshipArray, {
          idAttribute: "channelRelId"
        });
      }

      self.createRelationshipArray = {
        accountRelationshipMaintenaceDTOs: []
      };

      /**
       *
       */
      self.columnArray = [{
          renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
          headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
          id: "column1"
        }, {
          headerText: self.reviewResource.relationshipId,
          field: "channekRelDesc",
          id: "column2"
        },
        {
          headerText: self.reviewResource.mapRelationship,
          renderer: oj.KnockoutTemplateUtils.getRenderer("inputbox_tmpl", true),
          id: "column4"
        }
      ];

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.createRelationship = function () {
        let i;

        for (i = 0; i < self.checkedRelationshipArray.length; i++) {
          self.createRelationshipArray.accountRelationshipMaintenaceDTOs[i] = getNewKoModel().createRelationshipMappingPayload;
          self.createRelationshipArray.accountRelationshipMaintenaceDTOs[i].relationshipCode(self.checkedRelationshipArray[i].channelRelId);
          self.createRelationshipArray.accountRelationshipMaintenaceDTOs[i].hostRelationshipCode(self.checkedRelationshipArray[i].hostRelId);
        }

        self.createRelationshipArray.version = self.version();

        const rmKey = self.rmKey(),
          payload = ko.toJSON(self.createRelationshipArray);

        if (self.version()) {
          reviewRelationshipMappingBaseModel.updateRelationshipMapping(payload, rmKey).then(function (data) {
            self.confirmScreen(data);
          });
        } else {
          reviewRelationshipMappingBaseModel.createRelationshipMapping(payload).then(function (data) {
            self.confirmScreen(data);
          });
        }
      };

      /**
       * Self - confirmScreen.
       *
       * @param  {type} data   - - - - - - - - - - - - - - - Description.
       * @param  {type} status Description.
       * @param  {type} jqXhr  Description.
       * @return {type}        Description.
       */
      self.confirmScreen = function (data) {
        self.currentView("confirm");
        rootParams.baseModel.registerElement("confirm-screen");

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.reviewResource.confirmationMessage
        }, self);
      };

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.backFirst = function () {
        if (self.createOrUpdate() === "create") {
          self.currentView("create");
        } else {
          self.currentView("edit");
        }

        self.relationshipMappingBase("create-relationship-mapping");
      };

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.editRelationship = function () {
        self.currentView("edit");
        rootParams.baseModel.registerComponent("create-relationship-mapping", "relationship-mapping");
        self.relationshipMappingBase("create-relationship-mapping");
      };
    };
  });