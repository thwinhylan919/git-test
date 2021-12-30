define([
  "ojs/ojcore",
  "jquery",
  "ojL10n!resources/nls/upi-pending-request",
  "knockout",
  "./model",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojavatar",
  "ojs/ojbutton",
  "ojs/ojcollapsible",
  "ojs/ojaccordion",
  "ojs/ojlabel"
], function(oj, $, resourceBundle, ko, Model) {
  "use strict";

  return function(params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.componentHeader);
    self.paymentstransfersupiFundRequestgetVar = ko.observableArray();
    self.paymentstransfersupiFundRequestgetvpaId = ko.observable();
    self.paymentstransfersupiFundRequestgetpendingFundRequestType = ko.observable();
    self.virtualPaymentAddressesgetVar = ko.observable();
    self.paymentstransfersupiFundRequestreferenceNoapprovepostreferenceNo = ko.observable();
    self.paymentstransfersupiFundRequestreferenceNorejectpostreferenceNo = ko.observable();
    params.baseModel.registerElement("nav-bar");
    params.baseModel.registerElement("modal-window");

    const getNewKoModel = function() {
        const KoModel = Model.getNewModel();

        return ko.mapping.fromJS(KoModel);
      },
      batchRequest = {
        batchDetailRequestList: []
      };

    self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();
    self.tabSelected = ko.observable("ME");
    self.dataloaded = ko.observable(false);
    self.listLoaded = ko.observable(false);
    self.vpaIdArray = ko.observableArray();
    self.sample = ko.observableArray();
    self.accountNumber = ko.observable();
    self.menuCountOptions = ko.observableArray();
    self.selectedItems = ko.observableArray([]);
    self.showDeleteMsg = ko.observable(false);
    self.vpaArrayMap = {};
    self.payerCount = ko.observable();
    self.meCount = ko.observable();
    self.navBarLoad = ko.observable(false);

    self.payeeMap = ko.observable({});
    self.contentIdMap = ko.observable({});
    self.defaultImagePath = "upi/user-segment.svg";

    let currentDate = null;

    params.baseModel.registerComponent("review-upi-pending-request", "upi");

    self.loadBatchImages = function() {
      Model.fireBatch(batchRequest).then(function(batchData) {
        for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
          const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

          self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value].content("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
        }

        Object.keys(self.contentIdMap()).forEach(function(key) {
          self.payeeMap()[self.contentIdMap()[key].vpaId].preview(self.contentIdMap()[key].content());
        });
      });
    };

    self.loadBatchRequest = function(id) {
      batchRequest.batchDetailRequestList.push({
        methodType: "GET",
        uri: {
          value: "/contents/{id}",
          params: {
            id: id
          }
        },
        headers: {
          "Content-Id": batchRequest.batchDetailRequestList.length + 1,
          "Content-Type": "application/json"
        }
      });
    };

    self.onClickApprove78 = function(_event, data) {
      Model.paymentstransfersupiFundRequestreferenceNoapprovepost(data.transferId).then(function() {
        data.account = self.vpaArrayMap[data.debitVPAId].account;

        params.dashboard.loadComponent("review-upi-pending-request", ko.mapping.toJS({
          data: data,
          paymentstransfersupiFundRequestgetvpaId: self.paymentstransfersupiFundRequestgetvpaId()
        }));
      });
    };

    self.onClickReject68 = function(_event, data) {
      $("#reject-request").trigger("openModal");
      self.paymentstransfersupiFundRequestreferenceNorejectpostreferenceNo(data.transferId);
    };

    self.onClickYes27 = function() {
      Model.paymentstransfersupiFundRequestreferenceNorejectpost(self.paymentstransfersupiFundRequestreferenceNorejectpostreferenceNo()).then(function() {
        $("#reject-request").trigger("closeModal");
        self.fetchList(true);
        self.showDeleteMsg(true);

        setTimeout(function() {
          $("#deleteBox").fadeOut("slow");
          self.showDeleteMsg(false);
        }, 2600);
      });
    };

    self.onClickNo36 = function() {
      $("#reject-request").trigger("closeModal");
    };

    self.setMenuOptions = function() {
      self.menuCountOptions.removeAll();

      const tabs = ko.observableArray([{
          label: self.nls.me,
          count:self.meCount(),
          id: "ME"
        },
        {
          label: self.nls.payer,
          id: "PAYER",
          count:self.payerCount()
        }
      ]);

      for (let j = 0; j < tabs().length; j++) {
        self.menuCountOptions.push({
          label: tabs()[j].label,
          id: tabs()[j].id,
          count:tabs()[j].count
        });
      }
    };

    Model.getHostDate().then(function(response) {
      currentDate = new Date(response.currentDate.valueDate).setHours(0, 0, 0, 0);
    });

    self.fetchList = function(setCount) {
      self.listLoaded(false);
      ko.tasks.runEarly();

      if (self.paymentstransfersupiFundRequestgetvpaId() === "all") {
        self.paymentstransfersupiFundRequestgetvpaId(null);
      }

      Promise.all([Model.paymentstransfersupiFundRequestget(self.paymentstransfersupiFundRequestgetvpaId(), self.tabSelected()), Model.fetchPayeeList(), Model.mepartyget()]).then(function(response) {
        const data = response[0].response,
          userFirstName = response[2].party.personalDetails.firstName,
          userLastName = response[2].party.personalDetails.lastName;

        let contributorsPart = 0,
         isPending = false;

        self.paymentstransfersupiFundRequestgetVar.removeAll();

        if (Object.keys(self.payeeMap()).length !== 0) {
          self.payeeMap({});
          self.contentIdMap({});
          batchRequest.batchDetailRequestList = [];
        }

        for (let i = 0; i < data.length; i++) {
          contributorsPart = 0;

          if (data[i].payerDetails) {
            for (let j = 0; j < data[i].payerDetails.length; j++) {
              self.payeeMap()[data[i].payerDetails[j].debitVPAId] = {
                initials: data[i].payerDetails[j].payerName ?
                  oj.IntlConverterUtils.getInitials(data[i].payerDetails[j].payerName.split(/\s+/)[0], data[i].payerDetails[j].payerName.split(/\s+/)[1]) : oj.IntlConverterUtils.getInitials(data[i].payerDetails[j].debitVPAId.split(/\s+/)[0], data[i].payerDetails[j].debitVPAId.split(/\s+/)[1]),
                preview: ko.observable()
              };

              contributorsPart = contributorsPart + data[i].payerDetails[j].amount.amount;
              isPending = data[i].payerDetails[j].status ? data[i].payerDetails[j].status === "Pending" ? true : isPending : false;
            }
          } else {
            self.payeeMap()[data[i].creditVPAId] = {
              initials: oj.IntlConverterUtils.getInitials(data[i].receiverName.split(/\s+/)[0], data[i].receiverName.split(/\s+/)[1]),
              preview: ko.observable()
            };
          }

          if (data[i].payerDetails && data[i].requestType === "Split Bill") {
            data[i].payerDetails.unshift({
              amount: {
                amount: data[i].amount.amount - contributorsPart,
                currency: data[i].amount.currency
              },
              userFirstName: userFirstName,
              userLastName: userLastName,
              userInitials: oj.IntlConverterUtils.getInitials(userFirstName.split(/\s+/)[0], userLastName.split(/\s+/)[0]),
              debitVPAId: null,
              payerName: null
            });
          }

          if (!(new Date(data[i].expiryDate) < currentDate)) {
            if (self.tabSelected() === "PAYER" && data[i].requestType === "Split Bill") {
              if (isPending)
                {self.paymentstransfersupiFundRequestgetVar().push(data[i]);}
            } else {
              self.paymentstransfersupiFundRequestgetVar().push(data[i]);
            }
          }

        }

        if (setCount) {

          self.navBarLoad(false);
          ko.tasks.runEarly();

          if (self.tabSelected() === "ME") {
            self.meCount(data.length);
          } else {
            self.payerCount(data.length);
          }

          self.setMenuOptions();
          self.navBarLoad(true);
        }

        const payeeList = response[1].payeeGroups;

        for (let i = 0; i < payeeList.length; i++) {
          for (let m = 0; m < payeeList[i].listPayees.length; m++) {
            if (self.payeeMap()[payeeList[i].listPayees[m].vpaId]) {
              if (payeeList[i].listPayees[m].contentId || payeeList[i].contentId) {
                self.contentIdMap()[payeeList[i].listPayees[m].contentId ? payeeList[i].listPayees[m].contentId.value : payeeList[i].contentId.value] = {
                  content: ko.observable(),
                  vpaId: payeeList[i].listPayees[m].vpaId
                };

                self.loadBatchRequest(payeeList[i].listPayees[m].contentId ? payeeList[i].listPayees[m].contentId.value : payeeList[i].contentId.value);
              }
            }
          }
        }

        if (batchRequest.batchDetailRequestList.length) {
          self.loadBatchImages();
        }

        self.listLoaded(true);
      });
    };

    self.tabSelected.subscribe(function() {
      self.fetchList(false);
    });

    Model.virtualPaymentAddressesget().then(function(response) {
      if (response.virtualPaymentAddressDTOs.length) {
        self.vpaIdArray().push({
          id: "all",
          value: self.nls.all
        });

        for (let i = 0; i < response.virtualPaymentAddressDTOs.length; i++) {
          response.virtualPaymentAddressDTOs[i].value = response.virtualPaymentAddressDTOs[i].id;
          self.vpaIdArray().push(response.virtualPaymentAddressDTOs[i]);

          self.vpaArrayMap[response.virtualPaymentAddressDTOs[i].id] = {
            account: response.virtualPaymentAddressDTOs[i].accountId
          };
        }

        if (params.rootModel.previousState) {
          self.paymentstransfersupiFundRequestgetvpaId(params.rootModel.previousState.paymentstransfersupiFundRequestgetvpaId);

          if (self.paymentstransfersupiFundRequestgetvpaId()) {
            self.accountNumber(self.vpaArrayMap[self.paymentstransfersupiFundRequestgetvpaId()].account.displayValue);
          }

          self.listLoaded(false);
          ko.tasks.runEarly();
          self.fetchList(true);
        }
      } else {
        params.baseModel.showMessages(null, [self.nls.errorMessageNoVpaId], "ERROR");
      }

      self.dataloaded(true);
    });

    self.approve = function(data) {
      data.account = self.vpaArrayMap[data.debitVPAId].account;

      params.dashboard.loadComponent("review-upi-pending-request", ko.mapping.toJS({
        data: data
      }), self);
    };

    self.rejectRequest = function(data) {
      data.account = self.vpaArrayMap[data.debitVPAId].account;
    };

    self.vpaChangeHandler = function(newValue) {
      if (newValue.detail.value === "all") {
        self.accountNumber(null);
        self.paymentstransfersupiFundRequestgetvpaId(null);
      } else {
        self.accountNumber(self.vpaArrayMap[newValue.detail.value].account.displayValue);
        self.paymentstransfersupiFundRequestgetvpaId(newValue.detail.value);
      }

      Model.paymentstransfersupiFundRequestget(self.paymentstransfersupiFundRequestgetvpaId(), self.tabSelected() === "ME" ? "PAYER" : "ME").then(function(response) {
        self.payerCount(response.response.length);
        self.fetchList(true);
      });

    };

    self.uiOptions = {
      iconAvailable: false,
      defaultOption: self.tabSelected,
      menuFloat: "left",
      fullWidth: true,
      edge: "top"
    };

  };
});
