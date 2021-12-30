define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/offline-notification"
], function (ko, $, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.locale = locale;
    self.isOffline = ko.observable(false);

    let timeout = null;

    rootParams.baseModel.addEvent("client-is-offline", {
      element: window,
      eventName: "offline",
      eventHandler: function () {
        self.isOffline(true);
        ko.tasks.runEarly();
        $("div.offline-notification").removeClass("flip-down slide-and-resize");
        $("div.offline-notification").addClass("flip-down");

        timeout = setTimeout(function () {
          document.querySelector(".offline-notification__message").click();
        }, 5000);
      }
    });

    rootParams.baseModel.addEvent("client-is-online", {
      element: window,
      eventName: "online",
      eventHandler: function () {
        clearTimeout(timeout);

        $("div.offline-notification").fadeOut("slow", function () {
          self.isOffline(false);
        });
      }
    });

    self.dismiss = function (lastUpdatedTime) {
      clearTimeout(timeout);
      $("div.offline-notification a").remove();
      $("div.offline-notification").addClass("slide-and-resize");

      $("div.offline-notification div").html(lastUpdatedTime);
    };
  };
});