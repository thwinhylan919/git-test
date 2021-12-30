/**
 * Model for segment-payee-restriction-mapping.
 * @param {object} BaseService base service instance for server communication
 * @return {object} SegmentAuthenticationMapingModel Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const SegmentAuthenticationMapingModel = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * ListAllLimits - fetch the configuration details.
             *
             * @param {string} targetType - It is Selected target type to be passed to list of payee count limit.
             * @param {string} targetValue - It is Selected to be passed to to list of payee count limit.
             * @returns {Promise}  Returns the promise object.
             */
            listAllLimits: function(targetType,targetValue) {
                return baseService.fetch({
                     url: "payments/maintenances/payeecount?targetType={targetType}&targetValue={targetValue}"
                },{
                    targetType:targetType,
                    targetValue :targetValue
                });
            },
            /**
             * ListUserSegments - fetch the configuration details.
             *
             * @returns {Promise}  Returns the promise object.
             */
            listUserSegments: function() {
                return baseService.fetch({
                    url: "enterpriseRoles?isLocal=true"
                });
            },
            /**
             * ListUserSegmentsForRole - fetch the configuration details.
             *
             * @param {string} segmentSelected - It is Selected to be passed to list of enterprise role.
             * @returns {Promise}  Returns the promise object.
             */
            listUserSegmentsForRole: function(segmentSelected) {
                return baseService.fetch({
                    url: "segments?enterpriseRole={segmentSelected}"
                },{
                    segmentSelected :segmentSelected
                });
            }
        };
    };

    return new SegmentAuthenticationMapingModel();
});