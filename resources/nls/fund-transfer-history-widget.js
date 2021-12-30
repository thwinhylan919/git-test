define([], function () {
    "use strict";

    const testLocale = function () {
        return {
            root: {
                heading: { FundsTransferHistory: "Funds Transfer History" },
                FundsTransferHistory: {
                    listView: "List View",
                    fromDate: "From Date",
                    accountDetails: "Account Details",
                    viewAll: "View All",
                    viewDetails: "View Details",
                    reInitiate:"Re-Initiate",
                    allPayees:"All",
                    selfPayeeNickName:"Own Account",
                    statusHeaders:{
                      success:"Success",
                      failed:"Failed",
                      inprogress:"In Progress"
                    },
                    noupcomingmsg: "No new payments have been initiated"
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

    return new testLocale();
});
