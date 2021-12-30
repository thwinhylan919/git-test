define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/india/resources/nls/view-interest-rate",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, OpenTdModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.interestSlabsLoaded = ko.observable(false);
    self.interestSlabsDataSource = ko.observable();
    self.locale = locale;

    const productId = self.params.productId(),
      currency = self.params.currency,
      module = self.params.module;

    self.amount = rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.amount, {
      currency: currency
    });

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.viewDepositRates = function() {
      $("#depositRates").trigger("openModal");
    };

    /**
     * This function is used display interest rates in Term Deposit .
     *
     * @memberOf td-open
     * @function openInterestSlabs
     * @returns {void}
     */
    self.openInterestSlabs = function() {
      if (productId) {
        self.interestSlabsLoaded(false);

        let interestRateSlabsList = [];
        const interestList = [],
          amount = [],
          tenure = [],
          rate = [];
        let k = 0;

        OpenTdModel.readInterestRate(productId, module).then(function(data) {
          interestRateSlabsList = data.tdProductDTOList[0].tdinterestRate.slabs;

          let interestRateList = interestRateSlabsList[0].interestRateList;

          tenure[k] = interestRateList[0];
          k++;

          for (let i = 0; i < interestRateSlabsList.length; i++) {
            let flag = false;

            interestRateList = interestRateSlabsList[i].interestRateList;

            for (let j = 0; j < tenure.length; j++) {
              if ((tenure[j].months === interestRateList[0].months) && (tenure[j].days === interestRateList[0].days)) {
                flag = true;
              }
            }

            if (!flag) {
              tenure[k] = interestRateList[0];
              k++;
            }
          }

          for (let i = 0; i < tenure.length; i++) {
            amount[i] = [];

            for (let j = 0; j < interestRateSlabsList.length; j++) {
              if ((tenure[i].days === interestRateSlabsList[j].interestRateList[0].days) && (tenure[i].months === interestRateSlabsList[j].interestRateList[0].months)) {
                amount[i].push(interestRateSlabsList[j].amount.amount);
                rate.push(interestRateSlabsList[j].interestRateList[0].rate);
              }
            }
          }

          k = 0;

          for (let i = 0; i < tenure.length; i++) {
            for (let j = 0; j < amount[i].length; j++) {
              interestList.push({});

              if (i !== tenure.length - 1 && amount[i][j] === amount[i+1][j]) {
                interestList[k].range = rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.fromto, {
                  from: self.formatTenure(tenure[i]),
                  to: self.formatTenure(tenure[i + 1])
                });
              } else {
                interestList[k].range = rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.andabove, {
                  value: self.formatTenure(tenure[i])
                });
              }

              if (j !== amount[i].length - 1) {
                interestList[k].amount = rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.fromto, {
                  from: amount[i][j],
                  to: amount[i][j + 1]
                });
              } else {
                interestList[k].amount = rootParams.baseModel.format(self.locale.openTermDeposit.interestslab.andabove, {
                  value: amount[i][j]
                });
              }

              interestList[k].rate = rate[k];
              k++;
            }
          }

          self.interestSlabsDataSource(new oj.ArrayTableDataSource(interestList));
          ko.tasks.runEarly();
          self.interestSlabsLoaded(true);
          $("#intrestslabs").trigger("openModal");
        });
      } else {
        rootParams.baseModel.showMessages(null, [self.locale.openTermDeposit.validate.emptyProduct], "ERROR");
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.closeModelWindow = function() {
      $("#intrestslabs").hide();
    };

    /**
     * Self - description.
     *
     * @param  {type} tenure - Description.
     * @return {type}        Description.
     */
    self.formatTenure = function(tenure) {
      let formattedTenure = null;

      if (tenure && tenure.years && tenure.years !== 0) {
        formattedTenure = rootParams.baseModel.format(tenure.years > 1 ? self.locale.openTermDeposit.tenure.Years : self.locale.openTermDeposit.tenure.year, {
          year: tenure.years
        });
      }

      if (tenure && tenure.months && tenure.months !== 0) {
        formattedTenure = (formattedTenure ? formattedTenure + "," : "") + rootParams.baseModel.format(tenure.months > 1 ? self.locale.openTermDeposit.tenure.Months : self.locale.openTermDeposit.tenure.month, {
          month: tenure.months
        });
      }

      if (tenure && tenure.days && tenure.days !== 0) {
        formattedTenure = (formattedTenure ? formattedTenure + "," : "") + rootParams.baseModel.format(tenure.days > 1 ? self.locale.openTermDeposit.tenure.Days : self.locale.openTermDeposit.tenure.day, {
          day: tenure.days
        });
      }

      if (tenure && tenure.days && tenure.days === 0 && !formattedTenure) {
        formattedTenure = rootParams.baseModel.format(self.locale.openTermDeposit.tenure.day, {
          day: tenure.days
        });
      }

      return formattedTenure;
    };
  };
});