define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/view-guarantee",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojvalidation",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojnavigationlist",
  "ojs/ojpagingcontrol",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation"
], function (oj, ko, ReviewAmendBGModel, resourceBundle) {
  "use strict";

  let self;
  const vm = function (params) {
    self = this;
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.mode = ko.observable(self.params.mode);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("amend-bank-guarantee", "guarantee");
    params.baseModel.registerComponent("attach-documents", "trade-finance");

    let countryList = [];

    function getCountryNameFromCode(countryCode) {
      const countryName = countryList.filter(function (data) {
        return data.code === countryCode;
      });

      return countryName.length > 0 ? countryName[0].description : null;
    }

    if (self.mode() === "approval" || self.mode() === "VIEW" || self.mode() === "REVIEW" || self.mode() === "ACCEPTANCE") {
      self.bgAmendmentDetails = self.params.data;
      self.checkIfBGDetailsLoaded = ko.observable(false);
      self.termsAndConditionsListArray = ko.observableArray();
      self.datasourceForTermsAndConditionsReview = ko.observable();
      self.isExpiryDateChanged = ko.observable(false);

      self.amendStages = [{
        stageName: self.resourceBundle.heading.guaranteeDetails,
        templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-parties")
      },
      {
        stageName: self.resourceBundle.heading.commitmentDetails,
        templateName: ko.observable("trade-finance/view-guarantees/amend-commitment-details")
      },
      {
        stageName: self.resourceBundle.heading.bankInstructions,
        templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-instructions")
      },
      {
        stageName: self.resourceBundle.heading.guarantee,
        templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-contracts")
      },
      {
        stageName: self.resourceBundle.heading.termsAndConditions,
        templateName: ko.observable("trade-finance/view-guarantees/amend-terms-and-conditions")
      }
      ];

      self.amendCommitmentTracker = ko.observable();
      self.amendTermsAndConditionsTracker = ko.observable();

      let reviewHeader;

      if (self.mode() === "ACCEPTANCE") {
        params.dashboard.headerName(self.resourceBundle.heading.customerAcceptance);
      }

      if (self.mode() === "VIEW") {
        if (self.params.guaranteeTransactionType === "OUTWARD") {
          params.dashboard.headerName(self.resourceBundle.heading.OutwardBGAmendment);
        } else {
          params.dashboard.headerName(self.resourceBundle.heading.InwardBGAmendment);
        }
      }

      if (self.mode() === "REVIEW") {
        if (self.params.guaranteeTransactionType === "OUTWARD") {
          reviewHeader = self.resourceBundle.heading.reviewMsgOutward;
        } else {
          reviewHeader = self.resourceBundle.heading.reviewMsgInward;
        }
      }

      self.reviewTransactionName = [];
      self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
      self.reviewTransactionName.reviewHeader = reviewHeader;
      self.sectionHeading = ko.observable();
      self.descriptionPreviousValue = ko.observable();
      self.contractList = ko.observableArray();
      self.datasourceForContractReview = ko.observableArray();
      self.additionalBankDetails = ko.observable();
      self.datasourceForDocReview = ko.observable();
      self.documentsLoaded = ko.observable(false);

      self.attachedDocuments = ko.observableArray();
      self.applicantName = ko.observable();

      self.applicantAddress = {
        line1: ko.observable(),
        line2: ko.observable(),
        line3: ko.observable(),
        country: ko.observable()
      };

      self.beneName = ko.observable();

      self.beneAddress = {
        line1: ko.observable(),
        line2: ko.observable(),
        line3: ko.observable(),
        country: ko.observable()
      };

      self.dropdownLabels = {
        country: ko.observable(),
        product: ko.observable(),
        branch: ko.observable(),
        guaranteeType: ko.observable()
      };

      self.reviewDataLoaded = ko.observable(false);

      self.showDescriptionPreviousValue = function (event) {
        const popup = document.querySelector("#popup-descriptionPrevious" + event);

        self.descriptionPreviousValue(params.baseModel.format(self.resourceBundle.tnc.previousDesc, {
          previousDescValue: self.guaranteeDetails.termsAndConditions[event].description
        }));

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open("#previous" + event);
        }

      };

      self.showPreviousExpiryCondition = function (event) {
        const popup = document.querySelector("#popup-expiryCondition");

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open("#prev-expiryCondition");
        }

      };

      self.showPreviousGuaranteeAmendAmount = function (event) {
        const popup = document.querySelector("#popup-GuaranteeAmount");

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open("#prev-guaranteeAmount");
        }

      };

      self.showPreviousExpiryDate = function (event) {
        const popup = document.querySelector("#popup-expiryDate");

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open("#prev-expiryDate");
        }

      };

      self.showPreviousValidityType = function (event) {
        const popup = document.querySelector("#popup-validityType");

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open("#prev-validityType");
        }

      };

      self.showPreviousClosureDate = function (event) {
        const popup = document.querySelector("#popup-closureDate");

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open("#prev-closureDate");
        }

      };

      let version;

      if (ko.utils.unwrapObservable(self.bgAmendmentDetails.versionNo)) {
        version = ko.utils.unwrapObservable(self.bgAmendmentDetails.versionNo);
      }

      ReviewAmendBGModel.getOutwardBG(ko.utils.unwrapObservable(self.params.data.bgId), version).done(function (data) {
        self.guaranteeDetails = data.bankGuarantee;

        if (self.mode() === "VIEW" || self.mode() === "approval") {
          if (self.bgAmendmentDetails.amendmentNo) {
            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNoWithAmendNo, {
              bgNumber: self.guaranteeDetails.bgId,
              amendmentNumber: self.bgAmendmentDetails.amendmentNo()
            }));
          } else {
            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, {
              bgNumber: self.guaranteeDetails.bgId
            }));
          }
        } else {
          self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, {
            bgNumber: self.guaranteeDetails.bgId
          }));
        }

        self.reviewDataLoaded(true);
        self.dropdownLabels.product(self.guaranteeDetails.productName);
        self.contractList(self.guaranteeDetails.bankGuaranteeContract);

        if (self.contractList()) {
          self.datasourceForContractReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractList(), {
            idAttribute: "contractId"
          })));
        }

        if (self.guaranteeDetails.attachedDocuments) {
          self.attachedDocuments(self.guaranteeDetails.attachedDocuments);
        }

        self.applicantName(self.guaranteeDetails.partyName);

        if (self.guaranteeDetails.partyAddress) {
          self.applicantAddress.line1(self.guaranteeDetails.partyAddress.line1);
          self.applicantAddress.line2(self.guaranteeDetails.partyAddress.line2);
          self.applicantAddress.line3(self.guaranteeDetails.partyAddress.line3);
          self.applicantAddress.country(self.guaranteeDetails.partyAddress.country);
        }

        ReviewAmendBGModel.fetchBeniCountry().done(function (data) {
          countryList = data.enumRepresentations[0].data;

          const beneCountry = data.enumRepresentations[0].data.filter(function (data) {
            return data.code === self.guaranteeDetails.beneAddress.country;
          });

          self.dropdownLabels.country(beneCountry[0].description);
        });

        ReviewAmendBGModel.fetchBranch().done(function (data) {
          const beneBranch = data.branchAddressDTO.filter(function (data) {
            return data.id === self.guaranteeDetails.branchId;
          });

          self.dropdownLabels.branch(beneBranch[0].branchName);
        });

        ReviewAmendBGModel.fetchGuranteeType().done(function (typeData) {
          const guaranteeType = typeData.bankGuaranteeTypeDTO.filter(function (typeData) {
            return typeData.id = self.guaranteeDetails.guaranteetype;
          });

          self.dropdownLabels.guaranteeType(guaranteeType[0].description);
        });

        if (self.guaranteeDetails.advisingBankCode && self.guaranteeDetails.advisingBankCode !== null) {
          ReviewAmendBGModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode).done(function (data) {
            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
            self.additionalBankDetails(data);
          });
        }

        if (self.guaranteeDetails.attachedDocuments && self.guaranteeDetails.attachedDocuments.length > 0) {
          self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.guaranteeDetails.attachedDocuments, {
            idAttribute: "id"
          }));

          self.documentsLoaded(true);
        }

        if (ko.utils.unwrapObservable(self.bgAmendmentDetails.termsAndConditions) && ko.utils.unwrapObservable(self.bgAmendmentDetails.termsAndConditions).length > 0) {
          for (let i = 0; i < ko.utils.unwrapObservable(self.bgAmendmentDetails.termsAndConditions).length; i++) {
            self.termsAndConditionsListArray.push({
              srNo: i + 1,
              undertakingType: self.resourceBundle.termsAndConditions.labels.guarantee,
              description: ko.utils.unwrapObservable(ko.utils.unwrapObservable(self.bgAmendmentDetails.termsAndConditions)[i].description)
            });
          }
        }
        else {
          self.termsAndConditionsListArray.push({
            srNo: 1,
            undertakingType: self.resourceBundle.termsAndConditions.labels.guarantee,
            description: ko.observable("")
          });
        }

        self.datasourceForTermsAndConditionsReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.termsAndConditionsListArray, {
          idAttribute: "srNo"
        })));

        self.checkIfBGDetailsLoaded(true);
      });
    } else {
      self.reviewDataLoaded(true);
      params.dashboard.headerName(self.resourceBundle.heading.initiateBGAmendment);
    }

    if (self.mode() === "ACCEPTANCE") {
      const getNewKoModel = function () {
        const KoModel = ReviewAmendBGModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      };

      self.rootModelInstance = ko.observable(getNewKoModel());
      self.AmendAcceptanceDetails = self.rootModelInstance().AmendAcceptanceDetails;
    }

    if (self.mode() === "REVIEW") {
      params.dashboard.headerName(self.resourceBundle.heading.initiateBGAmendment);
    }

    self.isExpiryDateChanged = ko.computed(function () {
      if (self.reviewDataLoaded()) {
        if (self.guaranteeDetails && ko.utils.unwrapObservable(self.bgAmendmentDetails.newExpiryDate) && ko.utils.unwrapObservable(self.bgAmendmentDetails.newExpiryDate) !== null) {
          const prevExpiryDate = new Date(self.guaranteeDetails.expiryDate),
            newExpiryDate = new Date(ko.utils.unwrapObservable(self.bgAmendmentDetails.newExpiryDate));

          newExpiryDate.setHours(0, 0, 0, 0);

          return prevExpiryDate.toISOString() !== newExpiryDate.toISOString();
        }
      }
    });

    self.isClosureDateChanged = ko.computed(function () {
      if (self.reviewDataLoaded()) {
        if (self.guaranteeDetails && ko.utils.unwrapObservable(self.bgAmendmentDetails.newClosureDate) && ko.utils.unwrapObservable(self.bgAmendmentDetails.newClosureDate) !== null) {
          const prevclosureDate = new Date(self.guaranteeDetails.closureDate),
            newClosureDate = new Date(ko.utils.unwrapObservable(self.bgAmendmentDetails.newClosureDate));

          newClosureDate.setHours(0, 0, 0, 0);

          return prevclosureDate.toISOString() !== newClosureDate.toISOString();
        }
      }
    });

    self.confirmAmendment = function () {
      const date1 = new Date(self.bgAmendmentDetails.newExpiryDate());

      self.bgAmendmentDetails.newExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date1.setHours(0, 0, 0, 0))));

      const date2 = new Date(self.bgAmendmentDetails.newClosureDate());

      self.bgAmendmentDetails.newClosureDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
      self.bgAmendmentDetails.versionNo(self.guaranteeDetails.versionNo);
      self.bgAmendmentDetails.beneName(self.guaranteeDetails.beneName);

      ReviewAmendBGModel.initiateAmendment(self.guaranteeDetails.bgId, ko.mapping.toJSON(self.bgAmendmentDetails)).done(function (data, status, jqXhr) {
        const confirmScreenDetailsArray = [
          [{
            label: self.resourceBundle.guaranteeDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.guaranteeDetails.labels.beneficiaryName,
            value: self.guaranteeDetails.beneName
          }
          ],
          [{
            label: self.resourceBundle.guaranteeDetails.labels.product,
            value: self.dropdownLabels.product()
          },
          {
            label: self.resourceBundle.guaranteeDetails.labels.expiryDate,
            value: self.bgAmendmentDetails.newExpiryDate()
          }
          ]
        ];

        if (self.guaranteeDetails.advisingBankCode && self.guaranteeDetails.advisingBankCode !== null && self.guaranteeDetails.advisingBankCode !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.commitmentDetails.labels.guaranteeAmount,
            value: params.baseModel.formatCurrency(self.bgAmendmentDetails.newAmount.amount(), self.bgAmendmentDetails.newAmount.currency())
          },
          {
            label: self.resourceBundle.guaranteeDetails.labels.swiftCode,
            value: self.guaranteeDetails.advisingBankCode
          }
          ]);
        } else {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.commitmentDetails.labels.guaranteeAmount,
            value: params.baseModel.formatCurrency(self.bgAmendmentDetails.newAmount.amount(), self.bgAmendmentDetails.newAmount.currency())
          }]);
        }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resourceBundle.heading.initiateBGAmendment,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_N_ABG",
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };

    self.editAll = function () {
      const parameters = {
        mode: "EDIT",
        guaranteeDetails: self.guaranteeDetails,
        dropdownLabels: ko.mapping.toJS(self.dropdownLabels),
        applicantAddress: ko.mapping.toJS(self.applicantAddress),
        bgAmendmentDetails: ko.mapping.toJS(self.bgAmendmentDetails),
        termsAndConditionsListArray: self.termsAndConditionsListArray ? self.termsAndConditionsListArray : ko.observableArray()
      };

      params.dashboard.headerName(self.resourceBundle.heading.OutwardBGAmendment);

      self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, {
        bgNumber: self.guaranteeDetails.bgId
      }));

      params.dashboard.loadComponent("amend-bank-guarantee", parameters);
    };

    self.initiateAcceptance = function () {
      self.AmendAcceptanceDetails.customerAcceptanceStatus("ACCEPT");
      self.AmendAcceptanceDetails.newAmount.amount(ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.amount));
      self.AmendAcceptanceDetails.newAmount.currency(ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.currency));

      ReviewAmendBGModel.amendAcceptance(ko.utils.unwrapObservable(self.params.data.bgId), ko.utils.unwrapObservable(self.bgAmendmentDetails.amendmentNo), ko.mapping.toJSON(self.AmendAcceptanceDetails)).done(function (data, status, jqXhr) {
        const confirmScreenDetailsArray = [
          [{
            label: self.resourceBundle.labels.guaranteeNumber,
            value: ko.utils.unwrapObservable(self.params.data.bgId)
          },
          {
            label: self.resourceBundle.common.labels.guaranteeAmount,
            value: params.baseModel.formatCurrency(ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.amount), ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.currency))
          }
          ]
        ];

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resourceBundle.heading.customerAcceptance,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_AF_CBG",
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };

    self.rejectAcceptance = function () {
      self.AmendAcceptanceDetails.customerAcceptanceStatus("REJECT");
      self.AmendAcceptanceDetails.newAmount.amount(ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.amount));
      self.AmendAcceptanceDetails.newAmount.currency(ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.currency));

      ReviewAmendBGModel.amendAcceptance(ko.utils.unwrapObservable(self.params.data.bgId), ko.utils.unwrapObservable(self.bgAmendmentDetails.amendmentNo), ko.mapping.toJSON(self.AmendAcceptanceDetails)).done(function (data, status, jqXhr) {
        const confirmScreenDetailsArray = [
          [{
            label: self.resourceBundle.labels.guaranteeNumber,
            value: ko.utils.unwrapObservable(self.params.data.bgId)
          },
          {
            label: self.resourceBundle.labels.guaranteeAmount,
            value: params.baseModel.formatCurrency(ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.amount), ko.utils.unwrapObservable(self.bgAmendmentDetails.newAmount.currency))
          }
          ]
        ];

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resourceBundle.heading.customerAcceptance,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_AF_CBG",
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };

    self.goBack = function () {
      history.back();
    };
  };

  vm.prototype.dispose = function () {
    self.isExpiryDateChanged.dispose();
    self.isClosureDateChanged.dispose();
  };

  return vm;
});