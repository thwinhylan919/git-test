define([], function() {
    "use strict";

    const toolCalcLocale = function() {
        return {
            root: {
                toolCalc: {
                    labels: {
                        toolHeading: "Calculators for all your Money Goals"
                    },
                    desc: {
                        calculator: "Use our tools and calculators to calculate interests and repayments for your loans"
                    },
          blueTxt: {
            loan: "Loan Calculator",
            termDeposit: "Term  Deposit Calculator",
            eligibility: "Loan Eligibility",
            FECalculator: "Foreign Exchange"
          },
                    whiteTxt: {
                        calculator: "Calculator",
                        calculators: "Calculators"
                    },
                    tcdescription: {
                        loan: "Getting home loan from Futura Bank is quick and easy.",
                        termDeposit: "Our term deposit calculator helps you determine savings.",
                        eligibility: "Eligibility Calculator to calculate the amount you borrow.",
                        FECalculator: "A Personal Forex Ex-change Service from a Pro-Active Team."
                    },
                    back: "Back"
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

    return new toolCalcLocale();
});