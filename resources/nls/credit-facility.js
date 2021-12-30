define([], function() {
  "use strict";

  const CustomerPreferenceLocale = function() {
    return {
      root: {
        creditFacilityHeading:"Credit Facility",
       liabilityHeading:"Credit Limit",
       collateralHeading:"Collateral",
       liabilityAmount:"Credit Limit Amount",
       sanctionedAmount:"Sanctioned Amount",
       utilizedAmount:"Utilized Amount",
       availableAmount:"Available Amount",
       collateralAmount:"Collateral Amount",
       progressValue:"{number} % Utilized",
       viewDetails:"View Details",
       myTaskTitle:"My Task",
       FacilityId:"Facility Id",
       ExpiryDate:"Expiry Date",
       Action:"Action",
       Renew:"Renew",
       Frozen:"Frozen",
       CollateralId:"Collateral Id",
       RevaluationDate:"Revaluation Date",
       none:"",
       Overdue:"Overdue",
       Revaluate:"Re-evaluate",
       RenewalDate:"Renewal Date",
       eqLocalCurrency:"*Equivalent Local Currency",
       facilityAllocation:"Facility Allocation",
       facilityCurrency:"Facility Currency",
       localCurrency:"Local Currency",
       range1:"Below 25%",
       range2:"25% - 50%",
       range3:"50% - 75%",
       range4:"Above 75%",
       utilizedStatus:"Utilized Status",
       facilityName:"Facility Name",
       message:"Message",
       date:"Date"
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

  return new CustomerPreferenceLocale();
});