define([], function() {
  "use strict";

  const TransactionLimitsLocale = function() {
    return {
      root: {
        transaction_limit: {
          limit_section: "Transaction Limit",
          limit_id: "Limit ID",
          limit_name: "Limit Name",
          transaction_limit: "Transaction Limit",
          limit_desc: "Limit Description",
          id: "ID",
          code: "Code",
          name: "Name",
          description: "Description",
          transaction_limit_search: "{id} - {name}",
          select_limit: "Select Limit",
          delete_limit: "Delete Limit"
        },
        pageHeader: "Limits Management"
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

  return new TransactionLimitsLocale();
});
