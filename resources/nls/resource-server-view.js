define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ResourceServerViewLocale = function() {
    return {
      root: {
        resourceServerView: {
          resoureServerMt: "Resource Server Maintenance",
          name: "Resource Server Name",
          domainName: "Identity Domain",
          description: "Resource Server Description",
          details: "Resource Server Definition",
          scopes: "Scopes",
          scopeName: "Scope Name",
          scopeDesc: "Scope Description",
          edit: "Edit",
          back: "Back",
          cancel: "Cancel",
          reviewwarning: "Warning",
          cancelMessage: "Are you sure you want to cancel the operation?",
          yes: "Yes",
          no: "No"
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

  return new ResourceServerViewLocale();
});