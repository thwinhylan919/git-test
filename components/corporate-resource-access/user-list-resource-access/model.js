define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            usersgetCall: function (username, partyId, firstName, lastName, mobileNumber, emailId, isAccessSetupCheckRequired, userGroup, userType, passwordGenerationType, passwordGenerationFromDate, pswdGenerationToDate, isUserPasswordPrint) {
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
            }
        };
    };

    return new Model();
});