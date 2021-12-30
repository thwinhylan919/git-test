define([
    "ojL10n!resources/nls/application-message-create",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.reviewData = params.rootModel.params;
        self.confirm = params.rootModel.params.confirm;

        (function (extensionObject) {
            extensionObject.isSet = true;
            extensionObject.reviewData = params.rootModel.params;
            extensionObject.resourceBundle = true;
            extensionObject.successMessage = "";
            extensionObject.statusMessages = "";
            extensionObject.taskCode = self.reviewData.taskCode;

            extensionObject.confirmScreenMsgEval = function (_jqXHR, txnName, status, referenceNo, hostReferenceNo) {
                return params.baseModel.format(resourceBundle.confirmationMsg[status], {
                    txnName: txnName,
                    referenceNo: referenceNo,
                    hostReferenceNo: hostReferenceNo
                });
            };
        }(params.rootModel.params.confirmScreenExtensions));
    };
});