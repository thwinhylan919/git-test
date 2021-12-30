define([
], function() {
  "use strict";

  const LocationUpdateModel = function() {
    const
      Model = function() {
        this.atmPayload = {
          id: "",
          name: "",
          bankCode: "",
          postalAddress: "",
          supportedServices: [],
          type: "ATM",
          version: "",
          geoCoordinate: {
            latitude: 0,
            longitude: 0
          }
        };

        this.branchPayload = {
          id: "",
          name: "",
          bankCode: "",
          postalAddress: "",
          workTimings: [],
          workDays: [],
          branchPhone: [],
          supportedServices: [],
          version: "",
          type: "BRANCH",
          geoCoordinate: {
            latitude: 0,
            longitude: 0
          },
          additionalDetails: []
        };

        this.address = {
          postalAddress: {
            line1: "",
            line2: "",
            line3: "",
            line4: "",
            city: "",
            country: ""
          }
        };
      };

    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new LocationUpdateModel();
});