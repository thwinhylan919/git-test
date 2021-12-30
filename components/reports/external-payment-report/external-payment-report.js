define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/external-payment-report",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function (ko, externalPaymentReportModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.validationTracker = rootParams.validationTracker;
    self.Nls = resourceBundle.externalPaymentReport;

    self.suggestions = function (context) {
      return new Promise(function (fulfill) {
        const options = [];

        if (context.term === "") {
          fulfill(options);

          return;
        }

        if (context.term) {
          const code = encodeURIComponent(context.term);

          externalPaymentReportModel.listMerchant(code).done(function (data) {
            if (data.response.length === 0) {
              options.push({
                value: self.Nls.notFound,
                label: self.Nls.notFound
              });
            } else {
              for (let i = 0; i < data.response.length; i++) {
                options.push({
                  value: data.response[i].merchantDetailsDTO.code,
                  label: data.response[i].merchantDetailsDTO.code
                });
              }
            }

            fulfill(options);
          });
        }
      });
    };
  };
});