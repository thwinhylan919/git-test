define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/initiate-collection",
  "ojs/ojtable",
  "ojs/ojselectcombobox",
  "ojs/ojarraytabledatasource",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset"
], function (oj, ko, LCDetailsModel, resourceBundle) {
  "use strict";

  let self;
  const vm = function (params) {
    let i, j;

    self = this;
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.stageIndex = params.index;

    let draftRowId = 1;

    self.validationTracker = ko.observable();
    self.countryDatasource = ko.observable();
    self.dataSourceCreated = ko.observable(false);
    self.autoReinstatement = ko.observableArray();
    self.disbaledTenor = ko.observable(false);
    self.transferableTypeValue = ko.observable("");
    self.tolerance = ko.observable("");
    self.benecountry = ko.observable("");
    self.chargesAccountValue = ko.observable("");
    self.currency = ko.observable(null);
    self.frequencyUnit = ko.observable([""]);
    self.exposureCurrency = ko.observable([""]);
    self.revolvingFlag = ko.observable(false);
    self.productId = ko.observable("");
    self.partyId = ko.observable("");
    self.draweeBank = ko.observable("");

    self.paymentDetailsValueLoaded = ko.observable(false);
    self.transferableTypeValueLoaded = ko.observable(false);

    function setConfirmationOptions() {
      LCDetailsModel.fetchConfirmationParty().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.requestedConfirmationPartyOptions.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
      });

      LCDetailsModel.fetchConfirmationInstruction().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.confirmationInstructionOptions.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
      });
    }

    if (self.requestedConfirmationPartyOptions && self.requestedConfirmationPartyOptions().length === 0) {
      setConfirmationOptions();
    }

    self.requestedConfirmationPartyDescription = ko.computed(function () {
      if (self.requestedConfirmationPartyOptions && self.letterOfCreditDetails.requestedConfirmationParty) {
        return params.baseModel.getDescriptionFromCode(self.requestedConfirmationPartyOptions(), self.letterOfCreditDetails.requestedConfirmationParty(), "value", "label");
      }
    });

    if (!self.existingBene) {
      if (self.mode() === "EDIT" && self.letterOfCreditDetails.beneId() === null) {
        self.existingBene = ko.observable("false");
      } else {
        self.existingBene = ko.observable("true");
      }
    }

    self.confirmationInstructionChangeHandler = function (event) {
      if (event.detail && event.detail.value !== "WITHOUT") {
        self.letterOfCreditDetails.requestedConfirmationParty(null);
        self.requestedConfirmationPartyLoaded(true);
      } else {
        self.letterOfCreditDetails.requestedConfirmationParty(null);
        self.requestedConfirmationPartyLoaded(false);
      }

      if (event.detail.trigger) {
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.name = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line1 = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line2 = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line3 = null;
        self.requestedConfirmationPartyDetails(null);
        self.letterOfCreditDetails.advisingThroughBankCode(null);
        self.letterOfCreditDetails.confirmingBankCode(null);
        self.confirmationInstructionBankCode(null);
        self.bankDetailsLoaded(false);
      }
    };

    self.requestedConfirmationPartyChangeHandler = function (event) {
      if (event.detail && event.detail.value !== "ABK") {
        self.bankDetailsLoaded(true);
        self.requestedConfirmationPartyMode("SWIFTCODE");
      } else {
        self.letterOfCreditDetails.advisingThroughBankCode(null);
        self.letterOfCreditDetails.confirmingBankCode(null);
        self.bankDetailsLoaded(false);
      }

      if (event.detail.trigger) {
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.name = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line1 = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line2 = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line3 = null;
        self.requestedConfirmationPartyDetails(null);
        self.confirmationInstructionBankCode(null);
      }
    };

    self.requestedConfirmationPartyModeSubscribe = self.requestedConfirmationPartyMode && self.requestedConfirmationPartyMode.subscribe(function (newValue) {
      if (newValue) {
        self.letterOfCreditDetails.advisingThroughBankCode(null);
        self.letterOfCreditDetails.confirmingBankCode(null);
        self.requestedConfirmationPartyDetails(null);
        self.confirmationInstructionBankCode(null);
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.name = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line1 = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line2 = null;
        self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line3 = null;
      }
    });

    self.verifyConfInstBankCode = function () {

      const trackerSwift = document.getElementById("requestedConfirmationPartyMode");

      if (trackerSwift.valid === "valid") {
        if (!self.bicCodeError()) {
          LCDetailsModel.getBankDetailsBIC(self.confirmationInstructionBankCode()).done(function (data) {
            self.requestedConfirmationPartyDetails(data);
          });
        }
      } else {
        trackerSwift.showMessages();
        trackerSwift.focusOn("@firstInvalidShown");
      }
    };

    self.resetConfInstBankDetails = function () {
      self.requestedConfirmationPartyDetails(null);
      self.requestedConfirmationPartyMode("SWIFTCODE");
      self.confirmationInstructionBankCode(null);
    };

    function setClauseArray(docId, documentClauses, selectedClauses) {
      const clause = [];

      for (let k = 0; k < documentClauses.length; k++) {
        let clauseSelected = "false",
          clauseDesc = documentClauses[k].description;

        if (selectedClauses) {
          for (let l = 0; l < selectedClauses.length; l++) {
            if (selectedClauses[l].id() === documentClauses[k].id) {
              clauseSelected = "true";
              clauseDesc = selectedClauses[l].description();
              break;
            }
          }
        }

        clause.push({
          selected: ko.observable([clauseSelected]),
          rowId: docId + "_" + documentClauses[k].id,
          id: documentClauses[k].id,
          description: ko.observable(clauseDesc),
          name: documentClauses[k].name
        });
      }

      return clause;
    }

    function setDocumentArray(selectedProductDocument) {
      let clause = [];

      for (i = 0; i < selectedProductDocument.length; i++) {
        let docSelected = "false",
          originals = "0",
          originalsOutOff = "0",
          copies = 0,
          clauseSelectedFlag = false;

        clause = [];

        for (j = 0; j < self.letterOfCreditDetails.document().length; j++) {
          if (self.letterOfCreditDetails.document()[j].id() === selectedProductDocument[i].id) {
            docSelected = "true";
            originals = self.letterOfCreditDetails.document()[j].originals();

            if (originals.indexOf("/") !== -1) {
              originalsOutOff = originals.split("/")[1];
              originals = originals.split("/")[0];
            }

            copies = self.letterOfCreditDetails.document()[j].copies();

            if (self.letterOfCreditDetails.document()[j].clause && self.letterOfCreditDetails.document()[j].clause().length > 0) {
              clauseSelectedFlag = true;
              clause = setClauseArray(selectedProductDocument[i].id, selectedProductDocument[i].clause, self.letterOfCreditDetails.document()[j].clause());
            }
          }
        }

        if (!clauseSelectedFlag) {
          clause = setClauseArray(selectedProductDocument[i].id, selectedProductDocument[i].clause, []);
        }

        self.docArray.push({
          docSelected: ko.observable([docSelected]),
          id: selectedProductDocument[i].id,
          clause: clause,
          copies: ko.observable(copies),
          name: selectedProductDocument[i].name,
          originals: ko.observable(originals),
          originalsOutOff: ko.observable(originalsOutOff),
          docType: selectedProductDocument[i].docType
        });

        if (clauseSelectedFlag && clause.length > 0) {
          self.clauseTableArray.push({
            allClauseSelected: ko.observable(["false"]),
            docId: selectedProductDocument[i].id,
            docName: params.baseModel.format(self.resourceBundle.labels.documentName, {
              docName: selectedProductDocument[i].name
            }),
            datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clause, {
              idAttribute: "rowId"
            }))
          });
        }
      }

      self.showDocuments(true);
    }

    function fetchProductDetailsSuccess(productData, state) {
      let productDetails;

      if (self.transactionType !== "SHIPPING_GUARANTEE") {
        productDetails = productData.letterOfCreditProductDTO;
      } else {
        productDetails = productData.product;
      }

      if (productDetails) {

        if (productDetails.periodIndicator === "SIGHT") {
          self.disbaledTenor(true);

          for (i = 0; i < self.draftArray().length; i++) {
            self.draftArray()[i].tenor("0");
          }
        } else {
          self.disbaledTenor(false);
        }

        if (self.letterOfCreditDetails.revolving) {
          if (productDetails.revolving === true) {
            self.letterOfCreditDetails.revolving("true");
            self.revolvingFlag(true);
          } else {
            self.letterOfCreditDetails.revolving("false");
            self.revolvingFlag(true);
          }
        }

        self.currencyListOptions.removeAll();

        const currency = productDetails.currencies.map(function (currencyData) {
          return {
            value: currencyData.code,
            label: currencyData.code
          };
        });

        ko.utils.arrayPushAll(self.currencyListOptions, currency);

        if (self.transactionType !== "SHIPPING_GUARANTEE") {
          if (self.mode() === "EDIT") {
            if (!self.letterOfCreditDetails.toleranceUnder()) {
              self.letterOfCreditDetails.toleranceUnder(productDetails.negativeTolerance);
            }

            if (!self.letterOfCreditDetails.toleranceAbove()) {
              self.letterOfCreditDetails.toleranceAbove(productDetails.positiveTolerance);
            }
          } else {
            self.letterOfCreditDetails.toleranceUnder(productDetails.negativeTolerance);
            self.letterOfCreditDetails.toleranceAbove(productDetails.positiveTolerance);
          }
        }

        self.letterOfCreditDetails.paymentType(productDetails.periodIndicator);
        self.showDocuments(false);
        self.docArray.removeAll();
        self.clauseTableArray.removeAll();

        if (state === "onProductChange") {
          for (i = 0; i < productDetails.documents.length; i++) {
            const clause = [];

            for (j = 0; j < productDetails.documents[i].clause.length; j++) {
              clause.push({
                selected: ko.observable([false]),
                rowId: productDetails.documents[i].id + "_" + productDetails.documents[i].clause[j].id,
                id: productDetails.documents[i].clause[j].id,
                description: ko.observable(productDetails.documents[i].clause[j].description),
                name: productDetails.documents[i].clause[j].name
              });
            }

            self.docArray.push({
              docSelected: ko.observable(["false"]),
              id: productDetails.documents[i].id,
              clause: clause,
              copies: ko.observable(0),
              name: productDetails.documents[i].name,
              originals: ko.observable(0),
              originalsOutOff: ko.observable(0),
              docType: productDetails.documents[i].docType
            });
          }

          self.showDocuments(true);
        } else {
          setDocumentArray(productDetails.documents);
        }
      }
    }

    function fetchProductDetails(productId, state) {

      if (self.transactionType !== "SHIPPING_GUARANTEE") {
        LCDetailsModel.fetchProductDetails(productId, state).done(fetchProductDetailsSuccess);
      } else {
        LCDetailsModel.fetchSGProductDetails(productId, state).done(fetchProductDetailsSuccess);
      }

      const label = self.productTypeOptions().filter(function (data) {
        return data.value === productId;
      });

      if (label && label.length > 0) {
        self.dropdownLabels.product(label[0].label);
      }
    }

    self.datasourceForDraft = new oj.ArrayTableDataSource(self.draftArray, {
      idAttribute: "id"
    });

    self.transferableTypevalueOptions = ko.observableArray([]);

    LCDetailsModel.fetchCreditAvailaibleByTypes().done(function (taskData) {
      const transferableTypes = taskData.enumRepresentations[0].data.map(function (data) {
        return {
          value: data.code,
          label: data.description
        };
      }).filter(function (data) {
        return data.label && data.value;
      });

      self.transferableTypevalueOptions(transferableTypes);
      self.transferableTypeValueLoaded(true);
    });

    self.repeatFrequencyType = [{
        value: "DAYS",
        label: self.resourceBundle.lcDetails.labels.DAYS
      },
      {
        value: "MONTHS",
        label: self.resourceBundle.lcDetails.labels.MONTHS
      }
    ];

    if (self.letterOfCreditDetails.draftsRequired) {
      self.draftSubscribe = self.letterOfCreditDetails.draftsRequired.subscribe(function () {
        self.draftArray.removeAll();

        self.draftArray.push({
          id: 1,
          draftAmount: ko.observable(""),
          draftName: ko.observable(""),
          draweeBank: self.draweeBank,
          specifyOthers: ko.observable(""),
          tenor: ko.observable("0")
        });
      });
    }

    self.repeatFrequencyTypeHandler = function (event) {
      if (event.detail.value) {
        self.letterOfCreditDetails.revolvingDetails.frequencyUnit(event.detail.value);
      }
    };

    self.productChangeHandler = function (event) {
      let productLabel;

      if (event.detail.value) {
        const product = event.detail.value;

        productLabel = self.productTypeOptions().filter(function (data) {
          return data.value === product;
        });

        if (productLabel && productLabel.length > 0) {
          self.dropdownLabels.product(productLabel[0].label);
        }

        fetchProductDetails(product, "onProductChange");
      }
    };

    function fetchAdditionalDetails() {
      if (self.creditAvailableWithSelected() === "SWIFTCODE" && self.letterOfCreditDetails.availableWith() !== null && self.letterOfCreditDetails.availableWith() !== "") {
        LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith()).done(function (data) {
          self.availableWithDetails(data);
          self.letterOfCreditDetails.availableWith(self.availableWithDetails().code);

          if (self.letterOfCreditDetails.swiftId() !== null) {
            if (self.letterOfCreditDetails.swiftId() !== undefined && self.letterOfCreditDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
              LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                self.additionalBankDetails(data);
                self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
              }).fail(function () {
                self.letterOfCreditDetails.swiftId(null);
              });
            }
          }
        }).fail(function () {
          self.letterOfCreditDetails.availableWith(null);
        });
      } else if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "" && self.letterOfCreditDetails.swiftId() !== undefined) {
        LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
          self.additionalBankDetails(data);
          self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
        }).fail(function () {
          self.letterOfCreditDetails.swiftId(null);
        });
      }
    }

    function fetchBeneUserDetails(beneficiaryId) {
      LCDetailsModel.fetchBeneficiaryDetails(beneficiaryId).done(function (data) {
        self.letterOfCreditDetails.counterPartyName(data.beneficiaryDTO.name);
        self.letterOfCreditDetails.counterPartyAddress.line1(data.beneficiaryDTO.address.line1);
        self.letterOfCreditDetails.counterPartyAddress.line2(data.beneficiaryDTO.address.line2);
        self.letterOfCreditDetails.counterPartyAddress.line3(data.beneficiaryDTO.address.line3);
        self.letterOfCreditDetails.counterPartyAddress.country(data.beneficiaryDTO.address.country);
        self.benecountry(data.beneficiaryDTO.address.country);

        const countryLabel = self.beneCountryoptions().filter(function (data) {
          return data.value === self.benecountry();
        });

        self.beneVisibility(data.beneficiaryDTO.visibility);

        if (countryLabel && countryLabel.length > 0) {
          self.dropdownLabels.country(countryLabel[0].label);
        }

        if (self.letterOfCreditDetails.swiftId) {
          if (data.beneficiaryDTO.swiftId) {
            self.letterOfCreditDetails.swiftId(data.beneficiaryDTO.swiftId);
            fetchAdditionalDetails();
          } else {
            self.letterOfCreditDetails.swiftId(null);
            fetchAdditionalDetails(null);
          }
        }
      });
    }

    function fetchBeneUserDetailsThroughEdit(beneficiaryId) {
      self.additionalBankDetails(null);

      LCDetailsModel.fetchBeneficiaryDetails(beneficiaryId).done(function (data) {
        self.letterOfCreditDetails.counterPartyName(data.beneficiaryDTO.name);
        self.letterOfCreditDetails.counterPartyAddress.line1(data.beneficiaryDTO.address.line1);
        self.letterOfCreditDetails.counterPartyAddress.line2(data.beneficiaryDTO.address.line2);
        self.letterOfCreditDetails.counterPartyAddress.line3(data.beneficiaryDTO.address.line3);
        self.letterOfCreditDetails.counterPartyAddress.country(data.beneficiaryDTO.address.country);
        self.benecountry(data.beneficiaryDTO.address.country);

        const countryLabel = self.beneCountryoptions().filter(function (data) {
          return data.value === self.benecountry();
        });

        self.beneVisibility(data.beneficiaryDTO.visibility);

        if (countryLabel && countryLabel.length > 0) {
          self.dropdownLabels.country(countryLabel[0].label);
        }
      });
    }

    self.beneIdChangeHandler = function (event) {

      if (event.detail.value) {
        const beneId = event.detail.value;

        self.additionalBankDetails(null);
        fetchBeneUserDetails(beneId);

      }
    };

    self.availableWithSubscribe = self.creditAvailableWithSelected.subscribe(function () {
      if (self.creditAvailableWithSelected() === "BANKADDRESS") {
        self.letterOfCreditDetails.validBICCode(false);
      } else {
        self.letterOfCreditDetails.validBICCode(true);
      }

      self.letterOfCreditDetails.availableWith(null);
      self.availableWithDetails(null);
    });

    function fetchBranchDate(branchCode) {
      LCDetailsModel.fetchBranchDate(branchCode).done(function (res) {
        if (res.branchDate) {
          const date = new Date(res.branchDate);

          self.letterOfCreditDetails.applicationDate(res.branchDate);
          date.setDate(date.getDate() + 1);
          self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
        }
      });
    }

    self.branchChangeHandler = function (event) {
      let branchLabel;

      if (event.detail.value && event.detail.value.length !== 0) {
        const branchId = event.detail.value;

        self.letterOfCreditDetails.branchId(branchId);

        branchLabel = self.branchIDoptions().filter(function (data) {
          return data.value === branchId;
        });

        if (branchLabel && branchLabel.length > 0) {
          self.dropdownLabels.branch(branchLabel[0].label);
        }

        fetchBranchDate(branchId);
      }
    };

    self.countryChangeHandler = function (event) {
      let countryLabel;

      if (event.detail.value) {
        const country = event.detail.value;

        self.letterOfCreditDetails.counterPartyAddress.country(event.detail.value);

        countryLabel = self.beneCountryoptions().filter(function (data) {
          return data.value === country;
        });

        if (countryLabel && countryLabel.length > 0) {
          self.dropdownLabels.country(countryLabel[0].label);
        }
      }
    };

    function fetchApplicantDetails(partyId) {
      LCDetailsModel.fetchPartyDetails(partyId).done(function (data) {
        self.applicantName(data.party.personalDetails.fullName);

        for (i = 0; i < data.party.addresses.length; i++) {
          if (data.party.addresses[i].type === "PST") {
            self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
            self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
            self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);

            const countryLabel = self.beneCountryoptions().filter(function (country) {
              return country.value === data.party.addresses[i].postalAddress.country;
            });

            self.applicantAddress.country(countryLabel[0].label);
          }
        }
      });
    }

    self.onPartyIdSelected = function (event) {
      if (event.detail.value) {
        const partyId = event.detail.value,
          party = self.partyIDoptions().filter(function (data) {
            return data.value === partyId;
          });

        if (party && party.length > 0) {
          self.letterOfCreditDetails.partyId.displayValue(party[0].label);
        }

        if (event.detail.value !== self.letterOfCreditDetails.partyId.value()) {
          fetchApplicantDetails(event.detail.value);
          self.letterOfCreditDetails.partyId.value(partyId);
        }
      }
    };

    function partyIdDetails() {
      if (self.letterOfCreditDetails.partyId.value()) {
        self.partyId(self.letterOfCreditDetails.partyId.value());
        fetchApplicantDetails(self.letterOfCreditDetails.partyId.value());

      }
    }

    partyIdDetails();

    self.addDraft = function () {
      self.draftArray.push({
        id: ++draftRowId,
        draftName: ko.observable(""),
        tenor: ko.observable("0"),
        draftAmount: ko.observable(""),
        draweeBank: self.draweeBank,
        specifyOthers: ko.observable("")
      });
    };

    self.continueFunc = function () {
      const tracker = document.getElementById("lcTracker");

      if (tracker.valid === "valid") {
        self.stages[self.stageIndex()].expanded(false);
        self.stages[self.stageIndex()].validated(true);
        self.stages[self.stageIndex() + 1].expanded(true);
      } else {
        self.stages[self.stageIndex()].validated(false);
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.remove = function (data) {
      self.draftArray.splice(data, 1);
      --draftRowId;
    };

    self.validateAmount = {
      validate: function (value) {
        if (value) {
          const numberfractional = value.toString().split(".");

          if (numberfractional[0] && (numberfractional[0].length > 2 || numberfractional[1]) && numberfractional[1].length > 2) {
            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.toleranceError);
          }
        }

        return true;
      }
    };

    self.validateLCAmount = {
      validate: function (value) {
        if (value) {
          if (value <= 0) {
            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.invalidAmountErrorMessage);
          }

          const numberfractional1 = value.toString().split(".");

          if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
          }

          if (numberfractional1[1]) {
            if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
              throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
            }
          }
        }

        return true;
      }
    };

    self.verifyAvailableCode = function () {

      const trackerSwift = document.getElementById("creditAvailableWith");

      if (trackerSwift.valid === "valid") {
        if (!self.bicCodeError()) {
          LCDetailsModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith()).done(function (data) {
            self.availableWithDetails(data);
          }).fail(function () {
            self.letterOfCreditDetails.availableWith("");
          });
        }
      } else {
        trackerSwift.showMessages();
        trackerSwift.focusOn("@firstInvalidShown");
      }
    };

    self.resetAvailableWith = function () {
      self.availableWithDetails(null);
      self.letterOfCreditDetails.availableWith("");
    };

    self.existingBeneSubscribe = self.existingBene.subscribe(function () {
      if (self.letterOfCreditDetails.beneId) {
        self.letterOfCreditDetails.beneId(null);
      }

      self.letterOfCreditDetails.counterPartyName(null);
      self.letterOfCreditDetails.counterPartyAddress.line1(null);
      self.letterOfCreditDetails.counterPartyAddress.line2(null);
      self.letterOfCreditDetails.counterPartyAddress.line3(null);

      if (self.letterOfCreditDetails.swiftId) {
        self.letterOfCreditDetails.swiftId(null);
      }

      self.additionalBankDetails(null);
      self.benecountry([]);
    });

    if (self.partyIDoptions().length === 1) {
      self.partyId([self.partyIDoptions()[0].value]);
      self.letterOfCreditDetails.partyId.value(self.partyIDoptions()[0].value);
      self.letterOfCreditDetails.partyId.displayValue(self.partyIDoptions()[0].label);
      fetchApplicantDetails(self.partyIDoptions()[0].value);
    }

    if (self.transactionType === "SHIPPING_GUARANTEE") {
      if (ko.utils.unwrapObservable(self.letterOfCreditDetails.branchId)) {
        self.branchId(self.letterOfCreditDetails.branchId());
      }

      if (ko.utils.unwrapObservable(self.letterOfCreditDetails.productId)) {
        self.productId(self.letterOfCreditDetails.productId());
      }

      if (ko.utils.unwrapObservable(self.letterOfCreditDetails.amount) && ko.utils.unwrapObservable(self.letterOfCreditDetails.amount).currency) {
        self.currency(ko.utils.unwrapObservable(self.letterOfCreditDetails.amount.currency));
      }
    }

    function setTransferableType() {
      if (self.transferableTypeValue() === "DEFFEREDPAYMENT" || self.transferableTypeValue() === "MIXEDPAYMENT") {
        self.paymentDetailsValueLoaded(true);
      } else {
        self.paymentDetailsValueLoaded(false);
      }

      self.transferableTypeValueLoaded(true);
    }

    function otherDetails() {
      if (self.letterOfCreditDetails.revolvingDetails) {
        self.frequencyUnit(self.letterOfCreditDetails.revolvingDetails.frequencyUnit());
      }

      if (self.letterOfCreditDetails.transferableType) {
        self.transferableTypeValue(self.letterOfCreditDetails.transferableType());
      }

      if (self.letterOfCreditDetails.availableWith && self.letterOfCreditDetails.availableWith() === null) {
        self.letterOfCreditDetails.availableWith(self.params.letterOfCreditDetails.availableWith);
      }

      if (self.letterOfCreditDetails.availableWith) {
        self.availableWithDetails();
      }

    }

    if (self.mode() === "EDIT") {
      self.productId(self.letterOfCreditDetails.productId());

      if (self.productId() !== null) {
        fetchProductDetails(self.productId());
      }

      if (self.letterOfCreditDetails.swiftId() === null) {
        self.letterOfCreditDetails.swiftId(self.params.letterOfCreditDetails.swiftId);
      }

      self.partyId(self.letterOfCreditDetails.partyId.value());
      fetchApplicantDetails(self.partyId());
      fetchAdditionalDetails(self.letterOfCreditDetails.availableWith);

      if (self.beneVisibility() === undefined && self.letterOfCreditDetails.beneId() !== null) {
        fetchBeneUserDetailsThroughEdit(self.letterOfCreditDetails.beneId());
      }

      otherDetails();

      setTransferableType();
      self.branchId(self.letterOfCreditDetails.branchId());

      if (self.letterOfCreditDetails.branchId() !== null) {
        fetchBranchDate(self.letterOfCreditDetails.branchId());

        const labelBranch = self.branchIDoptions().filter(function (data) {
          return data.value === self.letterOfCreditDetails.branchId();
        });

        if (labelBranch && labelBranch.length > 0) {
          self.dropdownLabels.branch(labelBranch[0].label);
        }
      }

      self.dropdownLabels.country(self.letterOfCreditDetails.counterPartyAddress.country());
      self.benecountry(self.letterOfCreditDetails.counterPartyAddress.country());
      self.currency(self.letterOfCreditDetails.amount.currency());
      self.exposureCurrency(self.letterOfCreditDetails.amount.currency());

      if (self.letterOfCreditDetails.billingDrafts && self.letterOfCreditDetails.billingDrafts !== null && self.letterOfCreditDetails.billingDrafts().length > 0) {
        self.draftArray.removeAll();

        self.draweeBank(self.letterOfCreditDetails.billingDrafts()[0].draweeBankId());

        for (i = 0; i < self.letterOfCreditDetails.billingDrafts().length; i++) {
          self.draftArray.push({
            id: i + 1,
            draftAmount: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].amount.amount()),
            draweeBank: self.draweeBank,
            specifyOthers: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].otherInformation()),
            tenor: ko.observable(self.letterOfCreditDetails.billingDrafts()[i].tenor())
          });
        }
      }
    }

    self.transferableTypeValueChangeHandler = function (event, data) {
      self.letterOfCreditDetails.paymentDetails(null);

      if (event.detail.value === "DEFFEREDPAYMENT" || event.detail.value === "MIXEDPAYMENT") {
        self.paymentDetailsValueLoaded(true);
      } else {
        self.paymentDetailsValueLoaded(false);
      }
    };

    self.letterOfCreditDetails.productId = ko.computed(function () {
      return self.productId();
    });

    function PopulateCurrencyList() {
      if (self.letterOfCreditDetails.productId() !== "" && (self.letterOfCreditDetails.state() === "DRAFT" || self.letterOfCreditDetails.state() === "TEMPLATE")) {

        self.productId(self.letterOfCreditDetails.productId());
        self.currencyListOptions.removeAll();

        LCDetailsModel.fetchSGProductDetails(self.productId(), self.letterOfCreditDetails.state()).done(function (productDetails) {
          const currency = productDetails.product.currencies.map(function (currencyData) {
            return {
              value: currencyData.code,
              label: currencyData.code
            };
          });

          ko.utils.arrayPushAll(self.currencyListOptions, currency);
          self.currency(ko.utils.unwrapObservable(self.letterOfCreditDetails.amount.currency()));
        });

      }
    }

    if (self.letterOfCreditDetails.amount) {
      if (self.transactionType === "SHIPPING_GUARANTEE") {
        PopulateCurrencyList();
      }

      self.letterOfCreditDetails.amount.currency = ko.computed(function () {
        return self.currency();
      });

    }

    if (self.letterOfCreditDetails.exposure) {
      self.letterOfCreditDetails.exposure.currency = ko.computed(function () {
        return self.currency();
      });

      self.letterOfCreditDetails.exposure.amount = ko.computed(function () {
        if (self.letterOfCreditDetails.amount.amount() === null) {
          return 0;
        }

        return (parseFloat(self.letterOfCreditDetails.amount.amount() * 0.01 * self.letterOfCreditDetails.toleranceAbove()) + parseFloat(self.letterOfCreditDetails.amount.amount())).toFixed(2);
      });
    }

    if (self.letterOfCreditDetails.transferableType) {
      self.letterOfCreditDetails.transferableType = ko.computed(function () {
        return self.transferableTypeValue();
      });
    }
  };

  vm.prototype.dispose = function () {
    if (this.existingBeneSubscribe) {
      this.existingBeneSubscribe.dispose();
    }

    if (this.draftSubscribe) {
      this.draftSubscribe.dispose();
    }

    if (this.beneSubscribe) {
      this.beneSubscribe.dispose();
    }

    if (this.availableWithSubscribe) {
      this.availableWithSubscribe.dispose();
    }

    if (self.letterOfCreditDetails && self.letterOfCreditDetails.productId) {
      self.letterOfCreditDetails.productId.dispose();
    }

    if (self.letterOfCreditDetails && self.letterOfCreditDetails.amount) {
      self.letterOfCreditDetails.amount.currency.dispose();
    }

    if (self.letterOfCreditDetails.exposure) {
      self.letterOfCreditDetails.exposure.currency.dispose();
      self.letterOfCreditDetails.exposure.amount.dispose();
    }

    if (self.letterOfCreditDetails.transferableType) {
      self.letterOfCreditDetails.transferableType.dispose();
    }
  };

  return vm;
});