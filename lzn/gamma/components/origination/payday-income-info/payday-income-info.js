define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/gamma/resources/nls/income-info",
  "ojs/ojinputnumber",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidationgroup"
], function(ko, $, IncomeInfoModelObject, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let requirements;
    const IncomeInfoModel = new IncomeInfoModelObject(),
      getNewKoModel = function(model) {
        const KoModel = IncomeInfoModel.getNewModel(model);

        KoModel.type = ko.observable(KoModel.type);
        KoModel.frequency = ko.observable(KoModel.frequency);
        KoModel.grossAmount.amount = ko.observable(KoModel.grossAmount.amount);
        KoModel.grossAmount.currency = rootParams.dashboard.appData.localCurrency;
        KoModel.netAmount.amount = ko.observable(KoModel.netAmount.amount);
        KoModel.netAmount.currency = rootParams.dashboard.appData.localCurrency;
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.isEditableField = ko.observable(false);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);

        if (model && model.id) {
          KoModel.id = model.id;
        }

        return KoModel;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.incomeOptionsLoaded = ko.observable(false);
    self.frequencyOptionsLoaded = ko.observable(false);
    self.existingIncomesLoaded = ko.observable(false);
    self.incomeOptions = ko.observableArray([]);
    self.alternateOptions = ko.observableArray([]);
    self.incomeOptions([]);
    self.isNotFromReview = ko.observable(true);

    const payloadEmployments = {
        status: "",
        employerName: "",
        primary: true
      },
      empDTOs = [];

    empDTOs.push(payloadEmployments);

    const arraypayload = {
      employmentDTOs: empDTOs
    };

    self.alternateOptions([{
        code: "-1",
        description: self.resource.dayBefore
      },
      {
        code: "1",
        description: self.resource.dayAfter
      },
      {
        code: "0",
        description: self.resource.noChange
      }
    ]);

    self.frequencyOptions = ko.observableArray([]);
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerElement("amount-input");

    /**
     * Anonymous function - description.
     *
     * @return {type}  Description.
     */
    self.initializeModel = function() {
      IncomeInfoModel.fetchEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function(data) {
        if (data.employmentProfiles && !$.isEmptyObject(data.employmentProfiles)) {
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
          IncomeInfoModel.saveEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, ko.toJSON(arraypayload)).done(function(data) {
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

    if (!self.applicantObject().incomeInfo) {
      self.applicantObject().incomeInfo = {
        incomeList: ko.observableArray([])
      };

      self.applicantObject().incomeInfo.incomeList().push(getNewKoModel());
    }

    /**
     * Anonymous function - description.
     *
     * @return {type}  Description.
     */
    self.fetchOtherdetails = function() {
      IncomeInfoModel.getIncomeFrequency().then(function(data) {
        if (data.enumRepresentations[0]) {
          self.frequencyOptions(data.enumRepresentations[0].data);
        }

        self.frequencyOptionsLoaded(true);

        IncomeInfoModel.getIncomeOptions(self.productDetails().productType).then(function(data) {
          if (data.parameter) {
            self.incomeOptions(data.parameter);
          }

          self.incomeOptionsLoaded(true);

          IncomeInfoModel.fetchRequirements(self.productDetails().submissionId.value).then(function(data) {
            requirements = data.loanApplicationRequirementDTO;

            IncomeInfoModel.getExistingIncomes().then(function(data) {
              let incomeBlank = false;

              if (data.incomeDetails && data.incomeDetails.length > 0) {
                for (let i = 0; i < data.incomeDetails.length; i++) {
                  if (rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), data.incomeDetails[i].type)) {
                    self.applicantObject().incomeInfo.incomeList()[0] = getNewKoModel(data.incomeDetails[i]);

                    if (!self.applicantObject().newApplicant && !self.productDetails().sectionBeingEdited() && data.incomeDetails[i].grossAmount.amount === 0) {
                      self.applicantObject().incomeInfo.incomeList()[0].grossAmount.amount("");
                      self.applicantObject().incomeInfo.incomeList()[0].netAmount.amount("");
                      incomeBlank = true;
                    }

                    if (rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().incomeInfo.incomeList()[0].frequency()) === "") {
                      self.applicantObject().incomeInfo.incomeList()[0].frequency("");
                    }

                    self.applicantObject().incomeInfo.incomeList()[0].nextPayDate = requirements.nextPayDate;
                    self.applicantObject().incomeInfo.incomeList()[0].secondPayDate = requirements.secondPayDate;
                    self.applicantObject().incomeInfo.incomeList()[0].alternatePayDay = requirements.alternatePayDay;
                    self.applicantObject().incomeInfo.incomeList()[0].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().incomeInfo.incomeList()[0].frequency());
                    self.applicantObject().incomeInfo.incomeList()[0].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), self.applicantObject().incomeInfo.incomeList()[0].type());
                    self.applicantObject().incomeInfo.incomeList()[0].temp_selectedValues().alternatePayDay = rootParams.baseModel.getDescriptionFromCode(self.alternateOptions(), self.applicantObject().incomeInfo.incomeList()[0].alternatePayDay);
                    self.isNotFromReview(false);
                    break;
                  }
                }

                if (!self.applicantObject().newApplicant) {
                  let showComplete = false;

                  if (self.checkDataAvailability(requirements, rootParams.applicantStages.id) && !incomeBlank) {
                    self.showMandatoryFieldStatus(true, rootParams.applicantStages.id, self.applicantObject().incomeInfo.incomeList()[0].isEditableField);
                    showComplete = true;
                  } else {
                    self.showMandatoryFieldStatus(false, rootParams.applicantStages.id, self.applicantObject().incomeInfo.incomeList()[0].isEditableField);
                  }

                  self.showIcon(showComplete, rootParams.applicantStages);
                }
              }

              ko.tasks.runEarly();
              self.existingIncomesLoaded(true);
            });
          });
        });
      });
    };

    /**
     * Anonymous function - description.
     *
     * @return {type}  Description.
     */
    self.completeIncomeSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
    };

    self.comparePayDates = {
      validate: function(value) {
        const nextPayDate = self.applicantObject().incomeInfo.incomeList()[0].nextPayDate;

        if (new Date(nextPayDate).getTime() >= new Date(value).getTime()) {
          throw new Error(self.resource.messages.invalidSecondPayDay);
        }

        return true;
      }
    };

    /**
     * Anonymous function - description.
     *
     * @param  {type} event - - - - - - - - - - - - - - - - Description.
     * @param  {type} data  Description.
     * @return {type}       Description.
     */
    self.nextPayDayChange = function(event, data) {
      if (data.option === "value") {
        if (self.isNotFromReview()) {
          self.existingIncomesLoaded(false);
          self.applicantObject().incomeInfo.incomeList()[0].secondPayDate = "";
          ko.tasks.runEarly();
          self.existingIncomesLoaded(true);
        } else {
          self.isNotFromReview(true);
        }
      }
    };

    /**
     * Anonymous function - description.
     *
     * @param  {type} firstDate  - - - - - - - - - - - - - - - - Description.
     * @param  {type} secondDate Description.
     * @return {type}            Description.
     */
    self.calulateDiffInDays = function(firstDate, secondDate) {
      const startDay = new Date(firstDate),
        endDay = new Date(secondDate),
        millisecondsPerDay = 1000 * 60 * 60 * 24,
        millisBetween = endDay.getTime() - startDay.getTime(),
        days = millisBetween / millisecondsPerDay;

      return Math.floor(days);
    };

    /**
     * Anonymous function - description.
     *
     * @param  {type} event - - - - - - - - - - - - - - - - Description.
     * @param  {type} data  Description.
     * @return {type}       Description.
     */
    self.incomeTypeChanged = function(event, data) {
      if (data.option === "value") {
        for (let q = 0; q < self.applicantObject().incomeInfo.incomeList().length; q++) {
          if (data.value[0] === self.applicantObject().incomeInfo.incomeList()[q].type()) {
            self.applicantObject().incomeInfo.incomeList()[0] = self.applicantObject().incomeInfo.incomeList()[q];

            if (rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().incomeInfo.incomeList()[0].frequency()) === "") {
              self.applicantObject().incomeInfo.incomeList()[0].frequency = "";
            }

            self.existingIncomesLoaded(false);
            ko.tasks.runEarly();
            self.existingIncomesLoaded(true);
          }
        }
      }
    };

    /**
     * Anonymous function - description.
     *
     * @return {type}  Description.
     */
    self.submitIncomeInfo = function() {
      const tracker = document.getElementById("payday-income-tracker");

      if (tracker.valid === "valid") {
        let sendData = {
          profileId: self.applicantObject().profileId,
          incomeDetailsDTO: {
            type: ko.utils.unwrapObservable(self.applicantObject().incomeInfo.incomeList()[0].type),
            frequency: ko.utils.unwrapObservable(self.applicantObject().incomeInfo.incomeList()[0].frequency),
            grossAmount: {
              amount: ko.utils.unwrapObservable(self.applicantObject().incomeInfo.incomeList()[0].grossAmount.amount),
              currency: rootParams.dashboard.appData.localCurrency
            },
            netAmount: {
              amount: ko.utils.unwrapObservable(self.applicantObject().incomeInfo.incomeList()[0].grossAmount.amount),
              currency: rootParams.dashboard.appData.localCurrency
            },
            id: self.applicantObject().incomeInfo.incomeList()[0].id ? self.applicantObject().incomeInfo.incomeList()[0].id : null,
            nextPayDate: self.applicantObject().incomeInfo.incomeList()[0].nextPayDate,
            secondPayDate: self.applicantObject().incomeInfo.incomeList()[0].secondPayDate,
            alternatePayDay: ko.utils.unwrapObservable(self.applicantObject().incomeInfo.incomeList()[0].alternatePayDay)
          }
        };

        self.applicantObject().incomeInfo.incomeList()[0].temp_selectedValues().alternatePayDay = rootParams.baseModel.getDescriptionFromCode(self.alternateOptions(), self.applicantObject().incomeInfo.incomeList()[0].alternatePayDay);
        self.applicantObject().incomeInfo.incomeList()[0].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().incomeInfo.incomeList()[0].frequency());
        self.applicantObject().incomeInfo.incomeList()[0].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.incomeOptions(), self.applicantObject().incomeInfo.incomeList()[0].type());
        sendData = JSON.stringify(sendData);

        IncomeInfoModel.saveModel(sendData).done(function(data) {
          if (data.incomeDetail && data.incomeDetail.id) {
            self.applicantObject().incomeInfo.incomeList()[0].id = data.incomeDetail.id;
          }

          IncomeInfoModel.fetchRequirements(self.productDetails().submissionId.value).then(function(data) {
            requirements = data.loanApplicationRequirementDTO;
            requirements.nextPayDate = self.applicantObject().incomeInfo.incomeList()[0].nextPayDate;
            requirements.secondPayDate = self.applicantObject().incomeInfo.incomeList()[0].secondPayDate;
            requirements.alternatePayDay = ko.utils.unwrapObservable(self.applicantObject().incomeInfo.incomeList()[0].alternatePayDay);

            IncomeInfoModel.submitRequirements(self.productDetails().submissionId.value, ko.toJSON(requirements)).done(function() {
              self.completeIncomeSection();
            });
          });
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});