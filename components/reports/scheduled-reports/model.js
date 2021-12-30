define(["baseService"], function(BaseService) {
  "use strict";

  const ScheduledReportModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getListData: function(selectedreportType, userType) {
        let options;

        if (userType === "CORP") {
          options = {
            url: "reports/reportRequest?pageNo=1&pageSize=10&reportType=U&locale=en-US&reportId={selectedreportType}"
          };

          return baseService.fetch(options, {
            selectedreportType: selectedreportType
          });
        }

        options = {
          url: "reports/reportRequest?pageNo=1&pageSize=10&reportType=A&locale=en-US&reportId={selectedreportType}"
        };

        return baseService.fetch(options, {
          selectedreportType: selectedreportType
        });
      },
      getAllListData: function(userType) {
        let options;

        if (userType === "CORP") {
          options = {
            url: "reports/reportRequest?pageNo=1&pageSize=10&reportType=U"
          };

          return baseService.fetch(options);
        }

        options = {
          url: "reports/reportRequest?pageNo=1&pageSize=10&reportType=A"
        };

        return baseService.fetch(options);
      },
      getReportTypes: function(userType) {
        let options;

        if (userType === "CORP") {
          options = {
            url: "reports/reportDefinition/userReports"
          };

          return baseService.fetch(options);
        }

        options = {
          url: "reports/reportDefinition/adminReports"
        };

        return baseService.fetch(options);
      },
      getSelectedReportIdDetails: function(reportIdentifierId) {
        const options = {
          url: "reports/reportRequest/{reportIdentifierId}"
        };

        return baseService.fetch(options, {
          reportIdentifierId: reportIdentifierId
        });
      }
    };
  };

  return new ScheduledReportModel();
});