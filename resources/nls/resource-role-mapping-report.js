define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ResourceRoleMappingLocale = function() {
    return {
      root: {
        resourceRoleMapping: {
          childRole: "Child Role",
          select: "Select"
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

  return new ResourceRoleMappingLocale();
});