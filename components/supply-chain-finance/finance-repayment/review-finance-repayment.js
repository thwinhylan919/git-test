define([

  "knockout",
  "./model",
  "ojs/ojcore",

  "ojL10n!resources/nls/finance-repayment-create",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojlabel",
  "ojs/ojpagingdataproviderview",
  "ojs/ojpagingtabledatasource"
], function (ko, FinanceRepaymentModel, oj, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("finance-repayment-create", "virtual-account-management");

    self.reviewTemplate = ko.observable(true);
    self.displayCountryName = ko.observable();
    self.countryOptions = ko.observable([]);

    self.getModelPayload = function () {
      return ko.mapping.fromJS(FinanceRepaymentModel.getNewModel());
    };

    self.modelPayload = self.getModelPayload();
    self.batchList = ko.observableArray();
    self.updateMessage = ko.observable(self.resource.title);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.financeRepaymentReviewDTO = params.rootModel.params.FinanceRepaymentDTO;

    self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.financeRepaymentReviewDTO, {
      idAttribute: "id"
    }));

    self.batchlistMaker = function () {
      let contentCount = 0;

      for (let i = 0; i < self.financeRepaymentReviewDTO.length; i++) {

        self.modelPayload.id(self.financeRepaymentReviewDTO[i].id);

        self.modelPayload.amounts()[0].totalAmount.amount(self.financeRepaymentReviewDTO[i].totalAmount.amount);
        self.modelPayload.amounts()[0].totalAmount.currency(self.financeRepaymentReviewDTO[i].totalAmount.currency);

        self.batchList.push({
          methodType: "POST",
          uri: {
            value: "supplyChainFinance/finances/repayment"
          },
          headers: {
            "Content-Id": contentCount,
            "Content-Type": "application/json",
            X_APP_VERSION: "v1"
          },
          payload: ko.toJSON(ko.mapping.toJS(self.modelPayload))
        });

        contentCount = contentCount + 1;

      }
    };

    self.batchlistMaker();

    self.confirm = function () {

      const finalfinanceRepaymentDTO = {
        batchDetailRequestList: []
      };

      finalfinanceRepaymentDTO.batchDetailRequestList = self.batchList();

      FinanceRepaymentModel.batchpost(finalfinanceRepaymentDTO).then(function (data) {
        if ((data && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
          params.baseModel.showMessages(null, [data.messages.codes[0].desc], "error");
        } else {
          params.baseModel.showMessages(null, [self.resource.title], "error");
        }
      });

    };

  };
});