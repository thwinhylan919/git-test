define([
    "knockout"
    ], function(ko, logger) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);

    const dummyFunction = function() {
      logger.log("dummyFunction");
    };

    self.apiMap = {
      USER_PROFILE: {
        url: "me",
        fields: "name, first_name,last_name,email,gender",
        scope: [
          "public_profile",
          "email"
        ]
      },
      USER_FRIENDS: {
        url: "me/friends",
        fields: "name,id,picture,first_name,last_name",
        scope: [
          "public_profile",
          "email",
          "user_friends"
        ]
      }
    };

    self.currentAPI = self.customAPI ? self.customAPI : self.apiMap[self.api];

    self.checkLoginState = function() {
      window.facebookConnectPlugin.getLoginStatus(function(response) {
        if (response.status === "connected") {
          self.callFBApi();
        } else {
          self.login();
        }
      }, function() {
        self.login();
      });
    };

    self.login = function() {
      window.facebookConnectPlugin.login(self.currentAPI.scope, function() {
        self.callFBApi();
      }, dummyFunction);
    };

    self.callFBApi = function() {
      let url = self.currentAPI.url;
      const fields = self.currentAPI.fields;

      url = url + "?fields=" + fields;

      window.facebookConnectPlugin.api(url, self.currentAPI.scope, function(result) {
        if (self.callback)
          {self.callback(result);}
      }, dummyFunction);
    };

    if (self.autoLogin)
      {self.checkLoginState();}
  };
});