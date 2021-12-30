define([], function () {
  "use strict";

  const shipmentDetailsLocale = function () {
    return {
      root: {
        labels: {
          descriptionOfGoods: "Description of Goods",
          goods: "Goods",
          goodWithSrNo: "Goods {srNo}",
          srNo: "Serial Number",
          latestShipmentDate: "Latest Shipment Date",
          lastdateofShipment: "Latest Date for Shipment",
          portOfLoading: "Port of Loading",
          newPortOfLoading: "Port Of Loading(New)",
          goodsShipmentDate: "Goods Shipment Date",
          partialShipment: "Partial Shipment",
          portOfDischarge: "Port of Discharge",
          newPortOfDischarge: "Port Of Discharge(New)",
          shipmentFrom: "Shipment From",
          newShipmentFrom: "Shipment From(New)",
          shipmentTo: "Shipment To",
          newShipmentTo: "Shipment To(New)",
          shipmentPeriod: "Shipment Period",
          newShipmentPeriod: "Latest Shipment Period(New)",
          shipmentDate: "Shipment Date",
          newShipmentDate: "Latest Shipment Date(New)",
          transShipment: "Transshipment",
          baseDate: "Base Date",
          maturityDate: "Maturity Date",
          billAmount: "Bill Amount",
          purchaseAmount: "Purchase Amount",
          daysFrom: "Days From",
          previousShipmentDate: "Previous Shipment Date",
          previousShipmentPeriod: "Previous Shipment Period",
          baseDateDescription: "Base Date Description",
          notApplicable: "N/A",
          units: "Units",
          pricePerUnit: "Price Per Unit",
          addGoods: "Add Goods",
          maxGoodLimit: "You can enter up to 5 goods only",
          conditional: "Conditional",
          transportationMode:"Transportation Mode",
          licenseDetails: {
            srNo: "Sr No",
            licenseNumber: "License Number",
            type: "License Type",
            currency: "Currency",
            amount: "Amount",
            balance: "Balance",
            issueDate: "Issue Date",
            expiryDate: "Expiry Date"
          },
          addLicense: "Add License",
          licenseDetailNo: "Goods No. {id} License Details",
          licenseDetail: "License Details",
          duplicateError: "Duplicate goods selected. Please choose different goods"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: true
    };
  };

  return new shipmentDetailsLocale();
});
