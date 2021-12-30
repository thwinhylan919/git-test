define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/create-relationship-mapping",
    "ojs/ojtable",
    "ojs/ojcheckboxset",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup"
  ],
  function(oj, ko, $, resourceBundle) {
    "use strict";

    /**
     * Return function - description.
     *
     * @param  {type} rootParams - Description.
     * @return {type}            Description.
     */
    return function(rootParams) {
      const self = this;

      ko.utils.extend(self, rootParams.rootModel);
      self.resource = resourceBundle;
      self.groupValid = ko.observable();

      self.dataSource = new oj.ArrayTableDataSource(self.relationshipArray(), {
        idAttribute: "channekRelDesc"
      });

      /**
       *
       */
      self.columnArray = [{
          renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
          headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
          id: "column1"
        }, {
          headerText: self.resource.relationshipId,
          field: "channekRelDesc",
          id: "column2"
        },
        {
          headerText: self.resource.mapRelationship,
          renderer: oj.KnockoutTemplateUtils.getRenderer("inputbox_tmpl", true),
          id: "column3"
        }
      ];

      const tracker = document.getElementById("tracker");

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.reviewRelationship = function() {
        if (tracker.valid === "valid") {
          rootParams.baseModel.registerComponent("review-relationship-mapping", "relationship-mapping");
          self.relationshipMappingBase("review-relationship-mapping");
          self.currentView("review");
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      };

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.backFirst = function() {
        self.currentView("view");
        self.relationshipMappingBase("review-relationship-mapping");
      };

      /**
       * anonymous function - description
       *
       * @return {type}  description
       */
      self.validators = ko.computed(function() {
        return [{
          type: "regExp",
          options: {
            pattern: "[a-zA-Z]{1,15}",
            messageDetail: self.resource.errorMessage.hostCode
          }
        }];
      });

      self.selectAllListener = function(event) {
        let i;
        const totalSize = self.dataSource.totalSize();

        if (event.detail) {
          if (event.detail.value.length > 0 && event.detail.value[0] === "checked") {
            for (i = 0; i < totalSize; i++) {
              self.dataSource.at(i).then(function(row) {
                row.data.Selected(["checked"]);
              });
            }
          } else {
            for (i = 0; i < totalSize; i++) {
              self.dataSource.at(i).then(function(row) {
                row.data.Selected([]);
              });
            }
          }
        }
      };

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.checkboxClicked = function() {
        setTimeout(function() {
          const relArrayLen = self.relationshipArray().length;

          for (let i = 0; i < relArrayLen; i++) {
            if (self.relationshipArray()[i].Selected()[0] === "checked") {
              self.relationshipArray()[i].disabled(false);

              if (!self.relationshipArray()[i].hostRelId()) {
                self.relationshipArray()[i].hostRelId(JSON.parse(JSON.stringify(self.relationshipArray()[i].channelRelId)));
              }
            } else {
              self.relationshipArray()[i].disabled(true);
            }
          }
        }, 0);
      };

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.dispose = function() {
        self.validators.dispose();
      };

      $("#relationship-table").on("click", ".oj-checkboxset", self.checkboxClicked);
    };
  });