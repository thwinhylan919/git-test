define([
  "knockout",
  "ojL10n!resources/nls/preview-brand",
  "./model"
], function (ko, locale, Model) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.nls = locale;
    rootParams.dashboard.headerName(self.nls.heading);
    rootParams.baseModel.registerComponent("preview-brand", "theme-config");
    self.brandList = ko.observableArray();
    self.applyDisabled = ko.observable(true);

    const payLoad = {
      batchDetailRequestList: []
    };

    self.getGenericViewModelInstance = function ($root) {
      $root.fetchCurrentBrand.then(function (currentBrandData) {
        if (currentBrandData.assetDTO && currentBrandData.assetDTO.brandId) {
          self.currentAppliedBrandId = currentBrandData.assetDTO.brandId;
        }

        Model.fetchBrands().then(function (brandData) {
          if (brandData.brandDTOs.length) {
            brandData.brandDTOs.forEach(function (brand) {
              payLoad.batchDetailRequestList.push({
                methodType: "GET",
                uri: {
                  value: "/brands/user/{id}",
                  params: {
                    id: brand.brandId
                  }
                },
                headers: {
                  "Content-Id": brand.brandId,
                  "Content-Type": "application/json"
                }
              });
            });

            Model.fireBatch(payLoad).then(function (data) {
              const batchResponseList = data.batchDetailResponseDTOList;

              ko.utils.arrayPushAll(self.brandList, brandData.brandDTOs.map(function (brand) {
                brand.styleAsset = JSON.parse(atob(batchResponseList.find(function (item) {
                  return item.sequenceId === brand.brandId;
                }).responseObj.assetDTO.asset));

                return brand;
              }));
            });
          }
        });
      });
    };

    self.getCurrentAppliedBrand = function (brandId) {
      return brandId === self.currentAppliedBrandId;
    };

    self.brandSelected = function (brandData) {
      const currentSelection = document.querySelector(".selectedBrand");

      if (currentSelection) {
        currentSelection.classList.remove("selectedBrand");
      }

      document.querySelector("div[selectedBrandDiv='" + brandData.brandId + "']").classList.add("selectedBrand");
      self.applyDisabled(brandData.brandId === self.currentAppliedBrandId);
    };

    self.applyBrand = function () {
      Model.createMapping(JSON.stringify({
        brandId: document.querySelector(".selectedBrand").getAttribute("selectedBrandDiv")
      })).then(function () {
        rootParams.baseModel.switchPage({
          homeComponent: "side-menu",
          homeModule: "security",
          sideMenuOption: "themes"
        }, true);
      });
    };

    self.revertToDefault = function () {
      Model.deleteMapping().then(function () {
        rootParams.baseModel.switchPage({
          homeComponent: "side-menu",
          homeModule: "security",
          sideMenuOption: "themes"
        }, true);
      });
    };
  };
});