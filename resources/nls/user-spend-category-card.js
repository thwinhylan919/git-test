define(
  [],
  function() {
    "use strict";

    const UserSpendCategoryCard = function() {
      return {
        root: {
          edit: "Edit",
          alt: "Click here to edit spend category",
          title: "Click here to edit spend category"
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

    return new UserSpendCategoryCard();
  }
);