define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/assets-info",
  "ojs/ojinputnumber",
  "ojs/ojvalidationgroup"
], function (ko, $, AssetsInfoModelObject, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this,
      AssetsInfoModel = new AssetsInfoModelObject();
    let i = 0;
    const getNewKoModel = function () {
      const KoModel = AssetsInfoModel.getNewModel();

      KoModel.type = ko.observable(KoModel.type);
      KoModel.value.amount = ko.observable(KoModel.value.amount);
      KoModel.value.currency = ko.observable(self.localCurrency);
      KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
      KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);

      return KoModel;
    },
      transformFetchedData = function (data) {
        const tempAssetsList = ko.utils.arrayFilter(data.assetDetails, function (assets) {
          for (let i = 0; i < self.assetTypeData().length; i++) {
            if (self.assetTypeData()[i].code === assets.type) {
              return assets;
            }
          }
        });

        for (i = 0; i < tempAssetsList.length; i++) {
          let finDesc;

          tempAssetsList[i].type = ko.observable(tempAssetsList[i].type);
          tempAssetsList[i].value.amount = ko.observable(tempAssetsList[i].value.amount);
          tempAssetsList[i].value.currency = ko.observable(tempAssetsList[i].value.currency);
          tempAssetsList[i].temp_isActive = ko.observable(false);

          for (let j = 0; j < self.assetTypeData().length; j++) {
            if (self.assetTypeData()[j].code === tempAssetsList[i].type()) {
              finDesc = self.assetTypeData()[j].description;
            }
          }

          tempAssetsList[i].temp_selectedValues = ko.observable({
            type: finDesc
          });
        }

        return tempAssetsList;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();

    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
      self.employmentProfileId(rootParams.empProfileIds()[0]);
    }

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.employmentProfileId = rootParams.applicantObject.profileId;
    self.assetTypeData = ko.observableArray([]);
    self.assetDataLoaded = ko.observable(false);
    self.currencyOptionsLoaded = ko.observable(false);
    self.currencyList = ko.observable({});
    self.validationTracker = ko.observable();
    self.existingAssetsLoaded = ko.observable(false);
    self.maximumAssetsAllowed = 5;
    rootParams.baseModel.registerElement("amount-input");

    self.applicantObject().assetsInfo = {
      assetsList: ko.observableArray([])
    };

    const payloadEmployments = {
      status: "",
      employerName: "",
      primary: true
    },
      empDTOs = [];

    empDTOs.push(payloadEmployments);
    AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);

    self.initializeModel = function () {
      AssetsInfoModel.fetchEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function (data) {
        if (data.employmentProfiles) {
          let profileId = null;

          for (let i = 0; i < data.employmentProfiles.length; i++) {
            if (data.employmentProfiles[i].primary) {
              profileId = data.employmentProfiles[i].id;
              break;
            }
          }

          AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, profileId);
          self.applicantObject().profileId = profileId;
          self.fetchOtherdetails();
        } else {
          AssetsInfoModel.saveEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function (data) {
            if (data.employmentProfiles && data.employmentProfiles[0]) {
              AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, data.employmentProfiles[0].id);
              self.applicantObject().profileId = data.employmentProfiles[0].id;
              self.fetchOtherdetails();
            }
          });
        }
      });
    };

    self.fetchOtherdetails = function () {
      AssetsInfoModel.fetchCurrencyMasterList().done(function (data) {
        if (data.enumRepresentations && data.enumRepresentations.length > 0 && data.enumRepresentations[0].data) {
          self.currencyList().currencies = data.enumRepresentations[0].data;
        } else {
          self.currencyList().currencies = [];
        }

        self.currencyOptionsLoaded(true);

        AssetsInfoModel.getAssetTypeList(self.productDetails().productType).then(function (data) {
          if (data.financialAssetType && data.financialAssetType.length > 0 ) {
            self.assetTypeData(data.financialAssetType);
          }

          self.assetDataLoaded(true);

          AssetsInfoModel.getExistingAssets().done(function (data) {
            if (!self.applicantObject().newApplicant) {
              let showComplete = false;

              if (self.checkDataAvailability(data.assetDetails, rootParams.applicantStages.id)) {
                showComplete = true;
              }

              self.showIcon(showComplete, rootParams.applicantStages);
            }

            self.existingAssetsLoaded(false);
            self.applicantObject().assetsInfo.assetsList(transformFetchedData(data));
            self.existingAssetsLoaded(true);
          });
        });
      });
    };

    self.initializeModel();

    self.addAsset = function (data) {
      if (self.applicantObject().assetsInfo.assetsList().length < self.maximumAssetsAllowed) {
        data.assetsList.push(getNewKoModel());
      } else {
        $("#limitExceededAsset").trigger("openModal");
      }
    };

    self.deleteAsset = function (index, data, current) {
      if (current.id) {
        AssetsInfoModel.deleteModel(current.id);
      }

      data.assetsList().splice(index, 1);
      data.assetsList(data.assetsList());
    };

    self.editAssetInfo = function (data, currentAsset) {
      for (i = 0; i < data.assetsList().length; i++) {
        if (data.assetsList()[i].temp_isActive()) {
          return;
        }
      }

      currentAsset.temp_isActive(true);
    };

    self.displayAddAssetButton = function (data) {
      for (i = 0; i < data.assetsList().length; i++) {
        if (data.assetsList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    };

    self.displayFinalSubmit = ko.computed(function () {
      for (i = 0; i < self.applicantObject().assetsInfo.assetsList().length; i++) {
        if (self.applicantObject().assetsInfo.assetsList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    });

    self.completeAssetsSection = function () {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };

    self.submitAssetInfo = function (event, data) {
      const assetsInfoTracker = document.getElementById("assetsInfoTracker");

      if (assetsInfoTracker.valid === "valid") {
        data.type(ko.utils.unwrapObservable(data.type));
        data.financialParameterDescription = rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), ko.utils.unwrapObservable(data.type));

        AssetsInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.applicantObject().profileId,
          assetDetails: data
        })).done(function (dataSaved) {
          for (let i = 0; i < self.applicantObject().assetsInfo.assetsList().length; i++) {
            if (self.applicantObject().assetsInfo.assetsList()[i].temp_isActive()) {
              if (dataSaved.assetDetails) {
                self.applicantObject().assetsInfo.assetsList()[i].id = dataSaved.assetDetails.id;
              }

              self.applicantObject().assetsInfo.assetsList()[i].temp_selectedValues().type = data.financialParameterDescription;
              self.applicantObject().assetsInfo.assetsList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        assetsInfoTracker.showMessages();
        assetsInfoTracker.focusOn("@firstInvalidShown");
      }
    };

    self.dispose = function () {
      self.displayFinalSubmit.dispose();
    };
  };
});
