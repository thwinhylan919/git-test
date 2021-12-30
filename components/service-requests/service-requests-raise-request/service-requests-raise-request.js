define(["ojL10n!resources/nls/service-requests-configuration",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojradioset"
], function (ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.serviceRequest.raiseNewHeader);
    self.categoryHandle = rootParams.rootModel.params.categoryHandle;
    self.refreshSRList = rootParams.rootModel.params.refreshSRList;
    self.SRCategoryList = rootParams.rootModel.params.SRCategoryList;
    self.callView = rootParams.rootModel.params.callView;
  };
});