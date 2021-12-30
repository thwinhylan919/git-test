/** Model for structure-account-mapping
 * @param {object} BaseService base service instance for server communication
 * @return {object} structureAccountMappingModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const structureAccountMappingModel = function() {

        /**
         * In case more than one instance of structureAccountMappingModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
            /**
             * Method to get account details.
             *
             * @returns {Object}  Returns the modelData.
             */
            fetchAccount: function(isExtAccountRequired, taskCode) {
                let url;

                if (isExtAccountRequired) {
                    url = "liquidityManagement/accounts?notionalAccFlag=N&taskCode={taskCode}";
                } else {
                    url = "liquidityManagement/accounts?notionalAccFlag=N&isExtAccChk=false&taskCode={taskCode}";
                }

                return baseService.fetch({
                    url: url,
                    apiType: "extended"
                }, {
                    taskCode: taskCode
                });
            }
        };
    };

    return new structureAccountMappingModel();
});