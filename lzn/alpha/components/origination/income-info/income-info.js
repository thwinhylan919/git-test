define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/alpha/resources/nls/income-info",
  "ojs/ojinputnumber",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidationgroup"
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
        KoModel.grossAmount.currency = self.productDetails().currency;
        KoModel.netAmount.amount = ko.observable(KoModel.netAmount.amount);
        KoModel.netAmount.currency = self.productDetails().currency;
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);

        if (model && model.id) {
          KoModel.id = model.id;
        }

        return KoModel;
      };
    let deferredTracker1;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.occupations = ko.observableArray([]);
    self.incomeOptionsLoaded = ko.observable(false);
    self.frequencyOptionsLoaded = ko.observable(false);
    self.incomeOptions = ko.observableArray([]);
    self.incomeOptions(self.finIncomeOptions());
    self.frequencyOptions = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.existingIncomesLoaded = ko.observable(false);
    self.occupationType = ko.observable("");
    self.occupationStartDate = ko.observable("");
    self.currentIncomeData = {};
    rootParams.baseModel.registerElement("amount-input");
    IncomeInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);

    if (!self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo) {
      self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo = {
        isCompleting: ko.observable(true),
        incomeList: ko.observableArray([])
      };
    } else {
      self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList([]);
    }

    if (self.incomeOptions().length !== 0)
      {self.incomeOptionsLoaded(true);}

    const deferredTracker2 = IncomeInfoModel.getIncomeFrequency().then(function(data) {
      for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
        if (self.resource.skipFrequency.toUpperCase() === data.enumRepresentations[0].data[i].code) {
          data.enumRepresentations[0].data.splice(i, 1);
          break;
        }
      }

      self.frequencyOptions(data.enumRepresentations[0].data);
      self.frequencyOptionsLoaded(true);
    });

    $(document).on("focusout", ".grossIncome", function(data) {
      const index = data.target.id.replace(/\D/g, "");

      if (!self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[index].netAmount.amount()) {
        self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[index].netAmount.amount(data.target.value);
        self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[index].netAmount.currency = self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[index].grossAmount.currency;
      }
    });

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
        partyType: "IND",
        personalInfo: {
          primaryInfo: {
          salutation: "",
          firstName: "",
          middleName: null,
          lastName: "",
          suffix: "",
          birthDate: "",
          gender: "",
          maritalStatus: "",
          noOfDependants: "",
          citizenship: "",
          otherSalutation: "",
          permanentResidence: true,
          residentCountry: "",
          email: ""
        }
      }
      };

      IncomeInfoModel.createApplicant(ko.toJSON(payload)).then(function(data) {
        self.applicantObject().applicantId().value = data.applicantId.value;
        IncomeInfoModel.setApplicantId(self.applicantObject().applicantId().value);
        self.createEmploymentProfile();
      });
    };

    self.createEmploymentProfile = function() {
      const payload ={
        employmentDTOs : [{
          type: "",
          status: "",
          industry: "",
          occupation: "",
          department: "",
          designation: "",
          employeeId: "",
          grossAnnualSalary: {
            currency: "",
            amount: ""
          },
          employerName: "",
          reference: {
            name: "Markus",
            designation: "Manager"
          },
          employerAddress: {
            country: "",
            state: "",
            city: "",
            postalCode: "",
            line1: "",
            line2: ""
          },
          startDate: "",
          endDate: "",
          primary: false,
          profileStatus: "",
          temp_isActive: true,
          temp_isTypeDisable: true,
          temp_selectedValues: {
            type: "",
            status: "",
            country: ""
          },
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

    $.when(deferredTracker1, deferredTracker2).done(function() {
      self.existingIncomesLoaded(false);

      try {
        IncomeInfoModel.getExistingIncomes().then(function(data) {
          const tempIncomesList = ko.utils.arrayFilter(data.incomeDetails, function(income) {
            if (rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), income.type) !== "") {
              return income;
            }
          });

          for (let i = 0; i < tempIncomesList.length; i++) {
            tempIncomesList[i] = getNewKoModel(tempIncomesList[i]);

            tempIncomesList[i].temp_selectedValues = ko.observable({
              type: rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), tempIncomesList[i].type()),
              frequency: rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), tempIncomesList[i].frequency())
            });
          }

          self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList(tempIncomesList);
          self.existingIncomesLoaded(true);
        });
      } catch (err) {
        self.existingIncomesLoaded(true);
      }
    });

    self.getInitRequests = function() {
      return [{
          url: "financialTemplate?partyType=Individual&parameterType=Income",
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
    };

    self.deleteIncome = function(index, data, current) {
      if (current.id) {
        IncomeInfoModel.deleteModel(current.id).then(function() {
          data.incomeList().splice(index, 1);
          data.incomeList(data.incomeList());
        });
      } else {
        data.incomeList().splice(index, 1);
        data.incomeList(data.incomeList());
      }
    };

    self.editIncomeInfo = function(data, currentIncome) {
      let i = 0;

      for (i = 0; i < data.incomeList().length; i++) {
        if (data.incomeList()[i].temp_isActive()) {
          return;
        }
      }

      currentIncome.temp_isActive(true);
    };

    self.displayAddIncomeButton = function(data) {
      let i = 0;

      for (i = 0; i < data.incomeList().length; i++) {
        if (data.incomeList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    };

    self.displayFinalSubmit = ko.computed(function() {
      let i = 0;

      for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList().length; i++) {
        if (self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    });

    self.completeIncomeSection = function() {
      self.completeApplicationStageSection(applicantStages, applicantAccordion, rootParams.index + 1);
    };

    self.submitIncomeInfo = function(data) {
      const incomeInfoTracker = document.getElementById("incomeInfoTracker");

      if (incomeInfoTracker.valid === "valid") {
        self.currentIncomeData = data;
        self.currentIncomeData.netAmount.amount(self.currentIncomeData.grossAmount.amount());
        self.currentIncomeData.netAmount.currency = self.currentIncomeData.grossAmount.currency;
        self.currentIncomeData.frequency = self.currentIncomeData.frequency();

        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }

        if (!self.applicantObject().applicantId().value) {
          self.createApplicant();
        } else {
          self.submitIncomeData();
        }
      } else {
        incomeInfoTracker.showMessages();
        incomeInfoTracker.focusOn("@firstInvalidShown");
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
        profileId: self.employmentProfileId,
        incomeDetailsDTO: data
      })).then(function(data) {
        let i = 0;

        for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList().length; i++) {
          if (self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].temp_isActive()) {
            if (data.incomeDetail) {
              self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].id = data.incomeDetail.id;
            }

            self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].type);
            self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].frequency);
            self.applicantObject().financialProfile[self.profileIdIndex].incomeInfo.incomeList()[i].temp_isActive(false);
          }
        }
      });
    };

    self.dispose = function() {
      self.displayFinalSubmit.dispose();
    };
  };
});