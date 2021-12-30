define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojs/ojselectcombobox"
], function (oj, ko, $, CollectionDetailsModel) {
  "use strict";

  let self;
  const vm = function (params) {
    self = this;
    ko.utils.extend(self, params.rootModel);
    self.stageIndex = params.index;
    self.draweeName = ko.observable();
    self.country = ko.observable();

    if (!self.existingBene) {
      if (self.mode() === "EDIT" && self.collectionDetails.counterpartyId() === null) {
        self.existingBene = ko.observable("false");
      } else {
        self.existingBene = ko.observable("true");
      }
    }

    function fetchAdditionalDetails() {
      CollectionDetailsModel.getBankDetailsBIC(self.collectionDetails.swiftId()).done(function (data) {
        self.additionalBankDetails(data);
        self.collectionDetails.swiftId(self.additionalBankDetails().code);
        self.collectionDetails.bankName(data.name);
        self.collectionDetails.bankAddress.line1(data.branchAddress.line1);
        self.collectionDetails.bankAddress.line2(data.branchAddress.line2);
        self.collectionDetails.bankAddress.line3(data.branchAddress.line3);
        self.collectionDetails.bankAddress.country(data.branchAddress.country);
      }).fail(function () {
        self.collectionDetails.swiftId(null);
      });
    }

    function fetchBeneUserDetails(counterName) {
      CollectionDetailsModel.fetchBeneficiaryDetails(counterName).done(function (data) {
        self.collectionDetails.counterPartyName(data.beneficiaryDTO.name);
        self.collectionDetails.counterPartyAddress.line1(data.beneficiaryDTO.address.line1);
        self.collectionDetails.counterPartyAddress.line2(data.beneficiaryDTO.address.line2);
        self.collectionDetails.counterPartyAddress.line3(data.beneficiaryDTO.address.line3);
        self.draweeCountry(data.beneficiaryDTO.address.country);
        self.beneVisibility(data.beneficiaryDTO.visibility);

        if (data.beneficiaryDTO.swiftId) {
          self.collectionDetails.swiftId(data.beneficiaryDTO.swiftId);
          fetchAdditionalDetails(data.beneficiaryDTO.swiftId);
        } else {
          self.collectionDetails.swiftId(null);
          self.additionalBankDetails(null);
        }
      });
    }

    function fetchApplicantDetails(partyId) {
      CollectionDetailsModel.fetchPartyDetails(partyId).done(function (data) {
        self.applicantName(data.party.personalDetails.fullName);

        for (let i = 0; i < data.party.addresses.length; i++) {
          if (data.party.addresses[i].type === "PST") {
            self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
            self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
            self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);

            const countryLabel = self.draweeCountryoptions().filter(function (countryData) {
              return countryData.value === data.party.addresses[i].postalAddress.country;
            });

            self.applicantAddress.country(countryLabel[0].label);
          }
        }
      });
    }

    function fetchBranchDate(branchCode) {
      CollectionDetailsModel.fetchBranchDate(branchCode).done(function (res) {
        if (res.branchDate) {
          const date = new Date(res.branchDate);

          self.collectionDetails.daysFrom(res.branchDate);
          self.collectionDetails.applicationDate(res.branchDate);
          date.setDate(date.getDate() + 1);
          self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
        }
      });
    }

    function setDocumentArray(productDocumentList, selectedDocumentList) {
      const clause = [];

      for (let i = 0; i < productDocumentList.length; i++) {
        let docSelected = "false",
          originals = "0",
          originalsOutOff = "0",
          copies = 0,
          secondOriginals = "0",
          secondOriginalsOutOff = "0",
          secondCopies = 0;

        for (let j = 0; j < selectedDocumentList().length; j++) {
          if (selectedDocumentList()[j].id() === productDocumentList[i].id) {
            docSelected = "true";
            originals = selectedDocumentList()[j].originals();

            if (originals.indexOf("/") !== -1) {
              originalsOutOff = originals.split("/")[1];
              originals = originals.split("/")[0];
            }

            if (selectedDocumentList()[j].secondOriginals) {
              secondOriginals = selectedDocumentList()[j].secondOriginals();

              if (secondOriginals.indexOf("/") !== -1) {
                secondOriginalsOutOff = secondOriginals.split("/")[1];
                secondOriginals = secondOriginals.split("/")[0];
              }
            } else {
              secondOriginalsOutOff = 0;
              secondOriginals = 0;
            }

            copies = selectedDocumentList()[j].copies();

            if (selectedDocumentList()[j].secondCopies) {
              secondCopies = selectedDocumentList()[j].secondCopies();
            } else {
              secondCopies = 0;
            }
          }
        }

        self.docArray.push({
          docSelected: ko.observable([docSelected]),
          id: productDocumentList[i].id,
          docName: productDocumentList[i].name,
          docType: productDocumentList[i].docType,
          originals: ko.observable(originals),
          originalsOutOff: ko.observable(originalsOutOff),
          copies: ko.observable(copies),
          secondOriginals: ko.observable(secondOriginals),
          secondOriginalsOutOff: ko.observable(secondOriginalsOutOff),
          secondCopies: ko.observable(secondCopies),
          clause: clause
        });
      }

      self.showDocuments(true);
    }

    function fetchProductDetails(productId, state) {
      CollectionDetailsModel.fetchProductDetails(productId).done(function (productDetails) {
        self.collectionDetails.billOperation(productDetails.billProductDTO.productOperation);

        const currency = productDetails.billProductDTO.currency.map(function (currencyData) {
          return {
            value: currencyData.code,
            label: currencyData.code
          };
        });

        self.currencyListOptions.removeAll();
        ko.utils.arrayPushAll(self.currencyListOptions, currency);

        if (productDetails.billProductDTO.tenorCode === "USANCE") {
          self.maxTenor(productDetails.billProductDTO.maximumTenor);
          self.minTenor(productDetails.billProductDTO.minimumTenor);
        }

        if (state === "onProductChange" && productDetails.billProductDTO.tenorCode === "USANCE") {
          self.collectionDetails.tenor(productDetails.billProductDTO.standardTenor);
        }

        if (self.filterValues.lcLinked() === "false") {
          self.showDocuments(false);
          self.docArray.removeAll();

          if (state === "onProductChange") {
            for (let i = 0; i < productDetails.billProductDTO.documents.length; i++) {
              const clause = [];

              self.docArray.push({
                docSelected: ko.observable(["false"]),
                id: productDetails.billProductDTO.documents[i].id,
                docName: productDetails.billProductDTO.documents[i].name,
                docType: productDetails.billProductDTO.documents[i].docType,
                originals: ko.observable(0),
                originalsOutOff: ko.observable(0),
                copies: ko.observable(0),
                secondOriginals: ko.observable(0),
                secondOriginalsOutOff: ko.observable(0),
                secondCopies: ko.observable(0),
                clause: clause
              });
            }

            self.showDocuments(true);
          } else {
            setDocumentArray(productDetails.billProductDTO.documents, self.collectionDetails.document);
          }
        }
      });
    }

    if (self.mode() === "EDIT") {
      self.draweeCountry(self.collectionDetails.counterPartyAddress.country());
      self.branchId(self.collectionDetails.branchId());
      self.partyId(self.collectionDetails.partyId.value());
      self.currency(self.collectionDetails.amount.currency());
      self.baseDateCode(self.collectionDetails.baseDateCode());

      if (self.collectionDetails.swiftId() !== null && self.collectionDetails.swiftId() !== "") {
        fetchAdditionalDetails(self.collectionDetails.swiftId());
      }

      if (self.collectionDetails.swiftId() === null) {
        self.collectionDetails.swiftId(self.params.collectionDetails.swiftId);
        fetchAdditionalDetails(self.collectionDetails.swiftId());
      }

      fetchApplicantDetails(self.partyId());
    }

    CollectionDetailsModel.fetchParty().done(function (data) {
      CollectionDetailsModel.fetchPartyRelations().done(function (partyData) {
        const parties = [];

        parties.push({
          label: data.party.id.displayValue,
          value: data.party.id.value
        });

        const mappedParties = partyData.partyToPartyRelationship;

        for (let i = 0; i < mappedParties.length; i++) {
          parties.push({
            value: mappedParties[i].relatedParty.value,
            label: mappedParties[i].relatedParty.displayValue
          });
        }

        self.partyIdoptions(parties);

        if (self.partyIdoptions().length === 1 && self.mode() === "CREATE" && !self.params.lcId) {
          self.partyId(self.partyIdoptions()[0].value);
          self.collectionDetails.partyId.value(self.partyIdoptions()[0].value);
          self.collectionDetails.partyId.displayValue(self.partyIdoptions()[0].label);
          fetchApplicantDetails(self.partyIdoptions()[0].value);
        }
      });
    });

    self.counterPartySubscribe = self.collectionDetails.counterpartyId.subscribe(function (newValue) {
      if (newValue !== null) {
        fetchBeneUserDetails(newValue);
      }
    });

    CollectionDetailsModel.getBaseDateDescrption().done(function (data) {
      const description = data.baseDateList.map(function (data) {
        return {
          value: data.code,
          label: data.description
        };
      });

      self.baseDtDescriptionOptions(description);

      if (self.baseDateCode()) {
        const descriptionLabel = self.baseDtDescriptionOptions().filter(function (data) {
          return data.value === self.baseDateCode();
        });

        if (descriptionLabel && descriptionLabel.length > 0) {
          self.dropdownLabels.baseDateDescription(descriptionLabel[0].label);
        }
      }

      self.dropdownListLoaded.baseDateDescriptionList(true);
    });

    self.collectionDetails.amount.currency = ko.computed(function () {
      return self.currency();
    });

    self.collectionDetails.purchaseAmount.currency = ko.computed(function () {
      return self.currency();
    });

    self.validateAmount = {
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

    self.validatePurchaseAmount = {
      validate: function (value) {
        if (value) {
          if (value > self.collectionDetails.amount.amount()) {
            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.shipmentDetails.inValidPurchaseAmount);
          }
        }

        return true;
      }
    };

    self.collectionDetails.maturityDate = ko.computed(function () {
      if (self.collectionDetails.daysFrom() !== null && self.collectionDetails.tenor() !== "" && self.collectionDetails.tenor() !== null) {
        const maturityDate = new Date(self.collectionDetails.daysFrom());

        maturityDate.setDate(maturityDate.getDate() + parseInt(self.collectionDetails.tenor()));
        maturityDate.setHours(0, 0, 0, 0);

        return oj.IntlConverterUtils.dateToLocalIso(maturityDate);
      }
    });

    self.baseDateCodeSubscribe = self.baseDateCode.subscribe(function (newValue) {
      if (newValue && self.baseDtDescriptionOptions()) {
        const descriptionId = newValue;

        self.collectionDetails.baseDateCode(descriptionId);

        const descriptionLabel = self.baseDtDescriptionOptions().filter(function (data) {
          return data.value === descriptionId;
        });

        if (descriptionLabel && descriptionLabel.length > 0) {
          self.dropdownLabels.baseDateDescription(descriptionLabel[0].label);
          self.collectionDetails.baseDateDescription(descriptionLabel[0].label);
        }
      }
    });

    self.onPartyIdSelected = function (event) {
      if (event.detail.value) {
        const partyId = event.detail.value,
          party = self.partyIdoptions().filter(function (data) {
            return data.value === partyId;
          });

        if (party && party.length > 0) {
          self.collectionDetails.partyId.displayValue(party[0].label);

          if (partyId !== self.collectionDetails.partyId.value()) {
            self.collectionDetails.partyId.value(partyId);
            fetchApplicantDetails(partyId);
          }
        } else {
          self.collectionDetails.partyId.displayValue(null);
          self.collectionDetails.partyId.value(null);
          self.applicantName(null);
          self.applicantAddress.line1(null);
          self.applicantAddress.line2(null);
          self.applicantAddress.line3(null);
          self.applicantAddress.country(null);
        }
      }
    };

    self.branchIdSubscribe = self.branchId.subscribe(function (newValue) {
      if (!$.isEmptyObject(newValue)) {
        if (self.branchIdOptions()) {
          const branchId = newValue;

          self.collectionDetails.branchId(branchId);

          const branchLabel = self.branchIdOptions().filter(function (data) {
            return data.value === branchId;
          });

          if (branchLabel && branchLabel.length > 0) {
            self.dropdownLabels.branch(branchLabel[0].label);
          }

          fetchBranchDate(branchId);
        }
      }
    });

    self.draweeCountrySubscribe = self.draweeCountry.subscribe(function (newValue) {
      if (self.draweeCountryoptions()) {
        const country = newValue;

        self.collectionDetails.counterPartyAddress.country(country);

        const countryLabel = self.draweeCountryoptions().filter(function (data) {
          return data.value === country;
        });

        if (countryLabel && countryLabel.length > 0) {
          self.dropdownLabels.country(countryLabel[0].label);
        }
      }
    });

    self.verifyCode = function () {

      const trackerSwift = document.getElementById("swiftCode");

      if (trackerSwift.valid === "valid") {
        if (!self.bicCodeError()) {
          CollectionDetailsModel.getBankDetailsBIC(self.collectionDetails.swiftId()).done(function (data) {
            self.additionalBankDetails(data);
            self.collectionDetails.bankName(data.name);
            self.collectionDetails.bankAddress.line1(data.branchAddress.line1);
            self.collectionDetails.bankAddress.line2(data.branchAddress.line2);
            self.collectionDetails.bankAddress.line3(data.branchAddress.line3);
            self.collectionDetails.bankAddress.country(data.branchAddress.country);
          }).fail(function () {
            self.collectionDetails.swiftId("");
          });
        }
      } else {
        trackerSwift.showMessages();
        trackerSwift.focusOn("@firstInvalidShown");
      }
    };

    CollectionDetailsModel.fetchDraweeCountry().done(function (taskData) {
      const countries = taskData.enumRepresentations[0].data.map(function (data) {
        return {
          value: data.code,
          label: data.description
        };
      }).filter(function (data) {
        return data.label && data.value;
      });

      self.draweeCountryoptions(countries);

      if (self.draweeCountry()) {
        const countryLabel = self.draweeCountryoptions().filter(function (data) {
          return data.value === self.draweeCountry();
        });

        if (countryLabel && countryLabel.length > 0) {
          self.dropdownLabels.country(countryLabel[0].label);
        }
      }

      self.dropdownListLoaded.countries(true);
    });

    CollectionDetailsModel.fetchBranch().done(function (branchData) {
      const branches = branchData.branchAddressDTO.map(function (data) {
        return {
          value: data.id,
          label: data.branchName
        };
      });

      self.branchIdOptions(branches);

      let branchLabel;

      if (self.mode() !== "EDIT" && self.branchId()) {
        branchLabel = self.branchIdOptions().filter(function (data) {
          return data.value === self.branchId();
        });

        if (branchLabel && branchLabel.length > 0) {
          self.dropdownLabels.branch(branchLabel[0].label);
        }
      } else {
        branchLabel = self.branchIdOptions().filter(function (data) {
          return data.value === self.branchId();
        });

        if (branchLabel && branchLabel.length > 0) {
          self.dropdownLabels.branch(branchLabel[0].label);
        }
      }

      self.dropdownListLoaded.branches(true);
    });

    self.continueFunc = function () {
      const tracker = document.getElementById("collectionValidationTracker");

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

    self.resetCode = function () {
      self.additionalBankDetails(null);
      self.collectionDetails.swiftId("");
    };

    self.getProductsList = function () {
      CollectionDetailsModel.getProductsList(self.filterValues).done(function (data) {
        self.productListForCollections.removeAll();

        for (let i = 0; i < data.billProductDTOList.length; i++) {
          self.productListForCollections.push({
            label: data.billProductDTOList[i].name,
            value: data.billProductDTOList[i].id
          });
        }

        if (data.multiGoodsConfig && data.multiGoodsConfig === "Y") {
          self.multiGoodsSupported(true);
        }

        if (data.billProductDTOList[0].tenorCode === "SIGHT") {
          self.collectionDetails.tenor("0");
          self.tenorDisabled(true);
        } else if (data.billProductDTOList[0].tenorCode === "USANCE") {
          self.collectionDetails.tenor(null);
          self.tenorDisabled(false);
        }

        let productLabel;

        if (self.mode() !== "EDIT" && self.productId()) {
          productLabel = self.productListForCollections().filter(function (data) {
            return data.value === self.productId();
          });

          if (productLabel && productLabel.length > 0) {
            self.dropdownLabels.product(productLabel[0].label);
          }
        } else {
          productLabel = self.productListForCollections().filter(function (data) {
            return data.value === self.collectionDetails.productId();
          });

          if (productLabel && productLabel.length > 0) {
            self.dropdownLabels.product(productLabel[0].label);
          }
        }

        self.dropdownListLoaded.productList(true);
      });
    };

    self.fetchProductList = ko.computed(function () {
      if (self.filterValues.paymentType() !== null && self.filterValues.docAttached() !== null && self.filterValues.lcLinked() !== null) {
        self.productId(null);
        self.collectionDetails.billOperation(null);
        self.currencyListOptions.removeAll();

        if (self.filterValues.lcLinked() === "false") {
          self.docArray.removeAll();
        }

        self.getProductsList();
      }
    });

    self.productIdSubscribe = self.productId.subscribe(function (newValue) {
      if (newValue) {
        const productId = newValue,
          productLabel = self.productListForCollections().filter(function (data) {
            return data.value === productId;
          });

        if (productLabel && productLabel.length > 0) {
          self.dropdownLabels.product(productLabel[0].label);
        }

        if (productId !== self.collectionDetails.productId() && productId.length !== 0) {
          self.collectionDetails.productId(productId);
          fetchProductDetails(productId, "onProductChange");
        } else if (self.mode() === "EDIT") {
          fetchProductDetails(productId);
        }
      }
    });

    if (self.mode() === "EDIT") {
      self.productId(self.collectionDetails.productId());

      if (self.beneVisibility() === undefined && self.collectionDetails.counterpartyId() !== null) {
        fetchBeneUserDetails(self.collectionDetails.counterpartyId());
      }
    }

    self.exisitingBeneSubscribe = self.existingBene.subscribe(function () {
      self.collectionDetails.counterpartyId(null);
      self.collectionDetails.counterPartyName(null);
      self.collectionDetails.counterPartyAddress.line1(null);
      self.collectionDetails.counterPartyAddress.line2(null);
      self.collectionDetails.counterPartyAddress.line3(null);
      self.collectionDetails.swiftId(null);
      self.additionalBankDetails(null);
      self.draweeCountry([]);
    });
  };

  vm.prototype.dispose = function () {
    this.counterPartySubscribe.dispose();
    this.exisitingBeneSubscribe.dispose();
    this.baseDateCodeSubscribe.dispose();
    this.branchIdSubscribe.dispose();
    this.draweeCountrySubscribe.dispose();
    this.productIdSubscribe.dispose();
    self.collectionDetails.amount.currency.dispose();
    self.collectionDetails.purchaseAmount.currency.dispose();
    self.collectionDetails.maturityDate.dispose();
    self.fetchProductList.dispose();
  };

  return vm;
});