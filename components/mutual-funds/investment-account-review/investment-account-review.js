define([

  "knockout",

  "ojL10n!resources/nls/investment-account-review",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle, InvestmentAccountModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.pageHeading);
    self.updateMessage = ko.observable(self.resource.pageHeading);
    self.openInvestmentAccountData = ko.observable(params.rootModel.params.openInvestmentAccountData);
    self.showAdditionalDetailsSection = ko.observable(params.rootModel.params.showAdditionalDetailsSection);
    self.selectedStepValueIA = ko.observable(params.rootModel.params.selectedStepValueIA);
    self.selectedComponent = ko.observable(params.rootModel.params.selectedComponent);
    self.stepArray = ko.observableArray(params.rootModel.params.stepArray);
    params.baseModel.registerElement("confirm-screen");

    self.editSection = function(sectionName) {

      switch (sectionName) {
        case "personal-details":
          {
            self.selectedStepValueIA("investment-account-personal-details");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "contact-details":
          {
            self.selectedStepValueIA("investment-account-contact-details");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "nominee-details":
          {
            self.selectedStepValueIA("investment-account-nomination-details");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "fatca-details":
          {
            self.selectedStepValueIA("investment-account-fatca");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "primary-assets":
          {
            self.selectedStepValueIA("investment-account-additional-details");
            self.selectedComponent("investment-account-primary-asset");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              selectedComponent: self.selectedComponent(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "primary-liabilities":
          {
            self.selectedStepValueIA("investment-account-additional-details");
            self.selectedComponent("investment-account-primary-liabilities");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              selectedComponent: self.selectedComponent(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "relatives":
          {
            self.selectedStepValueIA("investment-account-additional-details");
            self.selectedComponent("investment-account-relatives");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              selectedComponent: self.selectedComponent(),
              stepArray: self.stepArray()
            });

            break;
          }
        case "investments":
          {
            self.selectedStepValueIA("investment-account-additional-details");
            self.selectedComponent("investment-account-investments");

            params.dashboard.loadComponent("open-investment-account-train", {
              openInvestmentAccountData: self.openInvestmentAccountData(),
              showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
              selectedStepValueIA: self.selectedStepValueIA(),
              selectedComponent: self.selectedComponent(),
              stepArray: self.stepArray()
            });

            break;
          }
      }
    };

    self.confirmScreenCreateMessage = function() {

      return self.resource.confirmScreenMsg;
    };

    self.submit = function() {

      if (self.showAdditionalDetailsSection() && self.openInvestmentAccountData().additionalDetails.relatives[0] && self.openInvestmentAccountData().additionalDetails.relatives[0].name) {
        self.openInvestmentAccountData().additionalDetails.relatives.forEach(function(relative) {
          if (relative.dependent === "Yes") {
            relative.dependent = true;
          } else if (relative.dependent === "No") {
            relative.dependent = false;
          }
        });
      }

      const payload = {
        personalDetails: self.openInvestmentAccountData().personalDetails,
        addressDetails: self.openInvestmentAccountData().addressDetails,
        contactDetails: self.openInvestmentAccountData().contactDetails,
        fatcaDetails: self.openInvestmentAccountData().fatcaDetails,
        identityInfo: self.openInvestmentAccountData().identityInfo,
        nominees: self.openInvestmentAccountData().nominees,
        additionalDetails: self.openInvestmentAccountData().additionalDetails

      };

      payload.nominees[0].sharePercentage = parseFloat(payload.nominees[0].sharePercentage);

      if (!self.showAdditionalDetailsSection()) {
        delete payload.additionalDetails;
      }

      InvestmentAccountModel.createInvestmentAccount(ko.mapping.toJSON(payload, {
        ignore: ["temp_type", "showExistingSection", "selectedNominee", "liabilityRequired", "assetRequired", "relativeRequired", "investmentRequired", "disableFields",
          "temp_nomrelationship", "temp_invRelationship"
        ]
      })).done(function(data, status, jqXhr) {
        const confirmScreenObj = {
            referenceNumber: data.investmentAccountDTO.referenceNumber
          },

          confirmScreenDetailsArray = [];

        confirmScreenDetailsArray.push(confirmScreenObj);

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.updateMessage(),
          confirmScreenExtensions: {
            isSet: true,
            confirmScreenMsgEval: self.confirmScreenCreateMessage,
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/open-investment-account",
            resourceBundle: self.resource
          },
          template: "confirm-screen/open-investment-account-cards"
        });
      });
    };
  };
});
