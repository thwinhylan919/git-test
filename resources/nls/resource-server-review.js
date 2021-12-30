define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ResourceServerReviewLocale = function() {
    return {
      root: {
        resourceServerReview: {
          resoureServerMt: "Resource Server Maintenance",
          name: "Resource Server Name",
          domainName: "Identity Domain",
          code: "Resource Server Code",
          confirm: "Confirm",
          back: "Back",
          cancel: "Cancel",
          scopes: "Scopes",
          scopeName: "Scope Name",
          scopeDesc: "Scope Description",
          description: "Resource Server Description",
          definition: "Resource Server Definition",
          review: "Review",
          reviewText: "You initiated a request for Resource Server. Please review details before you confirm!",
          reviewwarning: "Warning",
          cancelMessage: "Are you sure you want to cancel the operation?",
          yes: "Yes",
          no: "No",
          ok: "Ok"
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

  return new ResourceServerReviewLocale();
});