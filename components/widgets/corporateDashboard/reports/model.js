  define([
    "baseService"
  ], function (BaseService) {
    "use strict";

    const Reports = function () {
      const baseService = BaseService.getInstance();

      return {
        listReportHistory: function (userType) {
          const options = {
              url: "reports/reportProcessHistory?pageSize=6&pageNo=1&reportType={userType}",
              mockedUrl: "framework/json/design-dashboard/corporateDashboard/reports.json"
            },
            params = {
              userType: userType
            };

          return baseService.fetchWidget(options, params);
        },
        downloadReport: function (reportReqId) {
          const options = {
              url: "reports/reportProcessHistory/{reportRequestId}"
            },
            params = {
              reportRequestId: reportReqId
            };

          return baseService.fetch(options, params);
        }
      };
    };

    return new Reports();
  });