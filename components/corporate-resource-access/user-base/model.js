define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            usersget: function (username, partyId, firstName, lastName, mobileNumber, emailId, isAccessSetupCheckRequired, userGroup, userType, passwordGenerationType, passwordGenerationFromDate, pswdGenerationToDate, isUserPasswordPrint) {
                const params = {
                        username: username,
                        partyId: partyId,
                        firstName: firstName,
                        lastName: lastName,
                        mobileNumber: mobileNumber,
                        emailId: emailId,
                        isAccessSetupCheckRequired: isAccessSetupCheckRequired,
                        userGroup: userGroup,
                        userType: userType,
                        passwordGenerationType: passwordGenerationType,
                        passwordGenerationFromDate: passwordGenerationFromDate,
                        pswdGenerationToDate: pswdGenerationToDate,
                        isUserPasswordPrint: isUserPasswordPrint
                    },
                    options = {
                        url: "/users?username={username}&partyId={partyId}&firstName={firstName}&lastName={lastName}&mobileNumber={mobileNumber}&emailId={emailId}&isAccessSetupCheckRequired={isAccessSetupCheckRequired}&userGroup={userGroup}&userType={userType}&passwordGenerationType={passwordGenerationType}&passwordGenerationFromDate={passwordGenerationFromDate}&pswdGenerationToDate={pswdGenerationToDate}&isUserPasswordPrint={isUserPasswordPrint}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            createUserAttributeAccess: function (userId, payload) {
                const params = {
                        userId: userId
                    },
                    options = {
                        url: "users/{userId}/attributeAccess",
                        version: "v1",
                        data: payload
                    };

                return baseService.add(options, params);
            },
            updateUserAttributeAccess: function (accessId, userId, payload) {
                const params = {
                        userId: userId,
                        accessId: accessId
                    },
                    options = {
                        url: "users/{userId}/attributeAccess/{accessId}",
                        version: "v1",
                        data: payload
                    };

                return baseService.update(options, params);
            },
            readUserAttributeAccess: function (userId, partyId, module) {
                const params = {
                        userId: userId,
                        partyId: partyId,
                        module: module
                    },
                    options = {
                        url: "users/{userId}/attributeAccess?module={module}&partyId={partyId}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});