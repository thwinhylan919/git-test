define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const ViewTabularStructure = function() {
        return {
            root: {
                generic: Generic,
              heading: { CreditFacilityOverview: "Facility Summary" },
              CreditFacilityOverview: {
                  All: "All",
                  TermLoan: "TERM LOAN",
                  chooseFacility:"Choose Facility",
                  facilityId:"Facility Id",
                  ProjectFinance: "PROJECT FINANCE",
                  WorkingCapitalFinance: "WORKING CAPITAL",
                  AccountReceivableFinance: "ACCOUNT RECEIVABLES",
                  OverDraftFinance: "OVER DRAFT FINANCE",
                  Guarantee: "GUARANTEE",
                  LettersofCredit: "LETTER OF CREDIT",
                  Secured: "Secured",
                  Unsecured: "Unsecured",
                  Currency: "Currency",
                  expiringIn:"Expiring in",
                  expiry1:"15 days",
                  expiry2:"30 days",
                  expiry3:"60 days",
                  expiry4:"90 days",
                  expiry5:"120 days",
                  expiry6:"Customize",
                  expiry7:"No Expiry",
                  notApplicable: "Not Applicable",
                  availableAmountRange:"Available Amount Range",
                  hyphen:"-",
                  noOfDaysLabel: "Custom Days",
                  noOfDays: "Number of Days"
              },
                structure: {
                    labels: {
                        header: "Facility Summary",
                        structureHeader: "Tabular Tree Structure",
                        instructionDetailsTitle: "View Instruction Details",
                        reallocationMethod: "Reallocation Method",
                        partyName: "Party Name",
                        accountName: "Account Name",
                        accountNumber: "Account Number",
                        accountType: "Account Type",
                        accountBalance: "Account Balance",
                        accountLinked: "Linked Accounts",
                        type: "Type",
                        apply:"Apply",
                        view: "View",
                        searchBy:"Description",
                        instructions: "Instructions",
                        actions: "Actions",
                        update: "Update",
                        moreOptionsAlt: "Click here for more options",
                        moreOptionsTitle: "Click here for more options",
                        instructionDetails: "Instruction Details",
                        facilityId:"Facility Id",
                        sanctionedAmount:"Sanctioned Amount",
                        utilizedAmount:"Utilized Amount",
                        availableAmount:"Available Amount",
                        collateralAmount:"Collateral Amount",
                        expiryDate:"Expiry Date",
                        currency:"Currency",
                        noData:"No facilities available",
                        achieved: "{percent}% Utilized",
                        treeView:"Tree view",
                        fundingType:"Funding Type",
                        facilityType:"Facility Type",
                        facilityCategory: "Facility Category",
                        reInitiate:"Amend Facility",
                        progressValue:"{number} % Utilized",
                        viewHierarchy:"View Hierarchy",
                        totalAmount:"Total Amount",
                        addSubFacility:"Add Sub-facility",
                        loanDrawDown:"Loan Drawdown",
                        amendFacility:"Amend Facility",
                        viewCollateralGroups:"View Collateral Groups",
                        viewCovenants:"View Covenants",
                        reDate:"Renew Date",
                        revolvingLine: "Revolving Line",
                        mainLine:"Main Line",
                        reset: "Reset"
                      },
                    header:"Credit Facility Overview"
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

    return new ViewTabularStructure();
});
