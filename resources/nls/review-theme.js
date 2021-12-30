define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/theme-labels"], function(Generic, ThemeLabels) {
  "use strict";

  const ReviewThemeLocale = function() {
    return {
      root: {
        generic: Generic,
        heading: ThemeLabels.heading,
        labels: ThemeLabels.labels,
        btns: {
          applyTheme: "Apply Brand",
          update: "Update"
        },
        themeTransaction: "Create New Brand",
        reviewBrand: "Review brand before you confirm!",
        fonturl: "Font URL",
        fontfamily: "Font Family",
        deleteThemeTransaction: "Delete Brand",
        deleteConfirmationMessage: "Are you sure you want to delete an active brand?<br/>Deleting an active brand will revert the application to factory theme.",
        headerName: "Brand Details",
        updateTransaction:"Update Brand",
        isAvailableForSelection: "Available",
        isNotAvailableForSelection: "Not available"
      },
      ar: true,
      fr: true,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new ReviewThemeLocale();
});