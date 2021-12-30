define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/location-update",
    "framework/js/configurations/config",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojvalidation",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function(oj, ko, $, LocationUpdateModel, locale, Configuration) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel.params);
        self.nls = locale;

        require([Configuration.thirdPartyAPIs.googleMap.sdkURL], function() {
            const input = document.getElementById("pac-input"),
                autocomplete = new google.maps.places.Autocomplete(input),
                infowindow = new google.maps.InfoWindow(),
                infowindowContent = document.getElementById("infowindow-content");

            infowindow.setContent(infowindowContent);

            autocomplete.addListener("place_changed", function() {
                infowindow.close();

                const place = autocomplete.getPlace();

                self.latitude(place.geometry.location.lat().toFixed(7));
                self.longitude(place.geometry.location.lng().toFixed(7));
                $("#searchLocation").hide();

                if (!place.geometry) {
                    return false;
                }
            });
        });

        params.dashboard.headerName(self.nls.headings.transactionName);
        params.baseModel.registerElement("action-header");
        params.baseModel.registerElement("row");
        params.baseModel.registerComponent("location-search", "location-maintenance");
        params.baseModel.registerComponent("review-location-update", "location-maintenance");
        self.hours = ko.observableArray();
        self.days = ko.observableArray();
        self.validationTracker = ko.observable();
        self.showAddInfo = params.rootModel.params.showAddInfo ? params.rootModel.params.showAddInfo : ko.observable([self.showAddInfo()]);
        self.selectedFrom = params.rootModel.params.hrsFrom ? params.rootModel.params.hrsFrom : ko.observable([self.hrsFrom()]);
        self.selectedTo = params.rootModel.params.hrsTo ? params.rootModel.params.hrsTo : ko.observable([self.hrsTo()]);
        self.startDay = params.rootModel.params.startDay ? params.rootModel.params.startDay : ko.observable([self.startDay()]);
        self.endDay = params.rootModel.params.endDay ? params.rootModel.params.endDay : ko.observable([self.endDay()]);
        self.hoursSelectedFrom = self.hoursSelectedFrom ? params.rootModel.params.hoursSelectedFrom : ko.observable([self.hoursSelectedFrom()]);
        self.hoursSelectedTo = self.hoursSelectedTo ? params.rootModel.params.hoursSelectedTo : ko.observable([self.hoursSelectedTo()]);
        self.weekendStartDay = self.weekendStartDay ? params.rootModel.params.weekendStartDay : ko.observable([self.weekendStartDay()]);
        self.weekendEndDay = self.weekendEndDay ? params.rootModel.params.weekendEndDay : ko.observable([self.weekendEndDay()]);
        self.payload = params.rootModel.params.payload ? params.rootModel.params.payload : ko.observable();
        self.alternatephoneNo = params.rootModel.params.alternatephoneNo ? params.rootModel.params.alternatephoneNo : ko.observable();
        self.preparedSelectedServices = ko.observableArray();
        self.constructedPhoneNum = ko.observableArray();
        self.addline3 = params.rootModel.params.addline3 ? params.rootModel.params.addline3 : ko.observable(self.postalAddress().line3);
        self.addline4 = params.rootModel.params.addline4 ? params.rootModel.params.addline4 : ko.observable(self.postalAddress().line4);

        function preparePhoneNum(phoneNum) {
            if (phoneNum !== undefined) {

              self.constructedPhoneNum([]);

              for (let i = 0; i < phoneNum.length; i++) {
                const phoneObj = {
                  areaCode: "",
                  extension: "",
                  number: ""
                };

                phoneObj.number = phoneNum[i];
                self.constructedPhoneNum.push(phoneObj);
              }

              self.phoneNo(self.constructedPhoneNum()[0].number);

              if (phoneNum.length > 1) {
                self.alternatephoneNo(self.constructedPhoneNum()[1].number);
              }
            }
          }

        let back;

        if (self.back) {
            back = self.back();
        } else { back = false; }

        for (let i = 0; i < 24; i++) {
            const obj = {
                value: ""
            };

            obj.value = i.toFixed(2);
            self.hours.push(obj);
        }

        for (let a = 0; a < 7; a++) {
            self.days.push({
                value: oj.LocaleData.getDayNames("abbreviated")[a]
            });
        }

        const newModel = function() {
            const KoModel = LocationUpdateModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.showAdditionalTimings = ko.observable(false);

        self.additionalTimings = function() {
            self.showAdditionalTimings(true);
        };

        self.searchLocation = function() {
            document.getElementById("pac-input").value = "";
            $("#searchLocation").trigger("openModal");
        };

        self.backOnUpdate = function() {
            params.dashboard.loadComponent("location-read", {
                locationDetails: self.locationDetails
            });
        };

        if (!back) {
            if (self.type() === "ATM") {
                self.payload(newModel().atmPayload);
            } else {
                preparePhoneNum([self.phoneNo(), self.alternatephoneNo()]);
                self.payload(newModel().branchPayload);
            }
        }

        self.save = function() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            self.payload().id = self.id();

            if (typeof self.postalAddress().country === "object") {
                self.postalAddress().country = self.postalAddress().country[0];
            }

            self.postalAddress().line3 = self.addline3();
            self.postalAddress().line4 = self.addline4();
            self.payload().postalAddress(self.postalAddress());

            ko.utils.arrayForEach(self.selectedServices(), function(item) {
                ko.utils.arrayForEach(self.supportedServices(), function(serviceItem) {
                    if (item === serviceItem.name) {
                        self.preparedSelectedServices.push(serviceItem);
                    }
                });
            });

            self.payload().geoCoordinate.latitude = self.latitude();
            self.payload().geoCoordinate.longitude = self.longitude();
            self.payload().name = self.atmBranchName();
            self.payload().supportedServices(self.preparedSelectedServices());
            self.payload().version = self.version();

            if (self.type() !== "ATM") {
                self.payload().additionalDetails()[0] = self.showAddInfo();
                self.payload().additionalDetails()[1] = null;

                if (self.alternatephoneNo() === undefined) { self.alternatephoneNo(""); }

                preparePhoneNum([self.phoneNo(), self.alternatephoneNo()]);
                self.payload().workTimings()[0] = self.selectedFrom() + "-" + self.selectedTo();
                self.payload().workDays()[0] = self.startDay() + "-" + self.endDay();

                if (self.hoursSelectedFrom()) {
                  if (self.hoursSelectedFrom()[0] || self.hoursSelectedTo()[0]) {
                    self.payload().workTimings()[1] = self.hoursSelectedFrom() + "-" + self.hoursSelectedTo();
                  } else {
                        self.payload().workTimings()[1] = null;
                    }
                } else {
                    self.payload().workTimings()[1] = null;
                }

                if (self.weekendStartDay()) {
                    if (self.weekendStartDay()[0] || self.weekendEndDay()[0]) {
                        if (self.weekendStartDay()[0] === self.weekendEndDay()[0] || (self.weekendStartDay()[0] !== null && self.weekendEndDay()[0] === undefined)) {
                            self.payload().workDays()[1] = self.weekendStartDay()[0];
                        } else {
                            self.payload().workDays()[1] = self.weekendStartDay()[0] + "-" + self.weekendEndDay()[0];
                        }
                    } else {
                        self.payload().workDays()[1] = null;
                    }
                } else {
                    self.payload().workDays()[1] = null;
                }

                self.payload().branchPhone(self.constructedPhoneNum());
            }

            const context = {};

            context.updateData = self.payload();
            context.supportedServicesLoaded = self.supportedServicesLoaded;
            context.supportedServices = self.supportedServices;
            context.selectedServices = self.selectedServices;
            context.id = self.id;
            context.showAddInfo = self.showAddInfo;
            context.hrsFrom = self.hrsFrom;
            context.hrsTo = self.hrsTo;
            context.startDay = self.startDay;
            context.endDay = self.endDay;
            context.hoursSelectedFrom = self.hoursSelectedFrom;
            context.hoursSelectedTo = self.hoursSelectedTo;
            context.weekendStartDay = self.weekendStartDay;
            context.weekendEndDay = self.weekendEndDay;
            context.alternatephoneNo = self.alternatephoneNo;
            context.addline3 = self.addline3;
            context.addline4 = self.addline4;
            context.type = self.type;
            context.phoneNo = self.phoneNo;
            context.postalAddress = self.postalAddress;
            context.atmBranchName = self.atmBranchName;
            context.latitude = self.latitude;
            context.longitude = self.longitude;
            context.countryEnumsLoaded = self.countryEnumsLoaded;
            context.countryEnums = self.countryEnums;
            context.id = self.id;
            context.supportedServicesLoaded = self.supportedServicesLoaded;
            context.supportedServices = self.supportedServices;
            context.selectedServices = self.selectedServices;
            context.version = self.version;
            context.locationDetails = self.locationDetails;
            params.dashboard.loadComponent("review-location-update", context);
        };

    };
});