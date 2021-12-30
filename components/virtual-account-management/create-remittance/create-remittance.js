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
    params.baseModel.registerComponent("remittance-search", "virtual-account-management");
    self.remittanceListLoaded = ko.observable(false);
    self.remittanceList = ko.observableArray();
    self.remittanceObj = ko.observable();
    self.view = ko.observable("create");
    self.remListName = ko.observable();
    self.groupValid = ko.observable();
    self.uniqueId = 1;
    self.loadTable = ko.observable(true);
    self.payloadLength = ko.observable(1);
    self.minDate = ko.observableArray();

    EntityModel.maintenance().done(function (data) {
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

    EntityModel.fetchRemittanceList(params.dashboard.userData.userProfile.partyId.value, "0", "0").done(function (data) {
      if (data && data.jsonNode && data.jsonNode.data.length > 0) {
        self.remittanceList(data.jsonNode.data);
        self.remittanceListLoaded(true);
      }
    });

    self.dataArray = [{
      id: self.uniqueId,
      remId: null,
      fromDate: null,
      toDate: null,
      reconcilationInformation: null,
      additionalInfo: null
    }];

    self.deptObservableArray = ko.observableArray(self.dataArray);

    self.dataSource = new oj.ArrayDataProvider(self.deptObservableArray, {
      idAttribute: "remId"
    });

    self.addRow = function () {
      if (self.creatRow > -1) {
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
        self.payloadLength(self.payloadLength()+1);
      } else {
        params.baseModel.showMessages(null, [params.baseModel.format(self.resource.errorMsg, {
          value: self.limitRow
        })], "error");

      }
    };

    self.fromDateChanged = function(data) {
      let date2 = new Date(data.fromDate);
      const index = data.id - 1;

      date2.setDate(date2.getDate());
      date2.setHours(0, 0, 0, 0);
      date2 = oj.IntlConverterUtils.dateToLocalIso(date2);

      if (date2) {
        self.minDate.splice(index, 0, date2);
      }
    };

    self.checkDuplicate = function(){
      let flag = false;

      outer: for(let i=0; i<self.dataArray.length;i++)
      {
        for(let j=0;j<self.dataArray.length;j++)
        {
          if(i !== j && self.dataArray[i].remId === self.dataArray[j].remId )
          {
            flag = true;
            break outer;
          }
        }
      }

      return flag;
    };

    self.checkDateValidity = function(){
      let flag = false;

      outer: for(let i=0; i<self.dataArray.length;i++)
      {
        for(let j=0;j<self.dataArray.length;j++)
        {
          const from = Date.parse(self.dataArray[i].fromDate), to = Date.parse(self.dataArray[i].toDate);

          if(i === j && from > to )
          {
            flag = true;
            break outer;
          }
        }
      }

      return flag;
    };

    self.loadReview = function () {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        if(!self.checkDuplicate()){
          if(!self.checkDateValidity()){
            self.view("view");
          }
          else{
            params.baseModel.showMessages(null, [self.resource.dateValidityErrorMessage], "error");
          }
        }
        else{
          params.baseModel.showMessages(null, [self.resource.duplicateErrorMessage], "error");
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
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
          self.payloadLength(self.payloadLength()-1);
        }
      });
    };

    self.confirmScreenMessage = function () {
      return self.resource.successMessage;
    };

    self.backToCreate = function () {
      params.dashboard.loadComponent("create-remittance", self);
    };

    self.confirm = function () {
      let objToPush = {},
        indexInRemList = null;
      const payload = [];

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

      const finalList = {
        modNo: self.remittanceList()[indexInRemList].modNo,
        realCustomerNo: params.dashboard.userData.userProfile.partyId.value,
        realCustomerName: params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName,
        remitterDesc: self.remittanceList()[indexInRemList].remitterDesc,
        remitterListId: self.remittanceList()[indexInRemList].remitterListId,
        RemitterIdDetailServiceSaveDTO: self.remittanceList()[indexInRemList].RemitterIdDetailServiceDTO
      };

      EntityModel.saveRemittanceList(ko.toJSON(finalList), self.remittanceList()[indexInRemList].remitterListId).done(function (data, status, jqXhr) {
        if (data.jsonNode.messages.status === "FAILURE") {
          self.remittanceList().forEach(function (remObj) {
            if (self.remittanceObj() === remObj.remitterListId) {
              payload.forEach(function(data){
                remObj.RemitterIdDetailServiceDTO.pop(remObj.RemitterIdDetailServiceDTO);
              });
            }
          });

          params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
        } else {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.pageHeader,
            confirmScreenExtensions: {
              resourceBundle: resourceBundle,
              confirmScreenMsgEval: self.confirmScreenMessage,
              isSet: true,
              confirmScreenDetails: [{
                remitterListId: self.remittanceList()[indexInRemList].remitterListId,
                remitterDesc: self.remittanceList()[indexInRemList].remitterDesc
              }],
              template: "confirm-screen/virtual-entity-create-remittance"
            }
          });
        }
      });
    };
  };
});
