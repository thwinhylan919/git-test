define(["baseService"], function (BaseService) {
  "use strict";

  const Model = function () {
    const baseService = BaseService.getInstance();

    return {
      programGet: function (programCode, role) {
        const params = {
            programCode: programCode,
            role: role
          },
          options = {
            url: "/supplyChainFinance/programs/{programCode};role={role}",
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
      disbursementModeGet: function () {
        const params = {},
          options = {
            url: "/scfApplicationParams?key=DISBURSEMENT_MODE",
            version: "ext/v1"
          };

        return baseService.fetch(options, params);
      },
      invoiceget: function (grouping, queryParameter, sortByParameter, count) {
        const params = {
            grouping: grouping,
            queryParameter: queryParameter,
            sortByParameter: sortByParameter,
            count: count
          },
          options = {
            url: "aggregator/resource/invoices?data=Amount&grouping={grouping}&q={queryParameter}&sortBy={sortByParameter}&maxRecords={count}",
            mockedUrl: "framework/json/design-dashboard/supply-chain-finance/top-programs-widget.json",
            version: "v1"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new Model();
});