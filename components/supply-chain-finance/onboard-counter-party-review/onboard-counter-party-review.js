define([
  "ojL10n!resources/nls/onboard-counter-party-review",
  "knockout",
  "./model",
  "ojs/ojformlayout",
  "ojs/ojbutton"
], function (resourceBundle, ko, Model) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.componentHeader);
    self.isVisible = ko.observable(true);
    self.dataLoaded = ko.observable(false);
    params.baseModel.registerComponent("counter-party-list", "supply-chain-finance");

    if (params.rootModel.params && params.rootModel.params.data && params.rootModel.params.data) {
      const promises = [];

      promises.push(Model.corporatecategoryget());
      promises.push(Model.countryget());
      promises.push(Model.stateget(params.rootModel.params.data.address.country));

      Promise.all(promises).then(function (array) {
        let categoryFound;

        if (array[0].jsonNode.ScfApplicationParamModelKeyCollection && array[0].jsonNode.ScfApplicationParamModelKeyCollection.length > 0 && array[0].jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel && array[0].jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel.length > 0) {
          categoryFound = false;

          let i;

          for (i = 0; i < array[0].jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel.length; i++) {
            if (array[0].jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].code === params.rootModel.params.data.category) {
              params.rootModel.params.data.categoryDesc = array[0].jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].description;
              categoryFound = true;
              break;
            }
          }

          if (!categoryFound) {
            params.rootModel.params.data.categoryDesc = self.nls.Others;
          }
        } else {
          params.rootModel.params.data.categoryDesc = self.nls.Others;
        }

        if (array[1].enumRepresentations && array[1].enumRepresentations[0].data.length > 0) {

          let i;

          for (i = 0; i < array[1].enumRepresentations[0].data.length; i++) {
            if (array[1].enumRepresentations[0].data[i].code === params.rootModel.params.data.address.country) {
              params.rootModel.params.data.address.countryName = array[1].enumRepresentations[0].data[i].description;
              break;
            }
          }

        } else {
          params.rootModel.params.data.address.countryName = self.nls.Others;
        }

        if (array[2].enumRepresentations && array[2].enumRepresentations.length > 0) {

          let i;

          for (i = 0; i < array[2].enumRepresentations[0].data.length; i++) {
            if (array[2].enumRepresentations[0].data[i].code === params.rootModel.params.data.address.state) {
              params.rootModel.params.data.address.stateName = array[2].enumRepresentations[0].data[i].description;
              break;
            }
          }
        } else {
          params.rootModel.params.data.address.stateName = self.nls.Others;
        }

        self.reviewData = ko.mapping.toJS(params.rootModel.params.data);
        self.dataLoaded(true);
      });

      self.isVisible(false);
    } else {
      self.reviewData = ko.mapping.toJS(params.rootModel.params.payload);
      self.dataLoaded(true);
    }

    self.onClickConfirm60 = function () {
      params.rootModel.params.onboardCounterParty().then(function (data) {
        self.goToConfirmScreen(data);
      });
    };

    self.onClickBack25 = function () {
      params.dashboard.hideDetails();
    };

    self.onClickCancel63 = function () {
      params.dashboard.switchModule(true);
    };

    self.goToConfirmScreen = function (data) {
      const confirmMessage = self.nls.confirmScreen.confirmMessage,
        transactionName = self.nls.componentHeader;

      params.dashboard.loadComponent("confirm-screen", {
        transactionResponse: data,
        transactionName: transactionName,
        customFields: {
          resourceBundle: self.nls,
          name: self.reviewData.name,
          mobileNumber: self.reviewData.mobileNumber
        },
        confirmScreenExtensions: {
          confirmScreenMsgEval: function () {
            return confirmMessage;
          },
          isSet: true,
          template: "supply-chain-finance/onboard-counter-party-create"
        }
      });
    };
  };
});