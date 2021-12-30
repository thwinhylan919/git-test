define([], function() {
  "use strict";

  const CommentBoxLocale = function() {
    return {
      root: {
        charactersLeft: "{number} Characters Left",
        commentRequired: "Comment is required."
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new CommentBoxLocale();
});