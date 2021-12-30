define([], function () {
    "use strict";

    const investmentaccountinvestmentsLocale = function () {
        return {
            root: {
                heading: { Investments: "Investments" },
                Investments: {
                    InvestmentType: "Investment Type",
                    InvestmentDate: "Investment Date",
                    CurrentMarketValue: "Current Market Value",
                    Save: "Save",
                    InvestmentNumber : "Investment {index}",
                    addInvestment : "Add Investment",
                    clickToDelete : "Click to Delete",
                    deleteInvestment : "Delete Investment",
                    select : "Select",
                    pageTitle : "Please fill in the details of current investments you hold"
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

    return new investmentaccountinvestmentsLocale();
});
