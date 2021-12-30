define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/gamma/resources/nls/income-info",
  "ojs/ojinputnumber",
  "ojs/ojdatetimepicker"
], function(ko, $, IncomeInfoModelObject, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let applicantType;
    const IncomeInfoModel = new IncomeInfoModelObject(),
      applicantStages = rootParams.applicantStages,
      applicantAccordion = rootParams.applicantAccordion,
      getNewKoModel = function(model) {
        const KoModel = IncomeInfoModel.getNewModel(model);

        KoModel.type = ko.observable(KoModel.type);
        KoModel.frequency = ko.observable(KoModel.frequency);
        KoModel.grossAmount.amount = ko.observable(KoModel.grossAmount.amount);
        KoModel.grossAmount.currency = rootParams.dashboard.appData.localCurrency;
        KoModel.netAmount.amount = ko.observable(KoModel.netAmount.amount);
        KoModel.netAmount.currency = rootParams.dashboard.appData.localCurrency;
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);

        if (model && model.id) {
          KoModel.id = model.id;
        }

        return KoModel;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.groupValid = ko.observable();
    self.occupations = ko.observableArray([]);
    self.incomeOptionsLoaded = ko.observable(false);
    self.frequencyOptionsLoaded = ko.observable(false);
    self.incomeOptions = ko.observableArray([]);
    self.frequencyOptions = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.existingIncomesLoaded = ko.observable(false);
    self.occupationType = ko.observable("");
    self.occupationStartDate = ko.observable("");
    self.currentIncomeData = {};

    const payloadEmployments = {
        status: "",
        employerName: "",
        primary: true
      },
      empDTOs = [];

    empDTOs.push(payloadEmployments);

    self.applicantObject().incomeInfo = {
      incomeList: ko.observableArray([])
    };

    self.displayFinalSubmit = ko.observable(false);
    rootParams.baseModel.registerElement("amount-input");
    IncomeInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);

    self.initializeModel = function() {
      IncomeInfoModel.fetchEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function(data) {
        if (data.employmentProfiles) {
          let profileId = null;

          for (let i = 0; i < data.employmentProfiles.length; i++) {
            if (data.employmentProfiles[i].primary) {
              profileId = data.employmentProfiles[i].id;
              break;
            }
          }

          IncomeInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, profileId);
          self.applicantObject().profileId = profileId;
          self.fetchOtherdetails();
        } else {
          IncomeInfoModel.saveEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function(data) {
            if (data.employmentProfiles && data.employmentProfiles[0]) {
              IncomeInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, data.employmentProfiles[0].id);
              self.applicantObject().profileId = data.employmentProfiles[0].id;
              self.fetchOtherdetails();
            }
          });
        }
      });
    };

    self.initializeModel();

    self.fetchOtherdetails = function() {
      IncomeInfoModel.getIncomeFrequency().then(function(data) {
        if (data.enumRepresentations[0]) {
          self.frequencyOptions(data.enumRepresentations[0].data);
        }

        self.frequencyOptionsLoaded(true);

        IncomeInfoModel.fetchIncomeOptions(self.productDetails().productType).then(function(data) {
          if (data.parameter) {
            self.incomeOptions(data.parameter);
          }

          self.incomeOptionsLoaded(true);

          IncomeInfoModel.fetchExistingIncomes().then(function(data) {
            if (!self.applicantObject().newApplicant) {
              let showComplete = false;

              if (self.checkDataAvailability(data.incomeDetails, rootParams.applicantStages.id)) {
                showComplete = true;
              }

              self.showIcon(showComplete, rootParams.applicantStages);
            }

            let i;

            if (data.incomeDetails && data.incomeDetails.length > 0) {
              let j = 0;

              for (i = 0; i < data.incomeDetails.length; i++) {
                if (rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), data.incomeDetails[i].type)) {
                  self.applicantObject().incomeInfo.incomeList().push(getNewKoModel(data.incomeDetails[i]));
                  self.displayFinalSubmit(true);

                  if (!self.applicantObject().newApplicant && !self.productDetails().sectionBeingEdited() && data.incomeDetails[i].grossAmount.amount === 0) {
                    self.applicantObject().incomeInfo.incomeList()[j].grossAmount.amount("");
                    self.applicantObject().incomeInfo.incomeList()[j].netAmount.amount("");
                    self.showIcon(false, rootParams.applicantStages);
                    self.applicantObject().incomeInfo.incomeList()[j].temp_isActive(true);
                    self.displayFinalSubmit(false);
                    rootParams.applicantStages.isComplete(false);
                  }

                  self.applicantObject().incomeInfo.incomeList()[j].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().incomeInfo.incomeList()[j].frequency());
                  self.applicantObject().incomeInfo.incomeList()[j].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), self.applicantObject().incomeInfo.incomeList()[j].type());
                  j++;
                }
              }
            } else {
              self.addIncome(0, self.applicantObject().incomeInfo);
            }

            self.existingIncomesLoaded(true);
          });
        });
      });
    };

    if (rootParams.coApplicant) {
      applicantType = "CO_APPLICANT";
    } else {
      applicantType = "APPLICANT";
    }

    self.createApplicant = function() {
      const payload = {
        facilityId: self.productDetails().facilityId,
        productGroupSerialNumber: self.productGroupSerialNumber(),
        applicantRelationshipType: applicantType,
        applicantType: "IND",
        personalInfo:  {
          salutation: "",
          firstName: "",
          middleName: null,
          lastName: "",
          suffix: "",
          birthDate: "",
          citizenship: "",
          otherSalutation: "",
          permanentResidence: true,
          email: "",
          citizenshipStatus: null
        }
      };

      IncomeInfoModel.createApplicant(ko.toJSON(payload)).then(function(data) {
        self.applicantObject().applicantId().value = data.applicantId.value;
        IncomeInfoModel.setApplicantId(self.applicantObject().applicantId().value);
        self.createEmploymentProfile();
      });
    };

    self.createEmploymentProfile = function() {
      const payload = {
        employmentDTOs:[{
          type: "",
          status: "",
          employerName: "",
          startDate: "",
          endDate: "",
          primary: false,
          profileStatus: "",
          temp_isActive: true,
          temp_isStatusEligible: true,
          temp_selectedValues: {
            type: "",
            status: ""
          },
          temp_startDateMonths: "",
          temp_startDateYears: "",
          temp_setProfileStatus: false
        }]
      };

      payload.type = self.occupationType()[0];
      payload.startDate = self.occupationStartDate();

      IncomeInfoModel.createEmploymentProfile(rootParams.baseModel.removeTempAttributes(payload)).then(function(data) {
        self.employmentProfileId(data.employmentProfile.id);

        if (self.currentIncomeData.netAmount) {
          self.submitIncomeData();
        } else {
          self.completeApplicationStageSection(applicantStages, applicantAccordion, rootParams.index + 1);
        }
      });
    };

    self.getInitRequests = function() {
      return [{
          url: "financialTemplate?applicantType=Individual&parameterType=Income",
          method: "GET",
          successHandler: self.successHandlerIncomeOptions
        },
        {
          url: "enumerations/frequency?for={type}",
          method: "GET",
          successHandler: self.successHandlerFrequencyOptions
        }
      ];
    };

    self.addIncome = function(data) {
      data.incomeList.push(getNewKoModel());
      self.displayFinalSubmit(false);
    };

    self.deleteIncome = function(index, current, data) {
      if (current.id) {
        IncomeInfoModel.deleteModel(current.id).then(function() {
          data.incomeList().splice(index, 1);
          data.incomeList(data.incomeList());
          self.displayFinalSubmit(true);
        });
      } else {
        data.incomeList().splice(index, 1);
        data.incomeList(data.incomeList());
        self.displayFinalSubmit(true);
      }
    };

    self.editIncomeInfo = function(index, data) {
      for (let i = 0; i < data.incomeList().length; i++) {
        if (data.incomeList()[i].temp_isActive()) {
          return;
        }
      }

      self.displayFinalSubmit(false);
      data.incomeList()[index].temp_isActive(true);
    };

    self.displayAddIncomeButton = function(data) {
      for (let i = 0; i < data.incomeList().length; i++) {
        if (data.incomeList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    };

    self.completeIncomeSection = function() {
      self.completeApplicationStageSection(applicantStages, applicantAccordion, rootParams.index + 1);
    };

    self.submitIncomeInfo = function(data) {
      self.currentIncomeData = data;
      self.currentIncomeData.netAmount.amount(self.currentIncomeData.grossAmount.amount());
      self.currentIncomeData.netAmount.currency = self.currentIncomeData.grossAmount.currency;
      self.currentIncomeData.frequency = "ANNUALLY";

      const tracker = document.getElementById("income-tracker");

      if (tracker.valid === "valid") {
        if (!self.applicantObject().applicantId().value) {
          self.createApplicant();
        } else {
          self.submitIncomeData();
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.submitIncomeData = function() {
      const data = self.currentIncomeData;

      if (parseInt(data.netAmount.amount(), 10) > parseInt(data.grossAmount.amount(), 10)) {
        $("#ERROR").trigger("openModal");

        return;
      }

      data.type = ko.utils.unwrapObservable(data.type);
      data.frequency = ko.utils.unwrapObservable(data.frequency);
      data.finacialParameterDescription = rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), ko.utils.unwrapObservable(data.type));

      IncomeInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
        profileId: self.applicantObject().profileId,
        incomeDetailsDTO: data
      })).then(function(data) {
        for (let i = 0; i < self.applicantObject().incomeInfo.incomeList().length; i++) {
          if (self.applicantObject().incomeInfo.incomeList()[i].temp_isActive()) {
            if (data.incomeDetail) {
              self.applicantObject().incomeInfo.incomeList()[i].id = data.incomeDetail.id;
            }

            self.applicantObject().incomeInfo.incomeList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), self.applicantObject().incomeInfo.incomeList()[i].type);
            self.applicantObject().incomeInfo.incomeList()[i].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().incomeInfo.incomeList()[i].frequency);
            self.applicantObject().incomeInfo.incomeList()[i].temp_isActive(false);
            self.displayFinalSubmit(true);
          }
        }
      });
    };
  };
});
