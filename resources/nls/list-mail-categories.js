define([], function() {
  "use strict";

  const ListMailCategoriesLocale = function() {
    return {
      root: {
        fieldname: {
          mapAllSubjects: "All Subjects",
          subject: "Subjects"
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

  return new ListMailCategoriesLocale();
});