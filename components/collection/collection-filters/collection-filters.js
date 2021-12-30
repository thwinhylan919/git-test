define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/initiate-collection",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojvalidation",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox"
], function (oj, ko, $, CollectionFilterModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this;
    let i;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.lcLookupFlag = ko.observable("true");
    self.disableLcDetails = ko.observable(false);
    self.details = self.isShippingGuarantee ? self.letterOfCreditDetails : self.collectionDetails;

    params.baseModel.registerComponent("lc-lookup", "trade-finance");

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

    function fetchApplicantDetails(partyId) {
      CollectionFilterModel.fetchPartyDetails(partyId).done(function (data) {
        self.applicantName(data.party.personalDetails.fullName);

        for (i = 0; i < data.party.addresses.length; i++) {
          if (data.party.addresses[i].type === "PST") {
            self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
            self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
            self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);

            if (self.transactionType !== "SHIPPING_GUARANTEE") {
              const countryLabel = self.draweeCountryoptions().filter(function (countryData) {
                return countryData.value === data.party.addresses[i].postalAddress.country;
              });

              self.applicantAddress.country(countryLabel[0].label);
            }
          }

        }
      });
    }

    function setLetterOfCreditDetails(letterOfCredit) {
      if (self.dataLoaded) {
        self.dataLoaded(false);
      }

      self.lcLookupFlag("false");
      self.filterValues.lcNumber(letterOfCredit.id);
      self.partyId(letterOfCredit.partyId.value);
      self.draweeCountry(letterOfCredit.counterPartyAddress.country);
      self.branchId(letterOfCredit.branchId);
      self.isBranchDisable(true);
      self.goodsCode(letterOfCredit.shipmentDetails.goodsCode);
      self.currency(letterOfCredit.outstandingAmount.currency);

      fetchApplicantDetails(self.partyId());

      if (self.mapping) {
        for (const property of Object.keys(self.mapping)) {
          if (Object.prototype.hasOwnProperty.call(self.mapping, property)) {
            if (typeof self.mapping[property] === "object") {
              for (const subProperty in Object.keys(self.mapping[property])) {
                if (Object.prototype.hasOwnProperty.call(self.mapping[property], subProperty)) {
                  self.details[property][subProperty](letterOfCredit[self.mapping[property][subProperty]]);
                }
              }
            } else if (self.details[property]) {
              self.details[property](letterOfCredit[self.mapping[property]]);
            }
          }
        }

        self.dataLoaded(true);
      }
    }

    function setDocumentArray(productDocumentList, selectedDocumentList) {
      let clause = [];

      for (i = 0; i < productDocumentList.length; i++) {
        let clauseSelectedFlag = false;

        clause = [];

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

            if (selectedDocumentList()[j].clause && selectedDocumentList()[j].clause().length > 0) {
              clauseSelectedFlag = true;
              clause = setClauseArray(productDocumentList[i].id, productDocumentList[i].clause, selectedDocumentList()[j].clause());
            }
          }
        }

        if (!clauseSelectedFlag) {
          clause = setClauseArray(productDocumentList[i].id, productDocumentList[i].clause, []);
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

        if (clauseSelectedFlag && clause.length > 0) {
          self.clauseTableArray.push({
            allClauseSelected: ko.observable(["false"]),
            docId: productDocumentList[i].id,
            docName: params.baseModel.format(self.nls.labels.documentName, {
              docName: productDocumentList[i].name
            }),
            datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clause, {
              idAttribute: "rowId"
            }))
          });
        }
      }

      self.showDocuments(true);
    }

    function fetchDocumentListForLCProduct(productId, lcDocumentList) {
      if (self.transactionType !== "SHIPPING_GUARANTEE") {
        self.docArray.removeAll();

        CollectionFilterModel.fetchLCProductDetails(productId).done(function (productDetails) {
          setDocumentArray(productDetails.letterOfCreditProductDTO.documents, ko.mapping.fromJS(lcDocumentList));
        });
      }
    }

    self.filterValuesSubscribe = self.filterValues.lcLinked.subscribe(function (value) {

      if (value === "false") {
        self.filterValues.lcNumber("");

        if (self.transactionType !== "SHIPPING_GUARANTEE") {
          self.pricePerUnitDisabled(false);
        }
      }

      if (self.mode() !== "VIEW" && self.mode() !== "CREATE") {
        if (self.transactionType !== "SHIPPING_GUARANTEE") {
          self.resetAllLcData();
        }

        if (value === "true") {
          self.lcLookupFlag("true");
        }
      }

      if (self.transactionType === "SHIPPING_GUARANTEE") {
        if (self.filterValues.lcNumber() === "" && value === "true") {
          self.lcLookupFlag("true");
        }

        self.menuButtonEnabled(false);

        if (value === "true") {
          self.menuItemOptions([{
            value: "draftSave",
            label: self.nls.labels.draftSave
          }]);
        } else {
          self.menuItemOptions([
            {
              value: "draftSave",
              label: self.nls.labels.draftSave
            },
            {
              value: "templateSave",
              label: self.nls.labels.templateSave
            }
          ]);
        }

        self.menuButtonEnabled(true);
      }
    });

    self.openLCLookup = function () {
      $("#lcLookupDialog").trigger("openModal");
    };

    if (self.params && self.params.lcId) {
      self.disableLcDetails(true);
    }

    self.loadLCDetails = function () {
      if (self.filterValues.lcNumber()) {
        self.lcLookupFlag("false");

        CollectionFilterModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {

          if (self.isShippingGuarantee) {
            const id = ko.utils.unwrapObservable(self.details.id);

            setLetterOfCreditDetails(data.letterOfCredit);

            self.details.letterOfCredit = ko.observable(self.filterValues.lcNumber());
            self.details.id = ko.observable(id);
          }
          else {
            self.lcDetails(data.letterOfCredit);
          }
        });
      }
    };

    self.lcDdetailSubscribe = self.lcDetails && self.lcDetails.subscribe(function (letterOfCredit) {
      const id = ko.utils.unwrapObservable(self.details.id());

      if (letterOfCredit !== null) {

        setLetterOfCreditDetails(letterOfCredit);

        if (!self.mapping) {
          self.details.partyId.displayValue(letterOfCredit.partyId.displayValue);
          self.details.partyId.value(letterOfCredit.partyId.value);
          self.details.lcRefNo(letterOfCredit.id);
          self.details.lcCustomer.displayValue(letterOfCredit.partyId.displayValue);
          self.details.lcCustomer.value(letterOfCredit.partyId.value);
          self.details.customerRefNo(letterOfCredit.beneRefNo);
          self.details.bankRefNo(letterOfCredit.bankRefNo);
          self.details.counterPartyName(letterOfCredit.counterPartyName);
          self.details.draweePartyId.displayValue(letterOfCredit.counterPartyId.displayValue);
          self.details.draweePartyId.value(letterOfCredit.counterPartyId.value);
          self.details.applicationDate(letterOfCredit.applicationDate);
          self.details.swiftId(letterOfCredit.issuingBankCode);

          CollectionFilterModel.getBankDetailsBIC(self.details.swiftId()).done(function (data) {
            self.additionalBankDetails(data);
            self.details.bankName(data.name);
            self.details.bankAddress.line1(data.branchAddress.line1);
            self.details.bankAddress.line2(data.branchAddress.line2);
            self.details.bankAddress.line3(data.branchAddress.line3);
            self.details.bankAddress.country(data.branchAddress.country);
          });

          self.details.branchId(letterOfCredit.branchId);
          self.details.amount.amount(letterOfCredit.outstandingAmount.amount);
          self.details.shipmentDetails.description(letterOfCredit.shipmentDetails.description);

          if (letterOfCredit.counterPartyAddress && letterOfCredit.counterPartyAddress !== undefined) {
            self.details.counterPartyAddress.line1(letterOfCredit.counterPartyAddress.line1);
            self.details.counterPartyAddress.line2(letterOfCredit.counterPartyAddress.line2);
            self.details.counterPartyAddress.line3(letterOfCredit.counterPartyAddress.line3);
          }

          if (letterOfCredit.shipmentDetails.source && letterOfCredit.shipmentDetails.source !== undefined) {
            self.details.shipmentDetails.source(letterOfCredit.shipmentDetails.source);
          }

          if (letterOfCredit.shipmentDetails.dischargePort && letterOfCredit.shipmentDetails.dischargePort !== undefined) {
            self.details.shipmentDetails.dischargePort(letterOfCredit.shipmentDetails.dischargePort);
          }

          if (letterOfCredit.shipmentDetails.loadingPort && letterOfCredit.shipmentDetails.loadingPort !== undefined) {
            self.details.shipmentDetails.loadingPort(letterOfCredit.shipmentDetails.loadingPort);
          }

          if (letterOfCredit.shipmentDetails.destination && letterOfCredit.shipmentDetails.destination !== undefined) {
            self.details.shipmentDetails.destination(letterOfCredit.shipmentDetails.destination);
          }
        }

        if (self.isShippingGuarantee) {
          self.details.letterOfCredit(letterOfCredit.id);
          self.details.id(id);
        }

        if (self.transactionType !== "SHIPPING_GUARANTEE") {
          //Load goods into local array when multiple goods are supported
          if (letterOfCredit.multiGoodsSupported && letterOfCredit.multiGoodsSupported === "Y") {
            ko.tasks.runEarly();
            self.goodsArray.removeAll();
            ko.tasks.runEarly();

            if (letterOfCredit.goods && letterOfCredit.goods.length > 0 && self.goodsArray().length === 0) {
              for (i = 0; i < letterOfCredit.goods.length; i++) {
                if (self.isShippingGuarantee) {
                  self.goodsArray.push({
                    srNo: i + 1,
                    id: ko.observable(letterOfCredit.goods[i].code),
                    description: ko.observable(letterOfCredit.goods[i].description),
                    units: letterOfCredit.goods[i].noOfUnits ? ko.observable(letterOfCredit.goods[i].noOfUnits) : null,
                    pricePerUnit: letterOfCredit.goods[i].pricePerUnit ? ko.observable(letterOfCredit.goods[i].pricePerUnit) : null
                  });
                } else {
                  self.goodsArray.push({
                    id: i + 1,
                    goodsCode: ko.observable(letterOfCredit.goods[i].code),
                    description: ko.observable(letterOfCredit.goods[i].description),
                    units: letterOfCredit.goods[i].noOfUnits ? ko.observable(letterOfCredit.goods[i].noOfUnits) : null,
                    pricePerUnit: letterOfCredit.goods[i].pricePerUnit ? ko.observable(letterOfCredit.goods[i].pricePerUnit) : null
                  });
                }
              }

              self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, {
                idAttribute: "id"
              });
            }
          }

          fetchDocumentListForLCProduct(letterOfCredit.productId, letterOfCredit.document);
        }
      }
    });

    if (self.lcId && self.lcId()) {
      self.filterValues.lcNumber(self.lcId());
      self.filterValues.lcLinked("true");
      self.lcLookupFlag("false");
    }

    if (self.params && self.params.lcId) {
      self.filterValues.lcNumber(self.params.lcId);
      self.filterValues.lcLinked("true");
      self.isBranchDisable(true);

      CollectionFilterModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {
        self.lcDetails(data.letterOfCredit);
      });
    } else if (self.mode() === "EDIT") {
      if (self.transactionType !== "SHIPPING_GUARANTEE") {
        self.filterValues.lcNumber(self.details.lcRefNo());
      }
      else {
        self.filterValues.lcNumber(self.params.lcId);
        self.filterValues.lcLinked("true");
        self.isBranchDisable(true);
      }

      if (self.filterValues.lcLinked() === "true") {
        CollectionFilterModel.getLcDetails(self.filterValues.lcNumber()).done(function (data) {
          fetchDocumentListForLCProduct(data.letterOfCredit.productId, self.details.document);
        });
      }
    }

    self.resetLC = function () {
      self.resetAllLcData();
      self.lcLookupFlag("true");
      self.isBranchDisable(false);
    };

    self.resetAllLcData = function () {
      if (self.mode() !== "VIEW") {
        self.lcDetails(null);
        self.partyId([]);
        self.filterValues.lcNumber("");
        self.draweeCountry([]);
        self.productId([]);
        self.branchId([]);
        self.additionalBankDetails("");
        self.goodsArray.removeAll();
        self.dropdownLabels.country(null);

        self.currency(null);
        self.goodsCode(null);
        self.baseDateCode(null);

        if (self.mapping) {
          for (const property in Object.keys(self.mapping)) {
            if (Object.prototype.hasOwnProperty.call(self.mapping, property)) {
              if (typeof self.mapping[property] === "object") {
                for (const subProperty in Object.keys(self.mapping[property])) {
                  if (Object.prototype.hasOwnProperty.call(self.mapping[property], subProperty)) {
                    self.details[property][subProperty](null);
                  }
                }
              }

              self.details[property](null);
            }
          }
        } else {
          self.details.lcRefNo(null);
          self.details.lcCustomer.value(null);
          self.details.lcCustomer.displayValue(null);
          self.details.customerRefNo(null);
          self.details.bankRefNo(null);
          self.details.counterPartyName(null);
          self.details.remarks(null);
          self.details.billOperation(null);
          self.details.baseDateDescription(null);
          self.details.baseDateCode(null);
          self.details.counterpartyId(null);
          self.details.tenor(null);
          self.details.swiftId(null);
          self.details.amount.amount(null);
          self.details.applicationDate(null);
          self.details.branchId(null);
          self.details.shipmentDetails.goodsCode(null);
          self.details.shipmentDetails.description(null);
          self.details.shipmentDetails.source(null);
          self.details.shipmentDetails.dischargePort(null);
          self.details.shipmentDetails.loadingPort(null);
          self.details.shipmentDetails.destination(null);
          self.details.counterPartyAddress.line1(null);
          self.details.counterPartyAddress.line2(null);
          self.details.counterPartyAddress.line3(null);
          self.details.draweePartyId.displayValue(null);
          self.details.draweePartyId.value(null);
          self.details.baseDateCode(null);
          self.details.productId(null);
          self.details.daysFrom(null);
        }
      } else {
        self.lcNumber("");
        self.filterValues.lcNumber("");
      }
    };
  };

  vm.prototype.dispose = function () {
    this.filterValuesSubscribe.dispose();
    this.lcDdetailSubscribe.dispose();
  };

  return vm;
});
