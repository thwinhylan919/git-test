define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payment-history",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox"
], function (oj, ko, $, PaymentHistoryModel, resourceBundle) {
    "use strict";

    const vm = function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.dashboard.headerName(self.resourceBundle.heading.paymentHistory);
        rootParams.baseModel.registerElement("search-box");
        rootParams.baseModel.registerElement("help");
        rootParams.baseModel.registerElement("date-box");
        rootParams.baseModel.registerElement("confirm-screen");
        self.dataLoaded = ko.observable(false);
        self.paymentsList = ko.observableArray();
        self.datasource = ko.observable();
        self.selectedPeriod = ko.observable("CPR");
        self.showDates = ko.observable(false);
        self.todayDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.minDate = ko.observable();
        self.searchValue = ko.observable();
        self.mediatypeLoaded = ko.observable(false);
        self.menuItems = ko.observableArray();
        self.mediaFormat = ko.observable();
        self.mediaTypeSelected = ko.observable();
        self.searchRefresh = ko.observable(true);
        self.maxDate = ko.observable();
        self.maxDate(self.todayDate);

        self.periods = [{
                key: "CPR",
                value: self.resourceBundle.dropDownValues.CPR
            },
            {
                key: "L1M",
                value: self.resourceBundle.dropDownValues.L1M
            },
            {
                key: "LQT",
                value: self.resourceBundle.dropDownValues.LQT
            },
            {
                key: "SPD",
                value: self.resourceBundle.dropDownValues.SPD
            }
        ];

        self.toDateChanged = function () {
            let date1 = new Date(self.toDate());

            date1.setDate(date1.getDate());
            date1.setHours(0, 0, 0, 0);
            date1 = oj.IntlConverterUtils.dateToLocalIso(date1);

            if (date1 && date1 !== self.todayDate) {
                self.maxDate(date1);
            } else {
                self.maxDate(self.todayDate);
            }
        };

        self.fromDateChanged = function () {
            let date2 = new Date(self.fromDate());

            date2.setDate(date2.getDate());
            date2.setHours(0, 0, 0, 0);
            date2 = oj.IntlConverterUtils.dateToLocalIso(date2);

            if (date2) {
                self.minDate(date2);
            }
        };

        self.periodChangedHandler = function (event) {
            if (event.detail.value === "SPD") {
                self.showDates(true);
            } else {
                self.showDates(false);
                self.maxDate(self.todayDate);
                self.minDate(null);
                self.fromDate(null);
                self.toDate(null);
                self.searchValue(null);

                PaymentHistoryModel.fetchPayments(self.selectedPeriod()).done(function (data) {
                    self.paymentsList.removeAll();
                    data.billPaymentDTOs = rootParams.baseModel.sortLib(data.billPaymentDTOs, ["paymentDate"], ["desc"]);

                    for (let i = 0; i < data.billPaymentDTOs.length; i++) {
                        self.paymentsList.push({
                            date: data.billPaymentDTOs[i].paymentDate,
                            billerName: data.billPaymentDTOs[i].billerName,
                            category: data.billPaymentDTOs[i].billerRegistration ? data.billPaymentDTOs[i].billerRegistration.category.name : data.billPaymentDTOs[i].category,
                            billAmount: rootParams.baseModel.formatCurrency(data.billPaymentDTOs[i].billAmount.amount, data.billPaymentDTOs[i].billAmount.currency),
                            referenceNo: data.billPaymentDTOs[i].id,
                            status: self.resourceBundle.paymentStatus[data.billPaymentDTOs[i].paymentStatus]
                        });
                    }

                    self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.paymentsList, {
                        idAttribute: "referenceNo"
                    })));
                });
            }
        };

        self.menuClose = function () {
            $("#mediaFormatLauncher").removeClass("bold");
        };

        self.tableColumns = [{
                headerText: self.resourceBundle.generic.common.date,
                field: "date",
                template: "date"
            },
            {
                headerText: self.resourceBundle.labels.biller,
                field: "billerName"
            },
            {
                headerText: self.resourceBundle.labels.category,
                field: "category"
            },
            {
                headerText: self.resourceBundle.labels.billAmount,
                field: "billAmount"
            },
            {
                headerText: self.resourceBundle.labels.referenceNo,
                field: "referenceNo"
            },
            {
                headerText: self.resourceBundle.labels.status,
                field: "status"
            }
        ];

        self.downloadStatement = function (event) {
            self.mediaFormat(event.target.value);

            const mediaType = self.menuItems().filter(function (obj) {
                return obj.value === event.target.value;
            })[0];

            if (mediaType) {
                self.mediaTypeSelected(mediaType.description);
            }

            if (self.mediaFormat() === "pdf") {
                $("#passwordDialog").trigger("openModal");
            }

            PaymentHistoryModel.downloadStatement(self.selectedPeriod(), self.fromDate(), self.toDate(), self.mediaTypeSelected(), self.mediaFormat());
        };

        PaymentHistoryModel.fetchMediaType().done(function (data) {
            self.mediatypeLoaded(false);

            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                if (data.enumRepresentations[0].data[i].code === "csv" || data.enumRepresentations[0].data[i].code === "pdf") {
                    self.menuItems.push({
                        text: data.enumRepresentations[0].data[i].code,
                        value: data.enumRepresentations[0].data[i].value,
                        description: data.enumRepresentations[0].data[i].description
                    });
                }
            }

            self.mediatypeLoaded(true);
        });

        PaymentHistoryModel.fetchPayments(self.selectedPeriod()).done(function (data) {
            self.paymentsList.removeAll();
            data.billPaymentDTOs = rootParams.baseModel.sortLib(data.billPaymentDTOs, ["paymentDate"], ["desc"]);

            for (let i = 0; i < data.billPaymentDTOs.length; i++) {
                self.paymentsList.push({
                    date: data.billPaymentDTOs[i].paymentDate,
                    billerName: data.billPaymentDTOs[i].billerName,
                    category: data.billPaymentDTOs[i].billerRegistration ? data.billPaymentDTOs[i].billerRegistration.category.name : data.billPaymentDTOs[i].category,
                    billAmount: rootParams.baseModel.formatCurrency(data.billPaymentDTOs[i].billAmount.amount, data.billPaymentDTOs[i].billAmount.currency),
                    referenceNo: data.billPaymentDTOs[i].id,
                    status: self.resourceBundle.paymentStatus[data.billPaymentDTOs[i].paymentStatus]
                });
            }

            self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.paymentsList, {
                idAttribute: "referenceNo"
            })));

            self.dataLoaded(true);
        });

        self.ok = function () {
            $("#passwordDialog").trigger("closeModal");
        };

        self.searchByDate = function () {
            self.searchValue(null);

            PaymentHistoryModel.fetchPayments(self.selectedPeriod(), self.fromDate(), self.toDate()).done(function (data) {
                self.paymentsList.removeAll();
                data.billPaymentDTOs = rootParams.baseModel.sortLib(data.billPaymentDTOs, ["paymentDate"], ["desc"]);

                for (let i = 0; i < data.billPaymentDTOs.length; i++) {
                    self.paymentsList.push({
                        date: data.billPaymentDTOs[i].paymentDate,
                        billerName: data.billPaymentDTOs[i].billerName,
                        category: data.billPaymentDTOs[i].billerRegistration ? data.billPaymentDTOs[i].billerRegistration.category.name : data.billPaymentDTOs[i].category,
                        billAmount: rootParams.baseModel.formatCurrency(data.billPaymentDTOs[i].billAmount.amount, data.billPaymentDTOs[i].billAmount.currency),
                        referenceNo: data.billPaymentDTOs[i].id,
                        status: self.resourceBundle.paymentStatus[data.billPaymentDTOs[i].paymentStatus]
                    });
                }

                self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.paymentsList, {
                    idAttribute: "referenceNo"
                })));
            });
        };
    };

    return vm;
});