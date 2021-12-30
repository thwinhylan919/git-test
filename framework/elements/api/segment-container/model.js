define(["baseService"], function (BaseService) {
    "use strict";

    const SegmentContainerModel = function () {
      const baseService = BaseService.getInstance();

      return {
        postDraftData : function (options) {
          return baseService.add(options);
        }
      };
    };

    return new SegmentContainerModel();
  });