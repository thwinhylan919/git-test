define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const AccordionModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();
    let getGoalDetailsDeferred;
    const getGoalDetails = function(deferred) {
      const options = {
        url: "goals?status=ACTIVE",
        mockedUrl:"framework/json/design-dashboard/personal-finance-management/goals-dashboard-card.json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

        baseService.fetchWidget(options);

    };

    return {
      getGoalDetails: function() {
        getGoalDetailsDeferred = $.Deferred();
        getGoalDetails(getGoalDetailsDeferred);

        return getGoalDetailsDeferred;
      }
    };
  };

  return new AccordionModel();
});