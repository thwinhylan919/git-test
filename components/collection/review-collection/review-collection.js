define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/initiate-collection",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojinputtext",
  "ojs/ojaccordion",
  "ojs/ojcollapsible"
], function (oj, ko, $, ReviewCollectionModel, resourceBundle) {
  "use strict";

  return function (params) {
    let i;
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.confirmScreenDetails = ko.observable();
    params.baseModel.registerComponent("attach-documents", "trade-finance");
    self.mode = ko.observable();
    self.productNameFetched = ko.observable(false);
    self.applicantNameFetched = ko.observable(false);
    self.datasourceForDocReview = ko.observable();
    self.clauseTableArrayForReview = [];
    self.documentsLoaded = ko.observable(false);
    self.datasourceInstructionsReview = ko.observable();
    self.instructionsLoaded = ko.observable(false);
    self.clauseModalHeading = ko.observable();
    self.selectedClauses = ko.observable();
    self.beneName = ko.observable();
    self.datasourceForGoodsReview = ko.observable([]);
    self.goodsLists = ko.observableArray();
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.confirmCollection;
    self.confirmScreenExtensions = self.params.confirmScreenExtensions;
    self.draweeCountryoptions = self.params.draweeCountryoptions;
    self.lcLookupFlag = self.params.lcLookupFlag ? self.params.lcLookupFlag : ko.observable("false");
    self.multiGoodsSupported = ko.observable(true);

    self.beneAddress = {
      line1: ko.observable(),
      line2: ko.observable(),
      line3: ko.observable(),
      country: ko.observable()
    };

    self.stages = [{
      stageName: self.resourceBundle.heading.parties,
      templateName: "trade-finance/view-collections/collection-details",
      visible: ko.observable("true")
    },
    {
      stageName: self.resourceBundle.heading.shipmentDetails,
      templateName: "trade-finance/view-collections/bill-details",
      visible: ko.observable("true")
    },
    {
      stageName: self.resourceBundle.heading.documents,
      templateName: "trade-finance/view-collections/collection-documents",
      visible: ko.observable("false")
    },
    {
      stageName: self.resourceBundle.heading.instructions,
      templateName: "trade-finance/view-collections/collection-instructions-details",
      visible: ko.observable("true")
    },
    {
      stageName: self.resourceBundle.heading.attachments,
      templateName: "attach-documents",
      visible: ko.observable("true")
    }
    ];

    self.viewClauses = function (selectedDoc) {
      let clauses = selectedDoc.clause;

      if (clauses === undefined) {
        clauses = [];
      }

      self.selectedClauses({
        docId: selectedDoc.id,
        docName: params.baseModel.format(self.nls.labels.documentName, {
          docName: selectedDoc.docName
        }),
        datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clauses))
      });

      self.clauseModalHeading(params.baseModel.format(self.nls.labels.documentName, {
        docName: selectedDoc.name
      }));

      $("#documentClauses").trigger("openModal");
    };

    self.mode(self.params.mode);

    self.fillconfirmScreenExtension = function () {
      const confirmScreenDetailsArray = [
        [{
          label: self.resourceBundle.labels.drawerName,
          value: self.applicantName()
        },
        {
          label: self.resourceBundle.labels.draweeName,
          value: self.beneName()
        }
        ],
        [{
          label: self.resourceBundle.lcDetails.labels.product,
          value: self.dropdownLabels.product()
        },
        {
          label: self.resourceBundle.labels.paymentType,
          value: self.filterValues.paymentType()
        }
        ],
        [{
          label: self.resourceBundle.shipmentDetails.labels.maturityDate,
          value: self.collectionDetails.maturityDate
        },
        {
          label: self.resourceBundle.common.labels.amount,
          value: params.baseModel.formatCurrency(self.collectionDetails.amount.amount, self.collectionDetails.amount.currency)
        }
        ]
      ];

      if (self.collectionDetails.lcRefNo !== null && self.collectionDetails.lcRefNo !== "") {
        confirmScreenDetailsArray.push([{
          label: self.resourceBundle.labels.lcNumber,
          value: self.collectionDetails.lcRefNo
        }]);
      }

      if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); }
      else if (self.confirmScreenExtensions) {
        $.extend(self.confirmScreenExtensions, {
          isSet: true,
          taskCode: "TF_N_CLC",
          confirmScreenDetails: confirmScreenDetailsArray,
          template: "confirm-screen/trade-finance"
        });
      }
    };

    self.getDetails = function () {
      if (typeof self.params.collectionDetails !== "undefined") {
        params.dashboard.headerName(self.resourceBundle.heading.collectionInitiation);
        self.collectionDetails = self.params.collectionDetails;
        self.stages[2].visible(self.params.docAttached);

        if (self.collectionDetails.counterPartyAddress) {
          self.beneName(self.collectionDetails.counterPartyName);
          self.beneAddress.line1(self.collectionDetails.counterPartyAddress.line1);
          self.beneAddress.line2(self.collectionDetails.counterPartyAddress.line2);
          self.beneAddress.line3(self.collectionDetails.counterPartyAddress.line3);
        }

        if (self.multiGoodsSupported() && self.collectionDetails.goods && self.collectionDetails.goods.length > 0) {
          self.goodsLists.removeAll();

          for (i = 0; i < self.collectionDetails.goods.length; i++) {
            self.goodsLists.push({
              code: self.collectionDetails.goods[i].code,
              description: self.collectionDetails.goods[i].description,
              noOfUnits: self.collectionDetails.goods[i].noOfUnits ? self.collectionDetails.goods[i].noOfUnits : "",
              pricePerUnit: self.collectionDetails.goods[i].pricePerUnit ? self.collectionDetails.goods[i].pricePerUnit : ""
            });
          }

          self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists());
        } else {
          self.datasourceForGoodsReview = new oj.ArrayTableDataSource([]);
        }
      } else {
        self.collectionDetails = ko.mapping.toJS(self.params.data);
      }

      self.reviewFlag = ko.observable(true);
      self.attachedDocuments = ko.observable(self.collectionDetails.attachedDocuments);
      self.additionalBankDetails = ko.observable();
      self.applicantName = ko.observable();

      self.applicantAddress = {
        line1: ko.observable(),
        line2: ko.observable(),
        line3: ko.observable(),
        country: ko.observable()
      };

      self.dropdownLabels = {
        branch: ko.observable(),
        country: ko.observable(),
        product: ko.observable(),
        incoterm: ko.observable(),
        baseDateDescription: ko.observable()
      };

      self.filterValues = {
        paymentType: ko.observable(),
        docAttached: ko.observable(),
        lcLinked: ko.observable(),
        lcNumber: ko.observable()
      };

      if (self.collectionDetails.goods && self.collectionDetails.goods.length > 0) {
        self.goodsLists.removeAll();

        for (i = 0; i < self.collectionDetails.goods.length; i++) {
          self.goodsLists.push({
            code: self.collectionDetails.goods[i].code,
            description: self.collectionDetails.goods[i].description,
            noOfUnits: self.collectionDetails.goods[i].noOfUnits ? self.collectionDetails.goods[i].noOfUnits : "",
            pricePerUnit: self.collectionDetails.goods[i].pricePerUnit ? self.collectionDetails.goods[i].pricePerUnit : ""
          });
        }

        self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists());
      } else {
        self.datasourceForGoodsReview = new oj.ArrayTableDataSource([]);
      }

        const qQuery = { criteria: [] };

if(self.collectionDetails.incoterm){
        qQuery.criteria.push({
                        operand: "code",
                        operator: "EQUALS",
                        value: [self.collectionDetails.incoterm]
                    });

      ReviewCollectionModel.fetchIncoterm(JSON.stringify(qQuery)).done(function (data) {
        self.dropdownLabels.incoterm(data.incotermList[0].description);
      });
    }

      ReviewCollectionModel.fetchDraweeCountry().done(function (data) {
        const draweeCountry = data.enumRepresentations[0].data.filter(function (data) {
          return data.code === self.collectionDetails.counterPartyAddress.country;
        });

        self.dropdownLabels.country(draweeCountry[0].description);
      });

      if (self.collectionDetails.baseDateCode !== undefined && self.collectionDetails.baseDateCode !== null) {
        ReviewCollectionModel.getBaseDateDescrption().done(function (data) {
          const baseDateDescription = data.baseDateList.filter(function (data) {
            return data.code === self.collectionDetails.baseDateCode;
          });

          self.dropdownLabels.baseDateDescription(baseDateDescription[0].description);
        });
      }

      ReviewCollectionModel.fetchBranch().done(function (data) {
        const beneBranch = data.branchAddressDTO.filter(function (data) {
          return data.id === self.collectionDetails.branchId;
        });

        self.dropdownLabels.branch(beneBranch[0].branchName);
      });

      if (self.collectionDetails.swiftId && self.collectionDetails.swiftId !== null) {
        ReviewCollectionModel.getBankDetailsBIC(self.collectionDetails.swiftId).done(function (data) {
          self.additionalBankDetails(data);
        });
      }

      Promise.all([ReviewCollectionModel.fetchPartyDetails(self.collectionDetails.partyId.value),
      ReviewCollectionModel.fetchProductDetails(self.collectionDetails.productId)
      ])
        .then(function (data) {
          const fetchPartyResponse = data[0],
            fetchProductResponse = data[1];

          self.applicantName(fetchPartyResponse.party.personalDetails.fullName);
          self.applicantNameFetched(true);

          for (i = 0; i < fetchPartyResponse.party.addresses.length; i++) {
            if (fetchPartyResponse.party.addresses[i].type === "PST") {
              self.applicantAddress.line1(fetchPartyResponse.party.addresses[i].postalAddress.line1);
              self.applicantAddress.line2(fetchPartyResponse.party.addresses[i].postalAddress.line2);
              self.applicantAddress.line3(fetchPartyResponse.party.addresses[i].postalAddress.line3);

              const countryLabel = self.draweeCountryoptions().filter(function (countryData) {
                return countryData.value === fetchPartyResponse.party.addresses[i].postalAddress.country;
              });

              self.applicantAddress.country(countryLabel[0].label);
            }
          }

          if (fetchProductResponse.billProductDTO) {
            self.dropdownLabels.product(fetchProductResponse.billProductDTO.name);
            self.filterValues.paymentType(fetchProductResponse.billProductDTO.tenorCode);
            self.filterValues.docAttached(fetchProductResponse.billProductDTO.docAttached.toString());
            self.filterValues.lcLinked(fetchProductResponse.billProductDTO.lcLinkage.toString());

            if (self.filterValues.docAttached() === "true") {
              self.stages[2].visible("true");
            }

            self.productNameFetched(true);
          }

          self.fillconfirmScreenExtension();
        });

      if (self.collectionDetails.counterPartyAddress) {
        self.beneName(self.collectionDetails.counterPartyName);
        self.beneAddress.line1(self.collectionDetails.counterPartyAddress.line1);
        self.beneAddress.line2(self.collectionDetails.counterPartyAddress.line2);
        self.beneAddress.line3(self.collectionDetails.counterPartyAddress.line3);
      }
    };

    self.getDetails();

    if (self.collectionDetails.instructions && self.collectionDetails.instructions.length > 0) {
      self.datasourceInstructionsReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.instructions));
      self.instructionsLoaded(true);
    }

    if (self.collectionDetails.document && self.collectionDetails.document.length > 0) {
      self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.document, {
        idAttribute: "id"
      }));

      for (i = 0; i < self.collectionDetails.document.length; i++) {
        if (self.collectionDetails.document[i].clause && self.collectionDetails.document[i].clause.length > 0) {
          self.clauseTableArrayForReview.push({
            docName: params.baseModel.format(self.nls.labels.documentName, {
              docName: self.collectionDetails.document[i].name
            }),
            datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.collectionDetails.document[i].clause))
          });
        }
      }

      self.documentsLoaded(true);
    }

    self.getRowId = function (rowIndex) {
      return ++rowIndex;
    };

    self.editAll = function () {
      const parameters = {
        mode: "EDIT",
        collectionDetails: ko.mapping.toJS(self.collectionDetails),
        filterDetails: self.filterValues,
        lcLookupFlag: self.lcLookupFlag
      };

      params.dashboard.loadComponent("initiate-collection", parameters);
    };

    self.confirm = function () {
      let hostReferenceNumber = null;

      ReviewCollectionModel.initiateCollection(ko.mapping.toJSON(self.params.collectionDetails)).done(function (data, status, jqXhr) {
        if (data.bill) { hostReferenceNumber = data.bill.id; }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          hostReferenceNumber: hostReferenceNumber,
          transactionName: self.resourceBundle.heading.collectionInitiation,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_N_CLC",
            confirmScreenDetails: self.confirmScreenDetails(),
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };
  };
});
