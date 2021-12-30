define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        wallet: {
          activity: {
            dr: "Dr",
            activity: "Statement",
            unclaimedfunds: "Unclaimed Funds",
            requestfunds: "Requested Funds",
            cr: "Cr",
            wallet: "wallet",
            componentIdentifier: "Component Identifier",
            alt: "wallet",
            title: "wallet",
            status: "Status",
            search: "search",
            active: "Active",
            expired: "Expired",
            DEC: "Declined",
            SNT: "Pending",
            COM: "Complete",
            requestedfrom: "Requested From",
            requeststatus: "Request Status",
            requestdate: "Request Date",
            activitylabel: "Debits & Credits",
            unclaimedlabel: "Active & Expired",
            requestfundslabel: "Pending & Declined",
            miniStatement: "Mini Statement",
            mobileStatement: "Statement",
            mobileStatement_title: "Statement",
            mobileStatement_viewall: "View Transactions",
            main: "Activity",
            accountNumber: "Account Numbers",
            accountInfo: "Account Details",
            subscribeText: "You will receive monthly statements for your account {accountNumber} by email at {emailID}",
            physicalStatementRequest: "You will receive the statement at your registered address.",
            reivewPhysicalStatement: "Please confirm the period of the statement",
            currentBalance: "Current Balance",
            from: "From:",
            description: "Description",
            refNo: "Reference Number",
            eStatement: "Subscribe to eStatement",
            Statement: "Request statement",
            fromDate: "From Date",
            toDate: "To Date",
            subscribe: "Subscribe",
            request: "Request",
            download: "Download",
            review: "Review",
            to: "To:",
            moreDetails: "More Details",
            confirm: "Confirm",
            cancel: "Cancel",
            done: "Done",
            Amount: "Amount",
            date: "Date",
            Balance: "Balance",
            last10: "Last 10",
            "D&C": "Debits & Credits",
            Last10Transactions: "Last 10 Transactions",
            currentPeriod: "Current Period",
            PrevMonth: "Previous Month",
            PrevQuarter: "Previous Quarter",
            DateRange: "Select Date Range",
            all: "All",
            Debit: "Debits Only",
            Credit: "Credits Only",
            openingBalance: "Opening Balance:",
            closingBalance: "Closing Balance:",
            sub: "S.Est",
            showMore: "Show more... 1-{toRecords} of {totalItems} items",
            save: "Download",
            estatement: "E-Statement",
            reqStatement: "Request Statement"
          }
        },
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

  return new TransactionLocale();
});