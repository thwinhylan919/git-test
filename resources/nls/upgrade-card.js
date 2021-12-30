define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const UpgradeCardLocale = function() {
    return {
      root: {
        DeliveryLocation: "Delivery Location",
        upgradeDebitCard: "Debit Card Upgrade",
        upgradeCard: "Upgrade Card",
        viewDetails: "View Details",
        hideDetails: "Hide Details",
        viewDetailsAlt: "Click here to view additional details and benefits related to the card type",
        viewDetailsTitle: "Link to view details and benefits of card type",
        hideDetailsAlt: "Click here to hide additional details and benefits related to the card type",
        hideDetailsTitle: "Link to hide details and benefits of card type",
        nameOnCard: "Name on Card",
        emailId: "Email Id",
        mobileNo: "Mobile No",
        termsAndConditions: "Terms and Conditions",
        terms: "I accept Terms and Conditions",
        review: "Review",
        reviewHeader: "You initiated a request to upgrade Debit Card. Please review details before you confirm!",
        debitCards: {
          customerName: "Customer Name",
          cardType: "Card Type",
          accountNo: "Account Number",
          cardNumber: "Card Number",
          validThru: "Valid Through",
          status: "Status",
          fullName: "{firstName} {middleName} {lastName}"
        },
        cardTypeDetails: {
          benefitsHeader: "{cardType} - Benefits",
          domestic: "Domestic",
          international: "International",
          cashWithdrawalLimit: "Daily cash withdrawal limit",
          purchaseLimit: "Daily Purchase limit",
          transactionLimitPerDay: "Online transaction limit per day",
          zeroLiabilityProtection: "Zero Liability Protection",
          offers: "Offers",
          offer1: "Get flat {discount}% off at {company} on minimum purchase of {amount}",
          offer2: "Get cashback up to {discount} on {company} products",
          offer3: "Get {discount}% off on flight booking at {company}",
          offer4: "Get {company} voucher worth {discount}",
          rewards: "Rewards",
          reward1: "This debit card offers you up to {paybackPoints} payback Reward points for every {expenditureAmount} spent using your Debit Card for purchase transactions.",
          cardTypeOfferDetails:{
             offerName1: "Offer 1",
             discount1: "25",
             company1: "Royal Bakery",
             amount1: "9999",
             offerName2: "Offer 2",
             discount2: "10000",
             company2: "Pizza Times",
             offerName3: "Offer 3",
             discount3: "10",
             company3: "Coffee Hut",
             offer4: "Offer 4",
             discount4: "100",
             company4: "Super Travelers"
    },
          cardTypeRewardDetails:{
             paybackPoints: "10",
             expenditureAmount: "200"
    }
        },
        messages: {
          upgradeCardType: "Please select the card type"
        },
         debitCardType: {
          silverDebitCard:"Silver Debit Card",
          goldDebitCard:"Gold Debit Card",
          platinumDebitCard:"Platinum Debit Card",
          coralDebitCard:"Coral Debit Card"
        },
        transactionName: "Debit Card Upgrade",
        ok: "Ok",
        reviewHeading: "Review",
        generic: Generic
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

  return new UpgradeCardLocale();
});
