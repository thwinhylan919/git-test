define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/location-read",
  "ojs/ojcheckboxset"
], function (ko, $, LocationReadModel, locale) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = locale;
    params.dashboard.headerName(self.nls.headings.transactionName);
    params.baseModel.registerComponent("location-update", "location-maintenance");
    params.baseModel.registerElement("action-header");
    params.baseModel.registerElement("row");
    params.baseModel.registerElement("confirm-screen");
    self.atmBranchName = ko.observable();
    self.id = ko.observable();
    self.latitude = ko.observable();
    self.longitude = ko.observable();
    self.postalAddress = ko.observable();
    self.operatingHrs = ko.observable();
    self.phoneNo = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.supportedServices = ko.observableArray();
    self.selectedServices = ko.observableArray();
    self.hrsFrom = ko.observable();
    self.hrsTo = ko.observable();
    self.startDay = ko.observable();
    self.endDay = ko.observable();
    self.hoursSelectedFrom = ko.observable();
    self.hoursSelectedTo = ko.observable();
    self.weekendStartDay = ko.observable();
    self.weekendEndDay = ko.observable();
    self.version = ko.observable();
    self.supportedServicesLoaded = ko.observable(false);
    self.workHrs = ko.observable();
    self.weekendWorkHrs = ko.observable();
    self.workingDays = ko.observable();
    self.weekendDays = ko.observable();
    self.showAddInfo = ko.observable();
    self.type = ko.observable();

    if (self.transactionDetails && self.transactionDetails.transactionSnapshot) {
            self.locationDetails = ko.observable(self.transactionDetails);
            self.type = ko.observable();

            if (self.transactionDetails.transactionName === "LO_ATM_DE") {
                self.locationDetails().type = "ATM";
                self.locationDetails().id = self.transactionDetails.transactionSnapshot.id;
            }
        }

    LocationReadModel.fetchSupportedServices(self.locationDetails().type).done(function (data) {
      self.supportedServices(data.serviceDTOs);
      self.supportedServicesLoaded(true);
    });

    if (self.locationDetails().type === "BRANCH") {
      self.type("BRANCH");

      LocationReadModel.fetchBranchDetails(self.locationDetails().id).done(function (data) {
        self.id(data.branchDTO.id);
        self.latitude(data.branchDTO.geoCoordinate.latitude);
        self.longitude(data.branchDTO.geoCoordinate.longitude);
        self.atmBranchName(data.branchDTO.name);
        self.postalAddress(data.branchDTO.postalAddress);
        self.workHrs(data.branchDTO.workTimings[0]);
        self.weekendWorkHrs(data.branchDTO.workTimings[1]);
        self.workingDays(data.branchDTO.workDays[0]);
        self.weekendDays(data.branchDTO.workDays[1]);
        self.showAddInfo(data.branchDTO.additionalDetails[0]);

        const strDays = self.workingDays();

        self.startDay([strDays.substring(0, strDays.indexOf("-"))]);
        self.endDay([strDays.substring(strDays.indexOf("-") + 1)]);

        const strHours = self.workHrs();

        self.hrsFrom([strHours.substring(0, strHours.indexOf("-"))]);
        self.hrsTo([strHours.substring(strHours.indexOf("-") + 1)]);

        if (self.weekendDays() !== null) {
          const strAdditionalDays = self.weekendDays();

          if (self.weekendDays().indexOf("-") !== -1) {
            self.weekendStartDay([strAdditionalDays.substring(0, strAdditionalDays.indexOf("-"))]);
            self.weekendEndDay([strAdditionalDays.substring(strAdditionalDays.indexOf("-") + 1)]);
          } else {
            self.weekendStartDay([self.weekendDays()]);
            self.weekendEndDay([self.weekendDays()]);
          }

          const strAdditionalHours = self.weekendWorkHrs();

          self.hoursSelectedFrom([strAdditionalHours.substring(0, strAdditionalHours.indexOf("-"))]);
          self.hoursSelectedTo([strAdditionalHours.substring(strAdditionalHours.indexOf("-") + 1)]);
        }

        self.operatingHrs(data.branchDTO.workTimings[0] + self.nls.fieldname.to + data.branchDTO.workTimings[1]);

        if (data.branchDTO.branchPhone[1].number) { self.phoneNo(data.branchDTO.branchPhone[0].number + "," + data.branchDTO.branchPhone[1].number); }
        else { self.phoneNo(data.branchDTO.branchPhone[0].number); }

        self.version(data.branchDTO.version);

        ko.utils.arrayForEach(data.branchDTO.supportedServices, function (item) {
          self.selectedServices.push(item.name);
        });

        self.dataLoaded(true);
      });
    } else if (self.locationDetails().type === "ATM") {
      self.type("ATM");

      LocationReadModel.fetchATMDetails(self.locationDetails().id).done(function (data) {
        self.id(data.atmLocatorDTO.id);
        self.atmBranchName(data.atmLocatorDTO.name);
        self.latitude(data.atmLocatorDTO.geoCoordinate.latitude);
        self.longitude(data.atmLocatorDTO.geoCoordinate.longitude);
        self.postalAddress(data.atmLocatorDTO.postalAddress);
        self.version(data.atmLocatorDTO.version);

        ko.utils.arrayForEach(data.atmLocatorDTO.supportedServices, function (item) {
          self.selectedServices.push(item.name);
        });

        self.dataLoaded(true);
      });
    }

    self.backOnView = function () {
      params.dashboard.loadComponent("location-search", {});
    };

    self.edit = function () {
      const context = {};

      context.showAddInfo = self.showAddInfo;
      context.hrsFrom = self.hrsFrom;
      context.hrsTo = self.hrsTo;
      context.startDay = self.startDay;
      context.endDay = self.endDay;
      context.hoursSelectedFrom = self.hoursSelectedFrom;
      context.hoursSelectedTo = self.hoursSelectedTo;
      context.weekendStartDay = self.weekendStartDay;
      context.weekendEndDay = self.weekendEndDay;
      context.payload = self.payload;
      context.alternatephoneNo = self.alternatephoneNo;
      context.addline3 = self.addline3;
      context.addline4 = self.addline4;
      context.postalAddress = self.postalAddress;
      context.type = self.type;
      context.atmBranchName = self.atmBranchName;
      context.latitude = self.latitude;
      context.longitude = self.longitude;
      context.countryEnumsLoaded = self.countryEnumsLoaded;
      context.countryEnums = self.countryEnums;
      context.id = self.id;
      context.supportedServicesLoaded = self.supportedServicesLoaded;
      context.supportedServices = self.supportedServices;
      context.selectedServices = self.selectedServices ;
      context.version = self.version;
      context.phoneNo = self.phoneNo;
      context.locationDetails = self.locationDetails;

      params.dashboard.loadComponent("location-update",context);
    };

    self.showModalWindow = function () {
      $("#deleteLocation").trigger("openModal");
    };

    self.hideModalWindow = function () {
      $("#deleteLocation").hide();
    };

    self.deleteLocation = function () {
      let locationType = "";

      if (self.locationDetails().type === "BRANCH") { locationType = "branches"; }
      else if (self.locationDetails().type === "ATM") { locationType = "atms"; }

      LocationReadModel.deleteLocation(locationType, self.locationDetails().id).done(function (data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.headings.transactionName
        });
      });
    };

    self.renderTimings = function () {
      let timings = "";

      timings = self.workingDays() + ":" + self.workHrs();

      return timings;
    };

    self.renderWeekendTimings = function () {
      if (self.weekendDays() !== null) {
        let timings = "";

        timings = self.weekendDays() + ":" + self.weekendWorkHrs();

        return timings;
      }
    };
  };
});
