/** Model for read nominee
 * @param {object} BaseService
 * @return {object} readNomineeModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    /**
     * In case more than one instance of readNomineeModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class readNomineeModel
     * @private
     */
    const readNomineeModel = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * Fetches nomineeDTO.
             *
             * @param {Object} selectedAccountId  - An object containing the vaue of account id.
             * @returns {Promise}  Returns the promise object.
             */
            readNominee: function(selectedAccountId) {
                return baseService.fetch({
                    url: "nominee/{accountId}"
                }, {
                    accountId: selectedAccountId
                });
            },
            /**
             * Removes nomineeDTO.
             *
             * @param1 {object} selectedAccountId  An object containing the vaue of account id
             * @returns {Promise}  Returns the promise object.
             */
            deleteNominee: function(selectedAccountId) {
                return baseService.remove({
                    url: "nominee/{accountId}"
                }, {
                    accountId: selectedAccountId
                });
            },
            /**
             * Fetches nomineeRelation.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getRelation: function() {
                return baseService.fetch({
                    url: "enumerations/nomineeRelations"
                });
            },
            /**
             * Fetches Country.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getCountry: function() {
                return baseService.fetch({
                    url: "enumerations/country"
                });
            }
        };
    };

    return new readNomineeModel();
});