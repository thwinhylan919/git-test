define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.self);

    self.showConfirmResults = ko.observable(false);
    self.dataSource = ko.observable();

    self.tableFill = function (data) {
      let tempData = null,
        switchHeaderArray = [];

      tempData = $.map(data, function (v) {
        const newObj = {};

        if (self.isSwitch) {
          switchHeaderArray = v.header.split(",");
          newObj.headerInName = switchHeaderArray[0];
          newObj.headerOutName = switchHeaderArray[1];
        } else {
          newObj.headerName = v.header;
        }

        newObj.referenceNo = v.referenceNumber;
        newObj.statusMsg = v.statusMsg;
        newObj.failureReason = v.failureReason;

        return newObj;
      });

      self.dataSource(new oj.ArrayTableDataSource(tempData, {
        idAttribute: "referenceNo"
      }));

      ko.tasks.runEarly();
      self.showConfirmResults(true);
    };

    let headerNameText = "";

    if (self.isRedeem || self.isSwitch) {
      headerNameText = self.resource.fundDetails.schemeName;
    } else {
      headerNameText = self.resource.schemeName;
    }

    self.headerText = ko.observableArray([{
        headerText: headerNameText,
        field: "headerName"
      },
      {
        headerText: self.resource.referenceNo,
        field: "referenceNo"
      },
      {
        headerText: self.multiplePurchasenls.confirmScreen.status,
        field: "statusMsg"
      },
      {
        headerText: self.multiplePurchasenls.confirmScreen.failureReason,
        field: "failureReason"
      }
    ]);

    self.tableFill(self.multiplePurchase());

  };
});