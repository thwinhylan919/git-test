define([
    "knockout",
      "ojL10n!resources/nls/transaction-cutoff",
  "ojs/ojinputtext",
  "ojs/ojnavigationlist"
], function(ko, resourceBundle) {
  "use strict";

  const vm = function(rootParams) {
    const self = this;

    if(rootParams.menuSelection){
      self.menuSelection = ko.observable(rootParams.menuSelection);
      }else{
        self.menuSelection = ko.observable("STANDARD");
      }

    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("nav-bar");

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuSubscribe = self.menuSelection.subscribe(function(newValue) {
      if (newValue === "STANDARD") {
        const paramOne = {
          menuSelection : "STANDARD"
        };

        rootParams.dashboard.loadComponent("standard-work-window", paramOne);
      } else if (newValue === "EXCEPTION") {
        const paramTwo = {
          menuSelection : "EXCEPTION"
        };

        rootParams.dashboard.loadComponent("cutoff-exceptions", paramTwo);
      }
    });

    if (rootParams.disableNav) {
      if (rootParams.type === "STANDARD") {
        self.menuOptions = ko.observable([{
            id: "STANDARD",
            label: self.nls.labels.standardWorkingWindow,
            disabled: false
          },
          {
            id: "EXCEPTION",
            label: self.nls.labels.exceptionWindow,
            disabled: true
          }
        ]);
      }

      if (rootParams.type === "EXCEPTION") {
        self.menuOptions = ko.observable([{
            id: "STANDARD",
            label: self.nls.labels.standardWorkingWindow,
            disabled: true
          },
          {
            id: "EXCEPTION",
            label: self.nls.labels.exceptionWindow,
            disabled: false
          }
        ]);
      }
    } else {
      self.menuOptions = ko.observable([{
          id: "STANDARD",
          label: self.nls.labels.standardWorkingWindow,
          disabled: false
        },
        {
          id: "EXCEPTION",
          label: self.nls.labels.exceptionWindow,
          disabled: false
        }
      ]);
    }
  };

  vm.prototype.dispose = function() {
    this.menuSubscribe.dispose();
  };

  return vm;
});