define([
    "ojs/ojcore",
    "knockout",
  "ojL10n!resources/nls/audit",
    "ojs/ojtreeview",
    "ojs/ojjsontreedatasource"
], function (oj, ko, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let request, response;

    self.nls = resourceBundle;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(self.nls.header.auditlogmaintenance);

        for (let i = 0; i < self.params.auditDetailsDTOList.length; i++) {
            if (self.params.auditDetailsDTOList[i].auditType === "1") {
                self.url = self.params.resolvedRequestUrl;
                request = self.params.auditDetailsDTOList[i].request;
                response = self.params.auditDetailsDTOList[i].response;
            }
        }

        const jsonRequestData = [],
            jsonResponseData = [];

        /**
         * Converts the JSON data to attr, children format suitable for JSON Tree Data Source.
         * @param {Object} object The object to be converted.
         * @param {Array} target The target array is returned, which holds the results.
         * @returns {void}
         */
        function jsonify(object, target) {
            let property;

            if (typeof object === "object") {
                for (property in object) {
                    if (object[property]) {
                        const wrapper = {
                            attr: {
                                id: rootParams.baseModel.incrementIdCount(),
                                title: property
                            }
                        };

                        if (object[property] instanceof Array || object[property] instanceof Object) {
                            wrapper.children = [];
                            jsonify(object[property], wrapper.children);
                        } else {
                            wrapper.attr.value = object[property];
                        }

                        target.push(wrapper);
                    }
                }
            } else {
                target.push({
                    attr: {
                        id: rootParams.baseModel.incrementIdCount(),
                        title: object
                    }
                });
            }
        }

        jsonify(request, jsonRequestData);
        jsonify(response, jsonResponseData);
        this.requestData = new oj.JsonTreeDataSource(jsonRequestData);
        this.responseData = new oj.JsonTreeDataSource(jsonResponseData);

        self.back = function() {
            history.go(-1);
        };
    };
});