/** Model for Transaction Mapping Search
 * @param {object} BaseService
 * @return {object} TransactionMappingSearchModel
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TransactionMappingSearchModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();

    this.getNewModel = function() {
      return new this.Model();
    };

    let fetchUserGroupOptionsDeferred;
    const fetchUserGroupOptions = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchUserGroupListOptionsDeferred;
    const fetchUserGroupListOptions = function(Parameters, deferred) {
      const params = {
          applicationRoleName: Parameters.applicationRoleName,
          enterpriseRole: Parameters.enterpriseRole
        },
        options = {
          url: "applicationRoles?applicationRoleName={applicationRoleName}&enterpriseRole={enterpriseRole}&isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      },
      fetchUserGroupListOptions: function(Parameters) {
        fetchUserGroupListOptionsDeferred = $.Deferred();
        fetchUserGroupListOptions(Parameters, fetchUserGroupListOptionsDeferred);

        return fetchUserGroupListOptionsDeferred;
      }
    };
  };

  return new TransactionMappingSearchModel();
});