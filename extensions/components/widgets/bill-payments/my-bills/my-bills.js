define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/my-bills",
  "./model",
  "ojs/ojarraydataprovider",
  "ojs/ojlistview", "ojs/ojknockout", "promise", "ojs/ojinputtext", "ojs/ojavatar"
], function(oj, ko, $, resourceBundle, model) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("quick-bill-payment", "bill-payments");

    const currentDate = oj.IntlConverterUtils.dateToLocalIso(new Date(rootParams.baseModel.getDate()));

    self.billerData = ko.observableArray();

    self.dataProvider = new oj.ArrayDataProvider(self.billerData, {
      idAttribute: "billerId"
    });

    const payLoad = {
      batchDetailRequestList: []
    };

    /**
     * The function is called to set icons.
     *
     * @param  {Object} data - It contains billerdetails and its logo will be changed.
     * @function fetchLogos
     * @returns {void}
     */
    function fetchLogos(data) {
      model.fireBatch(payLoad).done(function(batchData) {
        const contentMap = [];

        if (batchData && batchData.batchDetailResponseDTOList) {
          for (let j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
            const batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);

            if (batchResponse.contentDTOList) {
              if (batchResponse.contentDTOList[0].contentId)
                {contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content;}
            }
          }
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].category && data[i].category.logo) {
            data[i].categoryLogo(contentMap[data[i].category.logo.value]);
          }
        }
      });
    }

    /**
     * The function is called to set data to display to the user.
     *
     * @param  {Object} data - Data to set for Billers to display.
     * @function fetchLogos
     * @returns {void}
     */
    function setData(data) {
      const target_data = [];

      data.billerRegistrationDTOs.forEach(function(biller) {
        if ((biller.billerType === "PRESENTMENT_PAYMENT" || biller.billerType === "PRESENTMENT") && biller.ebill) {
          target_data.push(biller);
        }
      });

      let id;

      target_data.forEach(function(element, i) {
        if (element.registrationStatus === "APPROVED" && element.ebill && new Date(element.ebill.dueDate) < new Date(currentDate)) {
          element.statusToDisplay = "OVERDUE";
        } else if (element.autopay) {
          element.statusToDisplay = "AUTOPAY";
        } else {
          const oneDay = 24 * 60 * 60 * 1000,
            firstDate = new Date(element.ebill.dueDate),
            secondDate = new Date(currentDate),
            diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));

          element.statusToDisplay = diffDays;
        }

        if (element.category) {
          element.categoryLogo = ko.observable();
          element.initials = oj.IntlConverterUtils.getInitials(element.category.name);

          if (element.category.logo) {
            id = element.category.logo.value;

            const contentURL = {
                value: "/contents/{id}",
                params: {
                  id: id
                }
              },
              obj = {
                methodType: "GET",
                uri: contentURL,
                headers: {
                  "Content-Id": i + 1,
                  "Content-Type": "application/json"
                }
              };

            payLoad.batchDetailRequestList.push(obj);
          }
        }
      });

      if (payLoad.batchDetailRequestList.length > 0) {
        fetchLogos(target_data);
      }

      self.billerData.removeAll();

      if (target_data.length)
        {ko.utils.arrayPushAll(self.billerData, target_data);}
    }

    model.fetchBillers().then(function(data) {
      setData(data);
    });

    self.quickBillPay = function() {
      rootParams.dashboard.loadComponent("manage-accounts", {
        applicationType: "billPayments",
        defaultTab: "quick-bill-payment",
        jsonData: {
          name: "quick-bill-payment",
          module: "quick-bill-payment"
        }
      });
    };

    self.quickRecharge = function() {
      rootParams.dashboard.loadComponent("manage-accounts", {
        applicationType: "billPayments",
        defaultTab: "quick-recharge",
        jsonData: {
          name: "quick-recharge",
          module: "quick-recharge"
        }
      });
    };

    self.viewAllBillers = function() {
      rootParams.dashboard.loadComponent("manage-accounts", {
        applicationType: "billPayments",
        defaultTab: "manage-bill-payments",
        jsonData: {
          name: "manage-bill-payments",
          module: "bill-payments"
        }
      });
    };

    self.payBill = ko.observable();
    self.allowPayment = ko.observable();
    rootParams.baseModel.registerComponent("pay-bill", "bill-payments");

    self.showPayBill = function(data) {
      model.fetchBillerDetails(data).done(function(billerResponse) {
        const parameters = {
          registerBillerDetails: billerResponse.billerRegistration
        };

        self.payBill(billerResponse.billerRegistration);

        model.fetchBillerValues(billerResponse.billerRegistration.billerId).done(function(response) {
          if (response) {
            if (response.biller.type === "PRESENTMENT" || (response.biller.type === "PRESENTMENT_PAYMENT" && billerResponse.billerRegistration.ebill)) {
              self.allowPayment = response.biller.paymentOptions.latePayment;

              if (self.allowPayment === false && currentDate > billerResponse.billerRegistration.ebill.dueDate) {
                $("#hidePayBill").trigger("openModal");
              } else if (self.payBill().autopay === true) {
                $("#autoPayBill").trigger("openModal");
              } else if (self.payBill().schedulePayment && self.payBill().schedulePayment === true) {
                $("#scheduledPay").trigger("openModal");
              } else {
                rootParams.dashboard.loadComponent("pay-bill", parameters);
              }
            } else if (self.payBill().autopay === true) {
              $("#autoPayBill").trigger("openModal");
            } else if (self.payBill().schedulePayment && self.payBill().schedulePayment === true) {
              $("#scheduledPay").trigger("openModal");
            } else {
              rootParams.dashboard.loadComponent("pay-bill", parameters);
            }
          }
        });
      });
    };

    self.autoPayBill = function() {
      const parameters = {
        registerBillerDetails: self.payBill()
      };

      rootParams.dashboard.loadComponent("pay-bill", parameters);
    };

    self.hideBillPay = function() {
      $("#autoPayBill").hide();
    };

    self.hideSchedulePay = function() {
      $("#scheduledPay").hide();
    };
  };
});