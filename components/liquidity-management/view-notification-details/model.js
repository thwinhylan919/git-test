/** Model for view-notification-details
 * @param {object} BaseService base service instance for server communication
 * @return {object} notificationDetailsModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const notificationDetailsModel = function() {

        /**
         * In case more than one instance of notificationDetailsModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
            /**
             * Method to get notification details.
             * @returns {Object}  Returns the modelData.
             */
            fetchNotications: function() {
                return baseService.fetch({
                    url: "liquidityManagement/structure/alerts",
                    apiType: "extended"
                });
            }
        };
    };

    return new notificationDetailsModel();
});