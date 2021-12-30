define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!lzn/beta/resources/nls/application-fees-view"
], function(ko, $, ApplicationFeesViewModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.feesSummary = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.collectionTypeLoaded = ko.observable(false);
    self.sumAmount = ko.observable();
    self.currency = ko.observable("");
    self.feeCollectionTypeList = ko.observable([]);
    self.bankFees = ko.observable();
    self.applicationFees = ko.observable([]);
    self.feesConfigured = ko.observable(false);

    let bankFeeIndex;

    ApplicationFeesViewModel.fetchFundingTable(self.applicationInfo().currentSubmissionId()).done(function(data) {
      self.bankFees(data);

      if (!$.isEmptyObject(self.bankFees().fundingTableDetailDTO)) {
        if (self.getIndex(self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs, "BANK_FEE")) {
          bankFeeIndex = self.getIndex(self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs, "BANK_FEE");

          if (self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex]) {
            self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].totalAmount.amount = ko.observable(self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].totalAmount.amount);
            self.feesConfigured(true);
          }
        }

        if (self.feesConfigured()) {
          for (let i = 0; i < self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].bankFeeFundingItemDTOs.length; i++) {
            self.applicationFees()[i] = {
              feeType: ko.observable(self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType),
              amount: ko.observable(self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].bankFeeFundingItemDTOs[i].totalFeeValue.amount),
              currency: ko.observable(self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].bankFeeFundingItemDTOs[i].totalFeeValue.currency)
            };
          }

          self.sumAmount({
            amount:self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].totalAmount.amount(),
            currency:self.bankFees().fundingTableDetailDTO[0].fundingItemDetailDTOs[bankFeeIndex].totalAmount.currency
          });
        }

        self.dataLoaded(true);
      }
    });

    self.getIndex = function(obj, key) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].fundingItemType === key) {
          return i;
        }
      }
    };
  };
});
