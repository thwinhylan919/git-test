define([
    "knockout",
    "framework/js/configurations/config"
], function(ko, Configuration) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        function getProfileData() {
            window.IN.API.Profile("me").fields([
                "firstName",
                "lastName",
                "headline",
                "positions:(company,title,summary,startDate,endDate,isCurrent)",
                "industry",
                "location:(name,country:(code))",
                "pictureUrl",
                "publicProfileUrl",
                "emailAddress",
                "educations"
            ]).result(function(result) {
                if (self.callback) {
                    self.callback(result);
                }

                window.IN.User.logout();
            });
        }

        if (!rootParams.baseModel.small()) {
            require([Configuration.thirdPartyAPIs.linkedin.sdkURL], function() {
                window.IN.init({
                    api_key: Configuration.thirdPartyAPIs.linkedin.apiKey,
                    authorize: false
                });
            });
        }

        self.linkedinLogin = function() {
            window.IN.User.authorize(getProfileData);
        };
    };
});