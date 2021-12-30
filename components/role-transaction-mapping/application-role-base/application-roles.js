define([
  "knockout",
  "ojL10n!resources/nls/authorization",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function (ko, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("transaction-mapping-search", "role-transaction-mapping");
    rootParams.baseModel.registerComponent("application-role-create", "role-transaction-mapping");
    self.verifyAndEdit = ko.observable(false);
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);

    self.observables = function (input, keys) {
      if (!Array.isArray(input) && !(input && typeof input === "object" && input.constructor === Object)) {
        return;
      }

      keys = !Array.isArray(keys) ? [keys] : keys;

      let prop;

      for (prop in input) {
        if (Object.prototype.hasOwnProperty.call(input, prop)) {
          self.observables(input[prop], keys);

          if (keys.indexOf(prop) !== -1 && !ko.isObservable(input[prop])) {
            if (Array.isArray(input[prop])) {
              input[prop] = ko.observableArray(input[prop]);
            } else {
              input[prop] = ko.observable();
            }
          }
        }
      }
    };

    self.openCreatePanel = function () {
      rootParams.dashboard.loadComponent("application-role-create", {
        verifyAndEdit: self.verifyAndEdit
      });
    };
  };
});