define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/transaction-group-common",
  "ojL10n!resources/nls/transaction-group-headers"
], function(Generic, TGCommon, TGHeaders) {
  "use strict";

  const TransactionGroupLocale = function() {
    return {
      root: {
        info: {},
        fieldname: {
          transactionGroupCode: "Group Code",
          transactionGroupDesc: "Group Description",
          transactionId: "Sr No.",
          readTable: "Summary",
          title: "Transaction Group",
          transactions: "Transactions",
          select_role: "Select Transactions",
          transactionsCount: "No of Transactions",
          transactionGroupCreate: "Transaction Group",
          deleteMessage: "Transaction Group Deletion",
          backWarning1: "Are you sure you want to cancel",
          review: "Review",
          transactionGroupList: "Transaction Group Data",
          noDescription: "Please enter either Transaction Group Code or Transaction Group Description.",
          addReviewHeaderMsg: "You Initiated a request for creating Transaction group. Please review details before you confirm!",
          editReviewHeaderMsg: "You Initiated a request for editing Transaction group. Please review details before you confirm!",
          createMessage: "You can create new Transaction Groups by clicking on create.",
          createHeader: "Create and Maintain Transaction Groups",
          create: "Create",
          createInfoHeader: "Want to define limits for a transaction group?",
          createInfoMessage: "Create a group and add multiple transactions to a group.Similarly you can create multiple groups.Access Limit Package Management for defining limits for a group of transactions.",
          readinfo: "Transaction Group Details",
          updateMessage: "You can add or remove the transactions from a group.Already utilized limits for a transactions you are removing from a group will not be reversed.Similarly for any new transaction,group limits will be effective for the transactions initiated post group modification.",
          readMessage: "You may edit or delete this Transaction Group.Using edit option,you can add or remove the transactions.Group can be deleted if not associated with any limit package and the package is not mapped at various levels."
        },
        generic: Generic,
        common: TGCommon,
        headers: TGHeaders
      }
    };
  };

  return new TransactionGroupLocale();
});
