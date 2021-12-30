define([
  "ojs/ojcore",
  "knockout",

  "./model",

  "ojL10n!resources/nls/create-fund-request",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton",
  "ojs/ojknockout-validation"
], function(oj, ko, Model, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(Model.getNewModel());

        return KoModel;
      };

    self.createFundRequest = getNewKoModel().payDetails;
    ko.utils.extend(self, rootParams.rootModel);
    self.friendList = ko.observableArray();
    self.description = ko.observable();
    self.note = ko.observable();
    self.resource = ResourceBundle;

    let computePercentage = false;

    rootParams.baseModel.registerElement("comment-box");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("review-fund-request", "payments");
    self.totalAmount = ko.observable();
    self.currency = ko.observable();
    self.currencyURL = ko.observable();
    self.validationTracker = ko.observable();
    self.fundCollectionLoaded = ko.observable(false);
    self.isRefreshed = ko.observable(false);
    self.splitType = ko.observable("EQUALLY");

    self.splitListType = ko.observableArray([{
        code: "EQUALLY",
        description: self.resource.createFundRequest.equally
      },
      {
        code: "AMOUNT",
        description: self.resource.createFundRequest.transferAmount
      },
      {
        code: "PERCENTAGE",
        description: self.resource.createFundRequest.percentage
      }
    ]);

    self.currencyURL("payments/currencies?type=DOMESTICFT");
    self.fundCollectionRequestList = ko.observableArray();

    self.currencyParser = function(data) {
      const output = {};

      output.currencies = [];

      for (let i = 0; i < data.currencyList.length; i++) {
        output.currencies.push({
          code: data.currencyList[i].code,
          description: data.currencyList[i].code
        });
      }

      return output;
    };

    if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
      return;
    }

    const friendListSubscription = self.friendList.subscribe(function(newFriendsList) {
      if (self.fundCollectionRequestList().length + 1 === newFriendsList.length) {
        ko.utils.arrayForEach(newFriendsList, function(friend) {
          let isThere = false;

          ko.utils.arrayForEach(self.fundCollectionRequestList(), function(collectionRequest) {
            if (collectionRequest.name() === friend) {
              isThere = true;
            }
          });

          if (!isThere) {
            const fundRequestDetail = getNewKoModel().computeDetails;

            fundRequestDetail.name(friend);
            self.fundCollectionRequestList.push(fundRequestDetail);
          }
        });
      } else {
        ko.utils.arrayForEach(self.fundCollectionRequestList(), function(deleteRequest) {
          let isThere = false;

          ko.utils.arrayForEach(newFriendsList, function(friend) {
            if (deleteRequest.name() === friend) {
              isThere = true;
            }
          });

          if (!isThere) {
            self.fundCollectionRequestList.remove(function(deleteName) {
              return deleteName.name() === deleteRequest.name();
            });
          }
        });
      }

      if (self.splitType() === "EQUALLY") {
        self.computation();
      }

      self.fundCollectionLoaded(true);
    });

    self.validateEmail = {
      validate: function(value) {
        value = value[value.length - 1];

        const options = rootParams.baseModel.getValidator("EMAIL")[0].options,
          validator = new oj.RegExpValidator(options);

        if (!validator.validate(value)) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.createFundRequest.emailValidation));
        }
      }
    };

    self.refreshList = function() {
      self.isRefreshed(false);
      ko.tasks.runEarly();
      self.fundCollectionRequestList.removeAll();

      for (let l = 0; l < self.friendList().length; l++) {
        const fundRefreshDetail = getNewKoModel().computeDetails;

        fundRefreshDetail.name(self.friendList()[l]);
        self.fundCollectionRequestList.push(fundRefreshDetail);
      }

      self.isRefreshed(true);
    };

    self.computation = function() {
      self.refreshList();

      if (self.lastEqually) {
        self.lastEqually.dispose();
      }

      if (self.fundCollectionLoaded()) {
        if (self.splitType() === "EQUALLY") {
          self.lastEqually = ko.computed(function() {
            const equalAmount = Math.round(self.totalAmount() * 100 / self.fundCollectionRequestList().length) / 100;

            for (let i = 0; i < self.fundCollectionRequestList().length - 1; i++) {
              self.fundCollectionRequestList()[i].amount(equalAmount);
            }

            const remainingAmount = self.totalAmount() - ((self.fundCollectionRequestList().length - 1) * equalAmount);

            return self.fundCollectionRequestList()[self.fundCollectionRequestList().length - 1].amount(remainingAmount);
          });
        } else if (self.splitType() === "AMOUNT") {
          for (let k = 0; k < self.fundCollectionRequestList().length; k++) {
            self.fundCollectionRequestList()[k].amount();
          }
        } else {
          let computedAmount = 0;

          self.computePercentage = ko.computed(function() {
            for (let j = 0; j < self.fundCollectionRequestList().length; j++) {
              computedAmount = self.fundCollectionRequestList()[j].percentage() * self.totalAmount() / 100;
              self.fundCollectionRequestList()[j].amount(computedAmount);
            }

            computePercentage = true;
          });
        }
      }
    };

    const splitTypeSubscription = self.splitType.subscribe(function() {
      self.computation();
    });

    self.dispose = function() {
      self.lastEqually.dispose();
      friendListSubscription.dispose();
      splitTypeSubscription.dispose();

      if (computePercentage) {
        self.computePercentage.dispose();
      }
    };

    self.save = function() {
      self.createFundRequest.collections.removeAll();

      let addedAmount = 0;

      for (let l = 0; l < self.fundCollectionRequestList().length; l++) {
        addedAmount = +self.fundCollectionRequestList()[l].amount() + addedAmount;
      }

      if (addedAmount !== self.totalAmount()) {
        rootParams.baseModel.showMessages(null, [self.resource.createFundRequest.invalidError], "ERROR");
      } else {
        self.createFundRequest.title(self.description());
        self.createFundRequest.status(self.resource.createFundRequest.initiated);
        self.createFundRequest.requestee(rootParams.dashboard.userData.userProfile.userName);
        self.createFundRequest.totalAmount.amount(self.totalAmount());
        self.createFundRequest.totalAmount.currency(self.currency());

        for (let m = 0; m < self.fundCollectionRequestList().length; m++) {
          const fundCollection = getNewKoModel().fundCollectionDetails;

          fundCollection.status(self.resource.createFundRequest.posted);
          fundCollection.amount.currency(self.currency());
          fundCollection.amount.amount(self.fundCollectionRequestList()[m].amount());
          fundCollection.recipient(self.friendList()[m]);
          fundCollection.message(self.description());
          self.createFundRequest.collections.push(fundCollection);
        }

        rootParams.dashboard.loadComponent("review-fund-request", {
          fundRequestDetails: self.createFundRequest,
          splitType: self.splitType,
          fundCollectionDetails: self.fundCollectionRequestList()
        }, self);
      }
    };
  };
});