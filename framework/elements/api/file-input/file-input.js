define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/generic",
  "ojs/ojknockout"
], function(ko, $, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.upload = rootParams.upload;
    self.locale = locale;
    self.id = ko.observable(rootParams.id);

    $(".input-file").each(function() {
      const $input = $(this),
        $label = $input.next("label"),
        labelVal = $label.html();

      $input.on("change", function(e) {
        let fileName = "";

        if (this.files && this.files.length > 1) {
          fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
        } else if (e.target.value) {
          fileName = e.target.value.split("\\").pop();
        }

        if (fileName) {
          $label.html(fileName);
        } else {
          $label.html(labelVal);
        }
      });

      $input.on("focus", function() {
        $input.addClass("has-focus");
      }).on("blur", function() {
        $input.removeClass("has-focus");
      });
    });
  };
});
