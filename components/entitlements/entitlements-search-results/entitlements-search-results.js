define([
  "ojs/ojcore",
  "knockout",

  "./model",

  "ojL10n!resources/nls/authorization",
  "ojs/ojknockout-keyset",
  "ojs/ojtreeview",
  "ojs/ojjsontreedatasource",
  "promise"
], function(oj, ko, EntitlementSearchResultModel, resourceBundle, keySet) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("edit-entitlement", "entitlements");
    self.expandFlag = ko.observable(false);
    self.expanded = new keySet.ObservableExpandedKeySet().add([self.category().id]);

    if (self.expanded()._keys.size > 0) {
      self.expandFlag(true);
    }

    self.renderer = oj.KnockoutTemplateUtils.getRenderer("item_template", true);

    self.edit = function(data) {
      const entitlementList = [],
        batchRequestList = [];

      for (let i = 0; i < data.actions.length; i++) {
        const request = {
          methodType: "GET",
          uri: {
            value: "/entitlements/{id}",
            params: {
              id: data.actions[i].entitlmentId
            }
          },
          headers: {
            "Content-Type": "application/json",
            "Content-Id": i + 1
          }
        };

        batchRequestList.push(request);
      }

      EntitlementSearchResultModel.fireBatch({
        batchDetailRequestList: batchRequestList
      }).done(function(data2) {
        for (let y = 0; y < data2.batchDetailResponseDTOList.length; y++) {
          const batchResponseDTO = data2.batchDetailResponseDTOList[y].responseObj;

          if (batchResponseDTO.entitlements) {
            entitlementList.push(batchResponseDTO.entitlements);
          }
        }

        const params = {
          module: self.module()[0].displayName,
          category: self.category().displayName,
          data: entitlementList,
          loaded: 0
        };

        rootParams.dashboard.loadComponent("edit-entitlement", params);
      });
    };
  };
});