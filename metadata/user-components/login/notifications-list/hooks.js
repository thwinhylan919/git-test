define(["knockout"], function (ko) {
    "use strict";

    return function () {
        let self;

        function init(bindingContext, _rootParams) {
            self = bindingContext;

            self.pageRendered = function () {
                return true;
            };

            self.notificationsData = ko.observableArray();
            self.notificationsList = [];

            self.sortingByDate = function (date, time) {
                return function (a, b) {
                    if (a[date] > b[date]) {
                        return -1;
                    } else if (a[date] < b[date]) {
                        return 1;
                    } else if (a[time] > b[time]) {
                        return -1;
                    } else if (a[time] < b[time]) {
                        return 1;
                    }

                    return 0;
                };
            };

            self.convertTimeTo12HourFormat = function (time24Format) {
                const timeArray = time24Format.split(":");
                let meridian = "Time: AM", hours = parseInt(timeArray[0]);

                if (hours >= 12) {
                    hours -= 12;
                    meridian = "Time: PM";
                }

                if (hours === 0) {
                    hours = 12;
                }

                return hours + ":" + timeArray[1] + meridian.split(":")[1];
            };

            self.successCallback = function (data) {
                if (!data) {
                    return;
                }

                data.sort(self.sortingByDate("date", "time"));

                for (let i = 0; i < data.length; i++) {
                    const space = ": :", newDate = data[i].date.split("-"), day = parseInt(newDate[2]), month = parseInt(newDate[1]), year = parseInt(newDate[0]), todaysDate = data[i].currentDate.split(",")[0].split("/"), currentYear = todaysDate[2], currentMonth = todaysDate[1], currentDay = todaysDate[0];
                    let monthWord = "Jan";

                    data[i].time = self.convertTimeTo12HourFormat(data[i].time);
                    self.notificationsList[data[i].id] = i;

                    switch (month) {
                    case 1:
                        monthWord = "Jan";
                        break;
                    case 2:
                        monthWord = "Feb";
                        break;
                    case 3:
                        monthWord = "Mar";
                        break;
                    case 4:
                        monthWord = "Apr";
                        break;
                    case 5:
                        monthWord = "May";
                        break;
                    case 6:
                        monthWord = "Jun";
                        break;
                    case 7:
                        monthWord = "Jul";
                        break;
                    case 8:
                        monthWord = "Aug";
                        break;
                    case 9:
                        monthWord = "Sep";
                        break;
                    case 10:
                        monthWord = "Oct";
                        break;
                    case 11:
                        monthWord = "Nov";
                        break;
                    case 12:
                        monthWord = "Dec";
                        break;
                    }

                    if (parseInt(currentYear) === year) {
                        if (parseInt(currentMonth) === month) {
                            if (day === parseInt(currentDay)) {
                                data[i].date = "Today";
                            } else if (day === parseInt(currentDay) - 1) {
                                data[i].date = "Yesterday";
                            } else {
                                data[i].date = monthWord + space.split(":")[1] + day;
                            }
                        } else {
                            data[i].date = monthWord + space.split(":")[1] + day;
                        }
                    } else {
                        const oldYear = year.toString().substring(2, 4);

                        data[i].date = day + space.split(":")[1] + monthWord + space.split(":")[1] + oldYear;
                    }
                }

                self.notificationsData(data);
            };

            self.errorCallback = function (data) {
                const x = 1;

                return x;
            };

            self.handleCurrentItemChanged = function (event) {
                const notificationId = parseInt(event.detail.value), index = self.notificationsList[notificationId];

                self.notificationsData()[index].date = "clicked";
            };

            window.notificationsDB.fetchAllNotifications({}, self.successCallback, self.errorCallback);

            return true;
        }

        return { init: init };
    };
});