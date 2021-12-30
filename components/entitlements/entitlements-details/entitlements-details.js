define([

  "knockout",

  "ojL10n!resources/nls/authorization",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojnavigationlist",
  "promise"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.menuSelection = ko.observable();
    self.componentId = ko.observable(true);
    self.showNavBar = ko.observable(true);
    rootParams.baseModel.registerElement("nav-bar");
    self.menuSelection(self.actions[0].entitlmentId);

    self.uiOptions = {
      menuFloat: "right",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.selectedResourceType = ko.observable("SVC");

    self.display = function() {
      self.menuSelection.subscribe(function(newValue) {
        ko.utils.arrayForEach(self.actions, function(item) {
          if (item.entitlmentId === newValue) {
            self.componentId(false);
            self.componentId(true);
          }
        });
      });
    };

    self.buttonChange = function(event) {
      if (event.detail.value === "SVC") {
        self.display();
      } else {
        self.display();
      }
    };
  };
});