define(["baseService"], function(BaseService) {
  "use strict";

  const BannerModel = function() {
    const baseService = BaseService.getInstance(),

     dismiss = function(payload, id) {
      const params = {
          mapId: id
        },
        options = {
          url: "mailbox/mailers/{mapId}",
          data: payload
        };

      baseService.update(options, params);
    };

    /**
     * Fetches banner information
     * @type {Array} array list
     */
    return {
      fetchData: function() {
        return baseService.fetch({
          url: "mailbox/mailers?isBanner=true"
        });
      },
      dismiss: function(payload, id) {
        dismiss(payload, id);
      }
    };
  };

  return new BannerModel();
});
