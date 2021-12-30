define(["baseService"], function(BaseService) {
    "use strict";

    const DashboardModel = function() {
        const baseService = BaseService.getInstance();

        return {
            fetchModules: function(className, classValue) {
                return baseService.fetch({
                    url: "dashboards/modules?class={class}&value={classValue}"
                }, {
                    class: className,
                    classValue: classValue
                });
            }
        };
    };

    return new DashboardModel();
});