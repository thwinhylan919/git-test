define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/expense-info",
  "ojs/ojswitch",
  "ojs/ojvalidationgroup"
], function (ko, $, ExpenseInfoModelObject, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this,
      ExpenseInfoModel = new ExpenseInfoModelObject();
    let i = 0;
    const getNewKoModel = function () {
      const KoModel = ExpenseInfoModel.getNewModel();

      KoModel.type = ko.observable(KoModel.type);
      KoModel.frequency = ko.observable(KoModel.frequency);
      KoModel.amount.amount = ko.observable(KoModel.amount.amount);
      KoModel.amount.currency = ko.observable(self.localCurrency);
      KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
      KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);

      return KoModel;
    },
      transformFetchedData = function (data) {
        const tempExpensesList = ko.utils.arrayFilter(data.expenses, function (expense) {
          if (expense.type !== "") {
            return expense;
          }
        });

        for (i = 0; i < tempExpensesList.length; i++) {
          tempExpensesList[i].type = ko.observable(tempExpensesList[i].type);
          tempExpensesList[i].frequency = ko.observable(tempExpensesList[i].frequency);
          tempExpensesList[i].amount.amount = ko.observable(tempExpensesList[i].amount.amount);
          tempExpensesList[i].amount.currency = ko.observable(tempExpensesList[i].amount.currency);
          tempExpensesList[i].temp_isActive = ko.observable(false);

          tempExpensesList[i].temp_selectedValues = ko.observable({
            frequency: rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), tempExpensesList[i].frequency())
          });
        }

        return tempExpensesList;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;

    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
      self.employmentProfileId(rootParams.empProfileIds()[0]);
    }

    self.groupValid = ko.observable();
    self.expenditureOptionsLoaded = ko.observable(false);
    self.expenditureOptions = ko.observableArray([]);
    self.frequencyOptionsLoaded = ko.observable(false);
    self.frequencyOptions = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.currencyOptionsLoaded = ko.observable(false);
    self.currencyList = ko.observable({});
    self.existingExpensesLoaded = ko.observable(false);
    self.maximumExpensesAllowed = 5;

    self.applicantObject().expenseInfo = {
      expenseList: ko.observableArray([])
    };

    const payloadEmployments = {
      status: "",
      employerName: "",
      primary: true
    },
      empDTOs = [];

    empDTOs.push(payloadEmployments);

    ExpenseInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);

    self.initializeModel = function () {
      ExpenseInfoModel.fetchEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function (data) {
        if (data.employmentProfiles) {
          let profileId = null;

          for (let i = 0; i < data.employmentProfiles.length; i++) {
            if (data.employmentProfiles[i].primary) {
              profileId = data.employmentProfiles[i].id;
              break;
            }
          }

          ExpenseInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, profileId);
          self.applicantObject().profileId = profileId;
          self.fetchOtherdetails();
        } else {
          ExpenseInfoModel.saveEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function (data) {
            if (data.employmentProfiles && data.employmentProfiles[0]) {
              ExpenseInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, data.employmentProfiles[0].id);
              self.applicantObject().profileId = data.employmentProfiles[0].id;
              self.fetchOtherdetails();
            }
          });
        }
      });
    };

    self.fetchOtherdetails = function () {
      ExpenseInfoModel.fetchCurrencyMasterList().done(function (data) {
        if (data.enumRepresentations && data.enumRepresentations.length > 0 && data.enumRepresentations[0].data) {
          self.currencyList().currencies = data.enumRepresentations[0].data;
        } else {
          self.currencyList().currencies = [];
        }

        self.currencyOptionsLoaded(true);

        ExpenseInfoModel.getFrequencyList().done(function (data) {
          for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
            if (self.resource.skipFrequency.toUpperCase() === data.enumRepresentations[0].data[i].code) {
              data.enumRepresentations[0].data.splice(i, 1);
              break;
            }
          }

          self.frequencyOptions(data.enumRepresentations[0].data);
          self.frequencyOptionsLoaded(true);

          ExpenseInfoModel.getExistingExpenses().done(function (data) {
            if (!self.applicantObject().newApplicant) {
              let showComplete = false;

              if (self.checkDataAvailability(data.expenses, rootParams.applicantStages.id)) {
                showComplete = true;
              }

              self.showIcon(showComplete, rootParams.applicantStages);
            }

            self.existingExpensesLoaded(false);
            self.applicantObject().expenseInfo.expenseList(transformFetchedData(data));

            if (!self.applicantObject().expenseInfo.expenseList()[0]) {
              self.addExpense(self.applicantObject().expenseInfo);
              self.applicantObject().expenseInfo.expenseList()[0].temp_isActive(true);
            }

            self.existingExpensesLoaded(true);
          });
        });
      });
    };

    self.initializeModel();

    self.addExpense = function (data) {
      if (self.applicantObject().expenseInfo.expenseList().length < self.maximumExpensesAllowed) {
        data.expenseList.push(getNewKoModel());
      } else {
        $("#limitExceededExpense").trigger("openModal");
      }
    };

    self.deleteExpense = function (index, data, current) {
      if (current.id) {
        ExpenseInfoModel.deleteModel(current.id);
      }

      data.expenseList.splice(index, 1);
      data.expenseList(data.expenseList());
    };

    self.editExpenseInfo = function (data, currentExpense) {
      for (i = 0; i < data.expenseList().length; i++) {
        if (data.expenseList()[i].temp_isActive()) {
          return;
        }
      }

      currentExpense.temp_isActive(true);
    };

    self.displayAddExpenseButton = function (data) {
      for (i = 0; i < data.expenseList().length; i++) {
        if (data.expenseList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    };

    self.displayFinalSubmit = ko.computed(function () {
      for (i = 0; i < self.applicantObject().expenseInfo.expenseList().length; i++) {
        if (self.applicantObject().expenseInfo.expenseList()[i].temp_isActive()) {
          return false;
        }
      }

      return true;
    });

    self.completeExpenseSection = function () {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };

    self.submitExpenseInfo = function (event, data) {
      const expenseInfoTracker = document.getElementById("expenseInfoTracker");

      if (expenseInfoTracker.valid === "valid") {
        data.frequency = ko.utils.unwrapObservable(data.frequency);

        ExpenseInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.applicantObject().profileId,
          expense: data
        })).done(function (data) {
          let i;

          for (i = 0; i < self.applicantObject().expenseInfo.expenseList().length; i++) {
            if (self.applicantObject().expenseInfo.expenseList()[i].temp_isActive()) {
              if (data.expense) {
                self.applicantObject().expenseInfo.expenseList()[i].id = data.expense.id;
              }

              self.applicantObject().expenseInfo.expenseList()[i].temp_selectedValues().frequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().expenseInfo.expenseList()[i].frequency);
              self.applicantObject().expenseInfo.expenseList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        expenseInfoTracker.showMessages();
        expenseInfoTracker.focusOn("@firstInvalidShown");
      }
    };

    self.dispose = function () {
      self.displayFinalSubmit.dispose();
    };
  };
});
