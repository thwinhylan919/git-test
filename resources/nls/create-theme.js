define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/theme-labels"], function(Generic, ThemeLabels) {
  "use strict";

  const CreateThemeLocale = function() {
    return {
      root: {
        update: "Update",
        fileInvalid: "No file selected for upload",
        fontInvalid: "Invalid Font",
        reset: "Reset",
        preview:"Preview",
        fileSelection: "File selected: {fileName}",
        navBarDescription: "Color Selection Method",
        themeTransaction: "New Brand Creation",
        updateTransaction: "Brand Update",
        zipMissing:"Asset File is not updated. Do you want to continue?",
        generic: Generic,
        heading: ThemeLabels.heading,
        labels: ThemeLabels.labels
      },
      ar: false,
      fr: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new CreateThemeLocale();
});