define(["ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const BillerDetailsLocal = function() {
    return {
      root: {
        billers: {
          billerdelete: "Delete Biller",
          pendingApproval: "Pending Approval",
          cancel: "Cancel",
          done: "Done",
          pay: "Pay",
          category: "Category",
          billerName: "Biller Name",
          verifydeletemessage: "Are you sure you want to delete {billerName} from your biller list?",
          sucessfull: "Successful!",
          deletemessage: "Biller {billerName} has been deleted!",
          relationship1: "Relationship No 1",
          relationship2: "Relationship No 2",
          relationship3: "Relationship No 3",
          edit: "Edit",
          delete: "Delete",
          deleteBiller: "Delete Biller",
          editTitle: "Biller Details",
          viewEditTitle: "View/Edit Biller",
          deleteTitle: "Delete Biller",
          back: "Back",
          confirmDelete: "Delete Biller",
          confirmBiller: "Add Biller",
          deleteSuccess: "Biller has been deleted.",
          corpMaker: "You have successfully initiated the transaction.",
          generic: Generic
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

  return new BillerDetailsLocal();
});