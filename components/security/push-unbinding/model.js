define(["baseService"], function(BaseService) {
  "use strict";

  const AccontSnapshotModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getDeviceCount: function() {
        const options = {
          url: "mobileClient/registeredPushToken"
        };

        return baseService.fetch(options);
      },
      unregisterDevices: function(osType) {
        const options = {
          url: "mobileClient/pushToken/os/{osType}"
        };

        return baseService.remove(options, {
          osType: osType
        });
      }
    };
  };

  return new AccontSnapshotModel();
});