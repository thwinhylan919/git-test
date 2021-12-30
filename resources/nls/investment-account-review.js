define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/investment-account-contact-details",
  "ojL10n!resources/nls/investment-account-fatca",
  "ojL10n!resources/nls/investment-account-nomination-details",
  "ojL10n!resources/nls/investment-account-personal-details",
  "ojL10n!resources/nls/investment-account-primary-asset",
  "ojL10n!resources/nls/investment-account-primary-liabilities",
  "ojL10n!resources/nls/investment-account-relatives",
  "ojL10n!resources/nls/investment-account-investments"

], function(Messages, Generic, ContactDetails, FatcaDetails, NominationDetails, PersonalDetails, PrimaryAssets, PrimaryLiabilities, Relatives, Investments) {
  "use strict";

  const InvestmentAccountLocale = function() {
    return {
      root: {
        personalDetailsHeading: "Personal Details",
        contactDetailsHeading: "Contact Details",
        nominationDetailsHeading: "Nomination Details",
        fatcaHeading: "FATCA",
        assetsHeading: "Primary Assets",
        liabilitiesHeading: "Primary Liabilities",
        investmentsHeading: "Investments",
        relativesHeading: "Relatives",
        pageHeading: "Open Investment Account",
        bannerMessage: "Please review details before you confirm!",
        review: "Review",
        clickMessage: "Click to edit section",
        confirmScreenMsg : "Account Opened Successfully !!",
        contactDetails: ContactDetails,
        fatcaDetails: FatcaDetails,
        nominationDetails: NominationDetails,
        personalDetails: PersonalDetails,
        primaryAssets : PrimaryAssets,
        primaryLiabilities : PrimaryLiabilities,
        relatives : Relatives,
        investments : Investments,
        messages: Messages,
        generic: Generic,
        mutualFunds:{
          purchaseAnotherFund: "Purchase Mutual Fund",
          openAnotherAccount: "Open Another account",
          wealthDashboard: "Wealth Overview"
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

  return new InvestmentAccountLocale();
});
