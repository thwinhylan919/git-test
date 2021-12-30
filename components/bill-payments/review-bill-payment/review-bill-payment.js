define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/register-biller",
  "ojs/ojbutton",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojavatar",
  "ojs/ojbutton",
  "ojs/ojmenu",
  "ojs/ojoption",
  "ojs/ojswipetoreveal",
  "ojs/ojarraytabledatasource",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, ReviewBillPaymentModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

        self.mode = ko.observable();
        self.billerDetails = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.confirmScreenDetails = params.rootModel.confirmScreenDetails;
        params.dashboard.headerName(self.resourceBundle.heading.payBills);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("pay-bill", "bill-payments");
        params.baseModel.registerComponent("register-biller", "bill-payments");
        params.baseModel.registerComponent("manage-bill-payments", "bill-payments");
        self.dataLoaded = ko.observable(true);
        self.billLoaded = ko.observable(false);
        self.ebillResponse = ko.observable();
        self.logoList = ko.observableArray();
        self.relationshipDetails = ko.observableArray();
        self.currentAccountType = ko.observable();
        self.dropdownLabels = ko.observable();
        self.relationshipDetails = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resourceBundle.messages.review;
        self.reviewTransactionName.reviewHeader = self.resourceBundle.messages.reviewPaymentMsg;

        const payLoad = { batchDetailRequestList: [] };

    self.billerPaymentDetails = ko.observable();

        if(params.rootModel && params.rootModel.params && params.rootModel.params.billerPaymentDetails) {
            self.billerPaymentDetails = ko.mapping.fromJS(params.rootModel.params.billerPaymentDetails);
        }

        if(params.rootModel && params.rootModel.params && params.rootModel.params.billerDetails) {
            self.billerDetails = ko.mapping.fromJS(params.rootModel.params.billerDetails);
        }

        if(params.rootModel && params.rootModel.params && params.rootModel.params.supportedAccounts) {
          self.supportedAccounts = ko.mapping.fromJS(params.rootModel.params.supportedAccounts);
      }

        if (params.mode) {
            self.mode(params.mode);
        } else if (self.params && self.params.mode) {
            self.mode(self.params.mode);
        } else if(params.rootModel && params.rootModel.params && params.rootModel.params.mode) {
            self.mode(params.rootModel.params.mode);
        }

    self.fillconfirmScreenExtension = function () {
      const confirmScreenDetailsArray = [
        [{
          label: self.resourceBundle.labels.payWhen,
          value: self.billerPaymentDetails.paymentDate()
        },
        {
          label: self.resourceBundle.labels.amount,
          value: self.billerPaymentDetails.billAmount.amount(),
          currency: self.billerPaymentDetails.billAmount.currency(),
          isCurrency: true
        }
        ]
      ];

      if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); }
      else if (self.confirmScreenExtensions) {
        $.extend(self.confirmScreenExtensions, {
          isSet: true,
          taskCode: "EB_F_BP",
          confirmScreenDetails: confirmScreenDetailsArray,
          template: "confirm-screen/bill-payment"
        });
      }
    };

    if (self.mode() !== "REVIEW") {
      self.billerPaymentDetails = ko.mapping.fromJS(self.params.data);
      self.dataLoaded = ko.observable(false);
      self.relationshipDetails = ko.observableArray();

      self.dropdownLabels = {
        category: ko.observable(),
        location: ko.observable(),
        biller: ko.observable(),
        currentAccountType: ko.observable()
      };

      self.currentAccountType = ko.observable();
      self.dropdownLabels.currentAccountType(self.billerPaymentDetails.paymentType());
      self.currentAccountType(self.billerPaymentDetails.paymentType());

      ReviewBillPaymentModel.getBillerDetails(self.billerPaymentDetails.billerId()).done(function (data) {
        for (let i = 0; i < self.billerPaymentDetails.billPaymentRelDetails().length; i++) {
          self.relationshipDetails.push({
            label: data.biller.specifications[i].label,
            value: self.billerPaymentDetails.billPaymentRelDetails()[i].value()
          });
        }

        self.fillconfirmScreenExtension();
        self.dataLoaded(true);
      });

    }

        function loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray) {
            params.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXhr,
                transactionName: transactionName,
                confirmScreenExtensions: {
                    successMessage: successMessage,
                    statusMessages: statusMessages,
                    taskCode: "EB_F_BP",
                    isSet: true,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    billerPaymentDetails : self.billerPaymentDetails,
                    resourceBundle : self.resourceBundle,
                    template: "confirm-screen/bill-payment"
                }
            });
        }

    self.confirm = function () {
      let successMessage, statusMessages, transactionName;
      const confirmScreenDetailsArray = [
        [{
          label: self.resourceBundle.labels.paidFrom,
          value: self.billerPaymentDetails.debitAccount.displayValue
        },
        {
          label: self.resourceBundle.labels.amount,
          value: self.billerPaymentDetails.billAmount.amount(),
          currency: self.billerPaymentDetails.billAmount.currency(),
          isCurrency: true
        }
        ]
      ];

      ReviewBillPaymentModel.billPayment(ko.mapping.toJSON(self.billerPaymentDetails)).done(function (data, status, jqXhr) {
        successMessage = self.resourceBundle.messages.paymentSuccessMessage;
        statusMessages = self.resourceBundle.messages.sucessfull;
        transactionName = self.resourceBundle.heading.payBills;
        loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray);
      });
    };

    self.editPayBill = function () {
      const parameters = {
        mode: "EDIT",
        billerPaymentDetails: self.billerPaymentDetails,
        billerDetails: self.billerDetails,
        supportedAccounts: self.supportedAccounts()
      };

      params.dashboard.loadComponent("pay-bill", parameters);
    };

    self.fetchBillerLogo = function (data) {
      self.billLoaded(false);

      ReviewBillPaymentModel.fetchBillerLogos(data).done(function (response) {
        const specsArray = [];

        for (let m = 0; m < response.biller.specifications.length; m++) {
          specsArray[response.biller.specifications[m].id] = response.biller.specifications[m].label;
        }

        self.billerPaymentDetails.billerName(response.biller.name);

        payLoad.batchDetailRequestList = [];

        if (response.biller.logo) {
          self.logoList.removeAll();

          const id = response.biller.logo.value;

          self.logoList.push({
            initials: oj.IntlConverterUtils.getInitials(response.biller.name),
            logo: response.biller.logo,
            billerLogo: ko.observable()
          });

          const contentURL = {
            value: "/contents/{id}",
            params: {
              id: id
            }
          },
            obj = {
              methodType: "GET",
              uri: contentURL,
              headers: {
                "Content-Id": 1,
                "Content-Type": "application/json"
              }
            };

          payLoad.batchDetailRequestList.push(obj);

          if (payLoad.batchDetailRequestList.length > 0) {
            ReviewBillPaymentModel.fireBatch(payLoad).done(function (batchData) {
              const contentMap = [];

              if (batchData && batchData.batchDetailResponseDTOList) {
                for (let s = 0; s < batchData.batchDetailResponseDTOList.length; s++) {
                  const batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[s].responseText);

                  if (batchResponse.contentDTOList) {
                    if (batchResponse.contentDTOList[0].contentId) { contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content; }
                  }
                }
              }

              if (self.logoList()[0].logo && self.logoList()[0].logo.value) {
                self.logoList()[0].billerLogo = contentMap[self.logoList()[0].logo.value];
                self.billLoaded(true);
                $("#billWindow").trigger("openModal");
              }
            });
          }
        }
      });
    };

    self.viewBill = function () {
      ReviewBillPaymentModel.fetchRegBillerDetails(self.billerPaymentDetails.billerRegistrationId()).done(function (response) {
        self.ebillResponse(response);

        if (response.billerRegistration) {

          self.fetchBillerLogo(self.billerPaymentDetails.billerId());

        }
      });
    };
  };
});
