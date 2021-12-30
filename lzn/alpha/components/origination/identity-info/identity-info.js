define([
  "ojs/ojcore",
  "knockout",

  "./model",

  "ojL10n!lzn/alpha/resources/nls/origination/identity-info",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup"
], function(oj, ko, IdentityInfoModelObject, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);

    self.validateDate = ko.pureComputed(function() {
      return [{
        type: "datetimeRange",
        options: {
          min: self.todayIsoDate,
          max: self.maxIsoDate,
          hint: {
            inRange: rootParams.baseModel.format(self.resource.messages.expiryDaterange, {
              startDate: self.currdate,
              endDate: self.expdate
            })
          },
          messageDetail: {
            rangeOverflow: rootParams.baseModel.format(self.resource.messages.expiryDateError, {
              expdate: self.expdate
            })
          }
        }
      }];
    });

    const IdentityInfoModel = new IdentityInfoModelObject(),
      getNewKoModel = function(model) {
        const KoModel = IdentityInfoModel.getNewModel(model);

        KoModel.selectedValues = ko.observable(KoModel.selectedValues);

        return KoModel;
      };

    self.resource = resourceBundle;

    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
    }

    self.existingIdentitiesLoaded = ko.observable(false);
    self.identificationTypes = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.groupValid = ko.observable();
    self.productDetails().applicantType = ko.observable("anonymous");

    if (!self.applicantObject().identityInfo) {
      self.applicantObject().identityInfo = getNewKoModel();
    }

    self.initializeModel = function() {
      IdentityInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);

      IdentityInfoModel.getIdentificationTypeList().then(function(data) {
        self.identificationTypes(data.enumRepresentations[0].data);

        IdentityInfoModel.getExistingIdentity().then(function(data) {
          self.applicantObject().identityInfo.identityInfo = [{}];

          if (data.identifications) {
            for (let i = 0; i < data.identifications.length; i++) {
              self.applicantObject().identityInfo.identityInfo[0] = getNewKoModel(data.identifications[i]).identificationDTOs[0];
              self.applicantObject().identityInfo.selectedValues.type = rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), data.identifications[i].type);

              if (data.identifications[i].expiryDate) {
                self.applicantObject().identityInfo.identityInfo[0].expiryDate = data.identifications[i].expiryDate.substring(0, 10);
              }
            }
          } else {
            self.applicantObject().identityInfo.identityInfo[0] = getNewKoModel().identificationDTOs[0];
          }

          if (self.applicantObject().applicantType() === "customer") {
            self.applicantObject().identityInfo.disableInputs = true;
          } else {
            self.applicantObject().identityInfo.disableInputs = false;
          }

          self.existingIdentitiesLoaded(true);
        });
      });
    };

    self.initializeModel();

    self.identitytypeChanged = function(event, data) {
      if (data.option === "value") {
        self.existingIdentitiesLoaded(false);
        self.applicantObject().identityInfo.identityInfo[0].id = "";
        self.applicantObject().identityInfo.identityInfo[0].expiryDate = "";
        ko.tasks.runEarly();
        self.existingIdentitiesLoaded(true);
      }
    };

    const today = rootParams.baseModel.getDate(),
      dd = today.getDate(),
      mm = today.getMonth() + 1,
      yyyy = today.getFullYear() + 15,
      max = new Date(yyyy, mm, dd);

    self.expdate = mm + "/" + dd + "/" + yyyy;
    self.currdate = mm + "/" + dd + "/" + today.getFullYear();
    self.maxIsoDate = oj.IntlConverterUtils.dateToLocalIso(max);

    self.submitIdentityInfo = function() {
      const identityTracker = document.getElementById("identityTracker");

      if (identityTracker.valid === "valid") {
        self.applicantObject().identityInfo.selectedValues.type = rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), self.applicantObject().identityInfo.identityInfo[0].type);

        const payload = {
          identificationDTOs: self.applicantObject().identityInfo.identityInfo
        };

        if (self.applicantObject().applicantType() !== "customer") {
          IdentityInfoModel.saveModel(ko.toJSON(payload)).then(function(data) {
            if (data.identifications) {
              self.applicantObject().identityInfo.identityInfo[0].identificationId = data.identifications[0].identificationId;
            }

            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
          });
        } else {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        }
      } else {
        identityTracker.showMessages();
        identityTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});