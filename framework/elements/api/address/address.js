define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/address",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function (ko, AddressModel, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.locale = locale;
    self.address = rootParams.address;
    self.label = rootParams.label || self.locale.deliveryLocation;

    self.deliverAt = [{
      id: "BRN",
      label: self.locale.address.branch
    }, {
      id: "ACC",
      label: self.locale.address.address
    }];

    self.listOfCities = ko.observableArray();
    self.listOfBranches = ko.observableArray();
    self.selectedCity = ko.observable();
    self.addressToDisplay = ko.observableArray();
    self.localAddressList = ko.observableArray();
    self.selectedLocalAddress = ko.observable();
    self.showBranchSelection = ko.observable(false);

    function setAddress(target, source) {
      Object.keys(target).forEach(function (key) {
        target[key](ko.utils.unwrapObservable(source[key]));
      });
    }

    function addressParser(source) {
      self.addressToDisplay.removeAll();
      ko.tasks.runEarly();

      Object.keys(source).forEach(function (key) {
        self.addressToDisplay.push(source[key]);
      });

      setAddress(self.address.address, source);
    }

    function fetchBranchAddress(branch) {
      return AddressModel.fetchBranchAddress(branch).then(function (branchAddress) {
        addressParser(branchAddress.addressDTO[0].branchAddress.postalAddress);
      });
    }

    function fetchBranches(city) {
      return AddressModel.fetchBranches(city).then(function (data) {
        self.listOfBranches.removeAll();
        ko.tasks.runEarly();
        self.listOfBranches(data.branchAddressDTO);

        return data.branchAddressDTO[0].id;
      });
    }

    function fetchCities() {
      return AddressModel.fetchCity().then(function (cityList) {
        self.listOfCities(cityList.cities);

        return self.listOfCities()[0];
      });
    }

    function fetchMyAddress() {
      return Promise.all([
        AddressModel.fetchMyAddress(),
        AddressModel.fetchMyAddressEnumeration()
      ]).then(function (values) {
        const enumerationLookup = {};

        values[1].enumRepresentations[0].data.forEach(function (element) {
          enumerationLookup[element.code] = element.description;
        });

        self.localAddressList.removeAll();

        values[0].party.addresses.forEach(function (address) {
          self.localAddressList.push({
            id: address.addressId,
            value: address.type,
            description: enumerationLookup[address.type],
            address: address.postalAddress
          });

          if(enumerationLookup[address.type] === "Postal"){
            addressParser(values[0].party.addresses[0].postalAddress);
          }
        });
      });
    }

    const deliveryLocationSubscription = ko.computed(function () {
      if (self.address.deliveryOption()) {
        if (self.address.deliveryOption() === "BRN") {
          self.address.addressType(null);
          fetchCities().then(fetchBranches).then(fetchBranchAddress);
          self.showBranchSelection(true);
        } else {
          fetchMyAddress();
          self.showBranchSelection(false);
        }
      }
    });

    self.cityChangeHandler = function (event) {
      if (event.detail.value && event.detail.trigger === "option_selected") {
        fetchBranches(event.detail.value).then(fetchBranchAddress);
      }
    };

    self.branchChangeHandler = function (event) {
      if (event.detail.value) {
        fetchBranchAddress(event.detail.value);
      }
    };

    self.myAddressChangeHandler = function (event) {
      if (event.target) {
        const address = self.localAddressList().filter(function (element) {
          return event.detail.value === element.value;
        })[0].address;

        addressParser(address);
      }
    };

    if (!self.address.deliveryOption()) {
      self.address.deliveryOption("BRN");
    }

    self.dispose = function () {
      deliveryLocationSubscription.dispose();
    };
  };
});