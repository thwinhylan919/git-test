define([

  "knockout",
  "jquery",
  "ojL10n!resources/nls/investment-account-nomination-details",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(ko, $, resourceBundle, NominationModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.openAccountHeader);
    self.nomineeType = ko.observable(self.resource.new);
    self.relationship = ko.observable([]);
    self.today = ko.observable(params.baseModel.getDate());
    self.relationshipsLoaded = ko.observable(false);
    self.showNominees = ko.observable(true);
    self.showExistingSection = ko.observable(false);
    self.existingNominees = ko.observable([]);
    self.nomineesfetched = ko.observable(false);
    params.baseModel.registerElement("modal-window");

    if (!self.openInvestmentAccountData().nominees[0].nomineeName) {
      self.openInvestmentAccountData().nominees[0].temp_type = ko.observable("New");
      self.openInvestmentAccountData().nominees[0].showExistingSection = ko.observable();
      self.openInvestmentAccountData().nominees[0].selectedNominee = ko.observable();
      self.openInvestmentAccountData().nominees[0].disableFields = ko.observable(false);
      self.openInvestmentAccountData().nominees[0].nomineeName = ko.observable(self.openInvestmentAccountData().nominees[0].nomineeName);
    }

    self.showSection = ko.observable(true);

    if (self.openInvestmentAccountData().nominees[0].nomineeName()) {
      self.nomineeCurrentCount = ko.observable(self.noOfNomineesAllowed() - self.openInvestmentAccountData().nominees.length);
    } else {
      self.nomineeCurrentCount = ko.observable(self.noOfNomineesAllowed() - 1);
    }

    NominationModel.fetchRelationshipTypes().done(function(data) {
      self.relationship(data.enumRepresentations[0].data);
      self.relationshipsLoaded(true);
    });

    NominationModel.fetchNominees().done(function(data) {
      self.existingNominees(data.nominees);
      self.nomineesfetched(true);
    });

    self.addNominee = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.showNominees(false);
        ko.tasks.runEarly();

        let pushObj = {};

        if (self.nomineeCurrentCount() > 0) {
          pushObj = {
            nomineeName: ko.observable(),
            relation: null,
            dateOfBirth: null,
            taxId: null,
            sharePercentage: null,
            temp_nomrelationship : null,
            temp_type: ko.observable("New"),
            showExistingSection: ko.observable(),
            selectedNominee: ko.observable(),
            disableFields: ko.observable(false)
          };

          self.openInvestmentAccountData().nominees.push(pushObj);
          self.showNominees(true);
          self.nomineeCurrentCount(self.nomineeCurrentCount() - 1);
        } else {
          self.showNominees(true);
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.deleteNominee = function(index) {
      self.nomineeCurrentCount(self.nomineeCurrentCount() + 1);
      self.showNominees(false);
      ko.tasks.runEarly();
      self.openInvestmentAccountData().nominees.splice(index, 1);
      self.showNominees(true);
    };

    self.showExistingNominee = function(index, event) {
      if (event.detail.value) {
        if (event.detail.value === "Existing") {
          self.showSection(false);
          ko.tasks.runEarly();
          self.openInvestmentAccountData().nominees[index].selectedNominee("");
          self.openInvestmentAccountData().nominees[index].nomineeName("");
          self.openInvestmentAccountData().nominees[index].dateOfBirth = "";
          self.openInvestmentAccountData().nominees[index].relation = "";
          self.openInvestmentAccountData().nominees[index].showExistingSection(true);
          self.showSection(true);
        } else {
          self.showSection(false);
          ko.tasks.runEarly();
          self.openInvestmentAccountData().nominees[index].selectedNominee("");
          self.openInvestmentAccountData().nominees[index].nomineeName("");
          self.openInvestmentAccountData().nominees[index].dateOfBirth = "";
          self.openInvestmentAccountData().nominees[index].relation = "";
          self.openInvestmentAccountData().nominees[index].showExistingSection(false);
          self.openInvestmentAccountData().nominees[index].disableFields(false);
          self.showSection(true);
        }
      }
    };

    self.nomineeSelectedHandler = function(index, event) {
      if (event.detail.value) {
        let populateFields = true;

        self.showNominees(false);
        ko.tasks.runEarly();

        self.openInvestmentAccountData().nominees.forEach(function(nominee) {
          if (nominee.nomineeName().toLowerCase() === event.detail.value.name.toLowerCase()) {
            populateFields = false;
            $("#duplicateNomineeError").trigger("openModal");
          }
        });

        if (populateFields) {
          self.openInvestmentAccountData().nominees[index].nomineeName(event.detail.value.name);
          self.openInvestmentAccountData().nominees[index].dateOfBirth = event.detail.value.dateOfBirth;
          self.openInvestmentAccountData().nominees[index].disableFields(true);
        } else {
          self.openInvestmentAccountData().nominees[index].selectedNominee("");
        }

        self.showNominees(true);
      }
    };

    self.nomineeValidator = [params.baseModel.getValidator("ALPHABETS_WITH_SPACE", self.resource.nameError, {
      type: "length",
      options: {
        min: 1,
        max: 100
      }
    })[0], {
      validate: function(value) {
        self.openInvestmentAccountData().nominees.forEach(function(nominee) {
          const compareTo = nominee.nomineeName();

          if (value && compareTo) {
            if (value.toLowerCase() === compareTo.toLowerCase()) {
              throw new Error(self.resource.duplicateNomineeMsg);
            }
          }
        });
      }
    }];

    self.nextStepNominee = function() {
      const tracker = document.getElementById("tracker");

      let totalSharePercentage = 0;

      self.openInvestmentAccountData().nominees.forEach(function(nominee) {
        totalSharePercentage = totalSharePercentage + parseInt(nominee.sharePercentage);
      });

      if (totalSharePercentage === 100) {
        if (tracker && tracker.valid === "valid") {
          const itrain = document.getElementById("train");

          self.globalLoaded(false);

          for (let j = 0; j < itrain.steps.length; j++) {
            if (itrain.selectedStep === itrain.steps[j].id) {
              itrain.steps[j].visited = true;
              itrain.steps[j].disabled = false;

              if (j < 2) {
                itrain.steps[j + 1].visited = true;
                itrain.steps[j + 1].disabled = false;
              }

              break;
            }
          }

          ko.tasks.runEarly();

          let loadIndex = 0;

          for (let i = 0; i < self.stepArray().length; i++) {
            if (self.stepArray()[i].id === self.selectedStepValueIA()) {
              loadIndex = i + 1;
              break;
            }
          }

          self.selectedStepValueIA(self.stepArray()[loadIndex].id);
          self.globalLoaded(true);
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      } else {
        $("#sharePercentageError").trigger("openModal");
      }

    };

    self.percentageValidator = [params.baseModel.getValidator("NUMBERS", self.resource.numberError, {
      type: "length",
      options: {
        min: 1,
        max: 3
      }
    })[0], {
      validate: function(value) {
        if (value > 100) {
          throw new Error(self.resource.percentError);
        }
      }
    }];

    self.closePopUp = function() {
      $("#sharePercentageError").trigger("closeModal");
    };

    self.closePopUpNominee = function() {
      $("#duplicateNomineeError").trigger("closeModal");
    };

    self.setRelationshipDesc = function(index, event){
      if(event.detail.value){
        self.relationship().forEach(function(relationship){
          if(relationship.code === event.detail.value){
            self.openInvestmentAccountData().nominees[index].temp_nomrelationship = relationship.description;
          }
        });
      }
    };
  };
});
