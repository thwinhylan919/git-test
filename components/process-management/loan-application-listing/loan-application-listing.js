define([
  "knockout",
  "jquery",
  "./model",
  "text!./loan-application-listing.json",
  "ojL10n!resources/nls/loan-application-listing",
  "framework/js/constants/constants",
  "ojs/ojcore",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraydataprovider",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojknockout",
  "ojs/ojfilmstrip",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojavatar",
  "ojs/ojarraypagingdatasource"
], function(ko, $, ApplicationListingModel, ProcessStatusMap, resourceBundle, constantJs, oj) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.mySelection = ko.observable();
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerElement("search-box");
    self.selectedDuration = ko.observable("");
    self.selectedRequestType = ko.observable("All");
    self.originalList = ko.observableArray([]);
    self.filteredApplicationList = ko.observableArray([]);
    self.filteredApplicationListLoaded = ko.observable(false);
    self.responseLoaded = ko.observable(false);
    self.applicantNameArray = ko.observableArray([]);
    self.menuSelection = ko.observable("DRAFT");
    self.partyID = ko.observable();
    self.selectedCustomerId = ko.observable();
    self.processStatusMap = JSON.parse(ProcessStatusMap).processStatusMap;
    self.dataSegmentMap = JSON.parse(ProcessStatusMap).dataSegmentMap;
    self.products = JSON.parse(ProcessStatusMap).products;
    self.nls = resourceBundle;
    self.constantJs = constantJs;
    rootParams.dashboard.headerName(self.nls.header);
    self.myHorizontal = ko.observable();
    self.myVertical = ko.observable();
    self.atHorizontal = ko.observable();
    self.atVertical = ko.observable();
    self.entityValueList = rootParams.dashboard.userData.userProfile.accessibleEntityDTOs;
    self.pagingDataSource = ko.observableArray([]);
    self.selectedParty = ko.observable();
    self.dataSegments = ko.observableArray([]);
    self.dataSegmentDocumentList = ko.observableArray([]);
    self.partyLabel = ko.observable();
    self.searchRefresh = ko.observable(true);
    self.showHeaderStrip = ko.observable(false);
    self.cardSelected = ko.observable(false);

    const todayDate = rootParams.baseModel.getDate();

    self.onFilterIconClick = function() {
      const popup = document.querySelector("#filter-popup");

      if (popup.isOpen()) {
        popup.close();
      } else {
        if (rootParams.baseModel.large()) {
          self.atHorizontal("end");
          self.atVertical("bottom");
          self.myHorizontal("end");
          self.myVertical("top");
        } else {
          self.myHorizontal("left");
          self.myVertical("top");
          self.atHorizontal("right");
          self.atVertical("bottom");
        }

        popup.open("#enable-filter");

      }
    };

    self.onReset = function() {
      self.selectedRequestType("All");
      self.selectedDuration("");

      const popup = document.querySelector("#filter-popup");

      if (popup.isOpen()) {
        popup.close();
      }
    };

    self.documentsRequired = "fsgbu-ob-clmo-ds-document-upload";

    self.onCardSelection = function(cardItem) {

      if (!self.cardSelected()) {
        self.cardSelected(true);

        if (cardItem.type === "Loan Drawdown") {
          ApplicationListingModel.fetchAppData(cardItem.refId).then(function(cardData) {
            if (cardItem.status === "DRAFT") {
              rootParams.dashboard.loadComponent("flow", {
                flowName: "loan-drawdown",
                flowStageRootModel: {
                  refId : cardData.processManagementDTO.refId,
                  payload: cardData.processManagementDTO.payload.json
                },
                flowStartIndex: 0
              });
            } else {
              ApplicationListingModel.fetchAppData(cardItem.refId).then(function(cardData) {
                cardItem.amount = cardData.processManagementDTO.payload.json.loanRequirements.loanAmount.amount;
                cardItem.currency = cardData.processManagementDTO.payload.json.loanRequirements.loanAmount.currency;

                if (cardData && cardData.processManagementDTO.payload) {
                  const partyName = self.applicantNameArray().find(function(element) {

                      if (element.value === cardData.processManagementDTO.partyId.value) {
                        return self.partyLabel(element);
                      }

                      return self.partyLabel();
                    }),
                    parameters = {
                      productId: "loan",
                      dataSegments: self.dataSegments(),
                      payload: ko.mapping.fromJS(cardData.processManagementDTO.payload.json),
                      data: {
                        productId: cardData.processManagementDTO.payload.json.applicationDetails.productCode,
                        productName: cardData.processManagementDTO.type,
                        module: "OBCLPM",
                        confirmPage: self.nls.confirmPage,
                        trackerFlag: true,
                        cardItem: cardItem,
                        selectedParty: ko.observable(partyName.label),
                        partyId: cardData.processManagementDTO.partyId,
                        refId: cardItem.refId,
                        dataSegmentDocumentList: self.dataSegmentDocumentList()
                      }
                    };

                  rootParams.baseModel.registerComponent("loan-application-listing-details", "process-management");
                  rootParams.dashboard.loadComponent("loan-application-listing-details", parameters);

                }

                self.cardSelected(false);

              }).catch(function() {
                self.cardSelected(false);
              });
            }
          });
        } else {
          ApplicationListingModel.fetchDatasegment(self.products[cardItem.type]).then(function(data) {
            self.dataSegments([]);
            self.dataSegmentDocumentList(data.jsonNode.Stages[0].documentsList);

            data.jsonNode.Stages[0].DataSegments.forEach(function(segment) {
              self.dataSegments.push(segment.code);
            });

            if (data.jsonNode.Stages[0].documentsList !== undefined && data.jsonNode.Stages[0].documentsList.length > 0) {
              self.dataSegments.push(self.documentsRequired);
            }

            ApplicationListingModel.fetchAppData(cardItem.refId).then(function(cardData) {
              if (cardData && cardData.processManagementDTO.payload) {
                const partyName = self.applicantNameArray().find(function(element) {

                    if (element.value === cardData.processManagementDTO.partyId.value) {
                      return self.partyLabel(element);
                    }

                    return self.partyLabel();
                  }),
                  parameters = {
                    productId: "loan",
                    dataSegments: self.dataSegments(),
                    payload: ko.mapping.fromJS(cardData.processManagementDTO.payload.json),
                    data: {
                      productId: self.products[cardData.processManagementDTO.type],
                      productName: cardData.processManagementDTO.type,
                      module: "OBCLPM",
                      confirmPage: self.nls.confirmPage,
                      trackerFlag: true,
                      cardItem: cardItem,
                      selectedParty: ko.observable(partyName.label),
                      refId: cardItem.refId,
                      dataSegmentDocumentList: self.dataSegmentDocumentList()
                    }
                  };

                if (cardItem.status === "DRAFT") {
                  rootParams.baseModel.registerElement("segment-container");
                  rootParams.dashboard.loadComponent("segment-container", parameters);
                } else {
                  rootParams.baseModel.registerComponent("loan-application-listing-details", "process-management");
                  rootParams.dashboard.loadComponent("loan-application-listing-details", parameters);
                }

              }

              self.cardSelected(false);

            }).catch(function() {
              self.cardSelected(false);
            });

          }).catch(function() {
            self.cardSelected(false);
          });
        }

      }

    };

    self.onClickBack = function() {
      rootParams.baseModel.registerComponent("application-tracker-film-strip", "process-management");
      rootParams.dashboard.loadComponent("application-tracker-film-strip", {});
    };

    self.menuOptions = ko.observable([{
        id: "DRAFT",
        label: "Draft"
      }, {
        id: "SUBMITTED",
        label: "Submitted"
      }, {
        id: "IN_PROGRESS",
        label: "In Progress"
      }, {
        id: "COMPLETED",
        label: "Completed"
      }

    ]);

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.durationArray = ko.observableArray([{
        key: self.nls.duration.sevenDays,
        value: 7
      },
      {
        key: self.nls.duration.fifteenDays,
        value: 15
      },
      {
        key: self.nls.duration.oneMonth,
        value: 30
      },
      {
        key: self.nls.duration.threeMonths,
        value: 90
      },
      {
        key: self.nls.duration.sixMonths,
        value: 180
      },
      {
        key: self.nls.duration.oneYear,
        value: 365
      }
    ]);

    if (self.applicantNameArray().length === 0) {

      self.entityValueList.forEach(function(element) {
        if (element.entityId === constantJs.currentEntity) {
          self.applicantNameArray.push({
            label: element.partyName,
            value: element.userPartyRelationship.partyId.value
          });

          self.partyID(element.userPartyRelationship.partyId.value);
        }
      });

      ApplicationListingModel.mePartyGetRelations().then(function(partyData) {

        for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
          self.applicantNameArray.push({
            label: partyData.partyToPartyRelationship[i].relatedPartyName,
            value: partyData.partyToPartyRelationship[i].relatedParty.value
          });
        }

        self.responseLoaded(true);
      }).catch(function() {
        self.responseLoaded(true);
      });
    }

    self.hideDeleteTemplate = function() {
      $("#deleteTemplate").hide();
    };

    self.referenceId = ko.observable();

    self.confirmDelete = function(data) {
      self.referenceId(data.refId);
      $("#deleteTemplate").trigger("openModal");
    };

    function deleteDraftElement(Item) {
      if (Item.refId !== self.referenceId()) {
        return true;
      }

      return false;
    }

    self.deleteDraft = function() {
      $("#deleteTemplate").hide();

      ApplicationListingModel.deleteDraft(self.referenceId()).then(function(data) {
        if (data.status.result === "SUCCESSFUL") {
          self.filteredApplicationList(self.originalList().filter(deleteDraftElement));
          self.originalList(self.filteredApplicationList());

          self.pagingDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredApplicationList, {
            idAttribute: "refId"
          })));

          self.showHeaderStrip(true);
        }

      });

    };

    self.fetchListDetails = function() {
      ApplicationListingModel.fetchApplicationDetails(self.processStatusMap[self.menuSelection()], self.partyID()).then(function(listData) {
        self.originalList([]);

        for (let i = 0; i < listData.processManagementDTOs.length; i++) {
          self.originalList().push({
            type: listData.processManagementDTOs[i].type,
            refId: listData.processManagementDTOs[i].refId,
            status: listData.processManagementDTOs[i].status,
            appDate: listData.processManagementDTOs[i].creationDate,
            draftName: listData.processManagementDTOs[i].draftName,
            midOfficeRefNo: listData.processManagementDTOs[i].midOfficeRefNo ? listData.processManagementDTOs[i].midOfficeRefNo : null,
            currency: listData.processManagementDTOs[i].amount !== undefined ? listData.processManagementDTOs[i].amount.currency : "",
            amount: listData.processManagementDTOs[i].amount !== undefined ? listData.processManagementDTOs[i].amount.amount : "",
            remarks: listData.processManagementDTOs[i].midOfficeRefNo !== undefined ? listData.processManagementDTOs[i].midOfficeRefNo : ""

          });
        }

        self.filteredApplicationList(self.originalList());

        self.pagingDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredApplicationList, {
          idAttribute: "refId"
        })));

        self.filteredApplicationListLoaded(true);

      }).catch(function() {
        self.originalList([]);
        self.filteredApplicationList(self.originalList());

        self.pagingDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredApplicationList, {
          idAttribute: "refId"
        })));

        self.filteredApplicationListLoaded(true);
      });

    };

    self.requestTypeArray = ko.observableArray([{
        key: "All",
        value: self.nls.requestType.all
      }, {
        key: "Term Loan",
        value: self.nls.requestType.TermLoan
      }, {
        key: "Working Loan",
        value: self.nls.requestType.WorkingCapitalLoan
      }, {
        key: "Equipment Loan",
        value: self.nls.requestType.EquipmentFinancingLoan
      },
      {
        key: "Real Estate Loan",
        value: self.nls.requestType.RealEstateLoan
      }
    ]);

    function checkRequestType(listItem) {
      if (self.selectedRequestType() === "All") {
        return true;
      }

      if (self.selectedRequestType() === listItem.type) {
        return true;
      }

      return false;
    }

    function checkDuration(listItem) {
      if (self.selectedDuration() === "") {
        return true;
      }

      const newDate = new Date(todayDate);

      newDate.setDate(newDate.getDate() - self.selectedDuration());

      return new Date(listItem.appDate) >= newDate;

    }

    self.requestTypeChangedHandler = function(event) {
      self.filteredApplicationList([]);
      self.filteredApplicationListLoaded(false);
      self.filteredApplicationList(self.originalList().filter(checkRequestType).filter(checkDuration));

      self.pagingDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredApplicationList, {
        idAttribute: "refId"
      })));

      self.filteredApplicationListLoaded(true);
    };

    self.menuSelection.subscribe(function() {
      self.onReset();
      self.filteredApplicationList([]);
      self.filteredApplicationListLoaded(false);
      self.fetchListDetails();
    });

    self.partyChangedHandler = function(event) {
      self.filteredApplicationList([]);
      self.filteredApplicationListLoaded(false);
      self.partyID(event.detail.value);
      self.fetchListDetails();
    };

    self.onCloseCancelStrip = function() {
      self.showHeaderStrip(false);
    };
  };

});
