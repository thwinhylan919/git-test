define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-entity-remittance",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojpopup",
  "ojs/ojarraytabledatasource",
  "ojs/ojdatacollection-utils",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker",
  "ojs/ojtimezonedata",
  "ojs/ojvalidationgroup"
], function (oj, ko, EntityModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.pageHeader);
    params.baseModel.registerTransaction("virtual-identifiers-create","virtual-account-management");
    self.remittanceListLoaded = ko.observable(false);
    self.remittanceList = ko.observableArray();
    self.remittanceObj = ko.observable();
    self.view = ko.observable("create");
    self.remListName = ko.observable();
    self.groupValid = ko.observable();
    self.uniqueId = 0;
    self.loadTable = ko.observable(true);
    self.payloadLength = ko.observable(1);
    self.minDate = ko.observableArray();
    self.taskCode = "VAMI_M_UVI";

    const getNewModel = function () {
      const KoModel = EntityModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = getNewModel();

    EntityModel.maintenance().then(function (data) {
      if (data && data.configurationDetails) {
        for (let i = 0; i < data.configurationDetails.length; i++) {
          if (data.configurationDetails[i].propertyId === "REMITTER_CREATION_LIMIT") {
            self.creatRow = data.configurationDetails[i].propertyValue - 2;
            self.limitRow = data.configurationDetails[i].propertyValue;
            break;
          }
        }
      }
    });

    EntityModel.fetchRemittanceList(params.dashboard.userData.userProfile.partyId.value, "0", "0", self.taskCode).then(function (data) {
      if (data && data.jsonNode && data.jsonNode.data.length > 0) {
        self.remittanceList(data.jsonNode.data);
        self.remittanceListLoaded(true);
      }
    });

    if(params.rootModel.previousState){
      self.dataArray = [];
      self.payloadLength(params.rootModel.previousState.payloadLength);
      self.remittanceObj(params.rootModel.previousState.remittanceList.remitterListId());

      const temp = JSON.parse(params.rootModel.previousState.payload);

      temp.forEach(function(item){
        self.uniqueId = self.uniqueId + 1;

        self.dataArray.push({
          id: self.uniqueId,
          remId: item.remitterId,
          fromDate: item.validityStartDate,
          toDate: item.validityEndDate,
          reconcilationInformation: item.reconInfo,
          additionalInfo: item.additionalInfo
        });
      });

    } else {
      self.uniqueId = self.uniqueId + 1;

      self.dataArray = [{
        id: self.uniqueId,
        remId: null,
        fromDate: null,
        toDate: null,
        reconcilationInformation: null,
        additionalInfo: null
      }];
    }

    self.deptObservableArray = ko.observableArray(self.dataArray);

    self.dataSource = new oj.ArrayDataProvider(self.deptObservableArray, {
      idAttribute: "remId"
    });

    self.addRow = function () {
      if (self.payloadLength() < self.limitRow) {
        self.creatRow = self.creatRow - 1;
        self.uniqueId = self.uniqueId + 1;

        const rowObj = {
          id: self.uniqueId,
          remId: null,
          fromDate: null,
          toDate: null,
          reconcilationInformation: null,
          additionalInfo: null
        };

        self.deptObservableArray.push(rowObj);
        self.payloadLength(self.payloadLength() + 1);
      } else {
        params.baseModel.showMessages(null, [params.baseModel.format(self.resource.errorMsg, {
          value: self.limitRow
        })], "error");
      }
    };

    self.fromDateChanged = function (data) {
      let date2 = new Date(data.fromDate);
      const index = data.id - 1;

      date2.setDate(date2.getDate());
      date2.setHours(0, 0, 0, 0);
      date2 = oj.IntlConverterUtils.dateToLocalIso(date2);

      if (date2) {
        self.minDate.splice(index, 0, date2);
      }
    };

    self.checkDuplicate = function () {
      let flag = false;

      outer: for (let i = 0; i < self.dataArray.length; i++) {
        for (let j = 0; j < self.dataArray.length; j++) {
          if (i !== j && self.dataArray[i].remId === self.dataArray[j].remId) {
            flag = true;
            break outer;
          }
        }
      }

      return flag;
    };

    self.checkDateValidity = function () {
      let flag = false;

      outer: for (let i = 0; i < self.dataArray.length; i++) {
        for (let j = 0; j < self.dataArray.length; j++) {
          const from = Date.parse(self.dataArray[i].fromDate), to = Date.parse(self.dataArray[i].toDate);

          if (i === j && from > to) {
            flag = true;
            break outer;
          }
        }
      }

      return flag;
    };

    self.createPayload = function (payload) {
      let objToPush = {},
        indexInRemList = null;

      self.dataSource.data().forEach(function (data) {
        objToPush = {
          additionalInfo: data.additionalInfo,
          reconInfo: data.reconcilationInformation,
          recordStatus: "O",
          validityEndDate: data.toDate,
          validityStartDate: data.fromDate,
          remitterId: data.remId,
          remitterListId: self.remittanceObj()
        };

        payload.push(objToPush);
      });

      self.remittanceList().forEach(function (remObj, index) {
        if (self.remittanceObj() === remObj.remitterListId) {
          remObj.RemitterIdDetailServiceDTO.push.apply(remObj.RemitterIdDetailServiceDTO, payload);
          indexInRemList = index;
        }
      });

      self.modelInstance.remitterDTO.realCustomerNo(params.dashboard.userData.userProfile.partyId.value);
      self.modelInstance.remitterDTO.realCustomerName(params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName);
      self.modelInstance.remitterDTO.remitterDesc(self.remittanceList()[indexInRemList].remitterDesc);
      self.modelInstance.remitterDTO.remitterListId(self.remittanceList()[indexInRemList].remitterListId);
      self.modelInstance.remitterDTO.RemitterIdDetailServiceSaveDTO(self.remittanceList()[indexInRemList].RemitterIdDetailServiceDTO);
    };

    self.loadReview = function () {
      const tracker = document.getElementById("tracker");

      if(self.dataSource.data().length > 0){
        if (tracker.valid === "valid") {
          if (!self.checkDuplicate()) {
            if (!self.checkDateValidity()) {
              const payload = [];

              self.createPayload(payload);

              params.dashboard.loadComponent("review-virtual-identifiers-create", {
                remittanceList: self.modelInstance.remitterDTO,
                payloadLength: ko.mapping.toJS(self.payloadLength()),
                payload: JSON.stringify(payload)
              });
            }
            else {
              params.baseModel.showMessages(null, [self.resource.dateValidityErrorMessage], "error");
            }
          }
          else {
            params.baseModel.showMessages(null, [self.resource.duplicateErrorMessage], "error");
          }
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      } else {
        params.baseModel.showMessages(null, [self.resource.validityMessage], "error");
      }

    };

    self.backFromReview = function () {
      self.view("create");
    };

    self.setRemName = function (event) {
      if (event.detail.value) {
        self.remittanceList().forEach(function (obj) {
          if (obj.remitterListId === event.detail.value) {
            self.remListName(obj.remitterDesc);
          }
        });
      }
    };

    self.deleteRow = function (rowID) {
      self.deptObservableArray().forEach(function (rowObj, index) {
        if (rowObj.id === rowID.id) {
          self.deptObservableArray.splice(index, 1);
          self.creatRow = self.creatRow + 1;
          self.payloadLength(self.payloadLength() - 1);
        }
      });
    };
  };
});
