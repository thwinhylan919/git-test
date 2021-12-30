define([], function() {
  "use strict";

  const ChatBotLocale = function() {
    return {
      root: {
        chatbot: {
          geoLocation: "Geo location is not supported by this browser",
          hi: "Hi",
          typeMessage: "Type a message",
          ok: "Ok",
          filmStrip: "Film Strip",
          notSupported: "Not Supported",
          listView: "List View",
          welcomeMessage: "Hi",
          chatbotHeader: "Zibo"
        }
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

  return new ChatBotLocale();
});
