define(["baseService"], function (BaseService) {
  "use strict";

  const AccontSnapshotModel = function () {
    const baseService = BaseService.getInstance();

    return {
      getDeviceCount: function () {
        const options = {
          url: "mobileClient/registeredPushToken"
        };

        return baseService.fetch(options);
      },
      unregisterDevices: function (osType) {
        const options = {
          url: "mobileClient/pushToken/os/{osType}"
        };

        return baseService.remove(options, {
          osType: osType
        });
      },
      getPreference: function () {
        return baseService.fetch({
          url: "me/preferences?userID"
        });
      },
      updatePreference: function (payload) {
        return baseService.update({
          url: "me/preferences",
          data: payload
        });
      }
    };
  };

  return new AccontSnapshotModel();
});