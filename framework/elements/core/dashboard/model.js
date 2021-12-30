define(["baseService"], function(BaseService) {
    "use strict";

    const DashboardModel = function() {
        const baseService = BaseService.getInstance();

        return {
            fetchPartyDetails: function() {
                return baseService.fetch({
                    url: "me/party",
                    showMessage: false
                });
            },
            getTaxonomyDefinition: function(dto, serviceName) {
                return baseService.fetch({
                    url: "taxonomy?dtoName={dtoName}&serviceName={serviceName}"
                }, {
                    dtoName: dto,
                    serviceName: serviceName
                });
            }
        };
    };

    return new DashboardModel();
});