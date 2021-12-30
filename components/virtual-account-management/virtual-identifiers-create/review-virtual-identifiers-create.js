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
  "ojs/ojpagingtabledatasource",
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
    self.payloadLength = ko.observable(params.rootModel.params.data ? "" : params.rootModel.params.payloadLength);
    self.remittanceList = params.rootModel.params.data ? params.rootModel.params.data.requestPayload : params.rootModel.params.remittanceList;
    self.remittanceObj = params.rootModel.params.data ? self.remittanceList.remitterListId : self.remittanceList.remitterListId();
    self.remitterDesc = params.rootModel.params.data ? self.remittanceList.remitterDesc : self.remittanceList.remitterDesc();
    self.mode = ko.observable();
    self.taskCode = "VAMI_M_UVI";

    if (params.rootModel.params.data) {
      self.mode("approval");

      self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.remittanceList.RemitterIdDetailServiceSaveDTO, {
        idAttribute: "remitterId"
      }));

    } else {
      self.mode("review");

      self.dataSource = new oj.ArrayDataProvider(JSON.parse(params.rootModel.params.payload), {
        idAttribute: "remitterId"
      });
    }

    self.confirmScreenMessage = function () {
      return self.resource.successMessage;
    };

    self.confirm = function () {

      EntityModel.saveRemittanceList(ko.toJSON(self.remittanceList), self.remittanceObj, self.taskCode).then(function (data) {
        if ((data.jsonNode && data.jsonNode.messages.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
          params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
        } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.resource.pageHeader,
            confirmScreenExtensions: {
              resource: resourceBundle,
              isSet: true,
              confirmScreenDetails: [{
                remitterListId: self.remittanceObj,
                remitterDesc: self.remittanceList.remitterDesc()
              }],
              template: "confirm-screen/virtual-entity-create-remittance"
            }
          });
        } else {
          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.resource.pageHeader,
            confirmScreenExtensions: {
              resource: resourceBundle,
              confirmScreenMsgEval: self.confirmScreenMessage,
              isSet: true,
              confirmScreenDetails: [{
                remitterListId: self.remittanceObj,
                remitterDesc: self.remittanceList.remitterDesc()
              }],
              template: "confirm-screen/virtual-entity-create-remittance"
            }
          });
        }
      });
    };

  };
});