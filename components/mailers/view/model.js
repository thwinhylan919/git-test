define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UsersModel = function() {
    const baseService = BaseService.getInstance();
    let deleteMailerDeffered;
    const deleteMailer = function(mailerId, deferred) {
    const params = {
      mailerId : mailerId
    },
       options = {
        url: "mailers/{mailerId}",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.remove(options, params);
    };
    let fetchUserSegmentsDeferred;
    const fetchUserSegments = function(searchParams, deferred) {
      const options = {
        url: "segments?enterpriseRole={selectedUser}&status=ENABLED",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };
    let listEnterpriseRolesDeferred;
    const listEnterpriseRoles = function(deferred) {
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
    let readMailerDeffered;
    const readMailer = function(Parameters, deferred) {
      const params = {
          mailerId: Parameters
        },
        options = {
          url: "mailers/{mailerId}",
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
      deleteMailer: function(mailerId) {
        deleteMailerDeffered = $.Deferred();
        deleteMailer(mailerId, deleteMailerDeffered);

        return deleteMailerDeffered;
      },
      fetchUserSegments: function(searchParams) {
        fetchUserSegmentsDeferred = $.Deferred();
        fetchUserSegments(searchParams, fetchUserSegmentsDeferred);

        return fetchUserSegmentsDeferred;
      },
      listEnterpriseRoles: function() {
        listEnterpriseRolesDeferred = $.Deferred();
        listEnterpriseRoles(listEnterpriseRolesDeferred);

        return listEnterpriseRolesDeferred;
      },
      readMailer: function(Parameters) {
        readMailerDeffered = $.Deferred();
        readMailer(Parameters, readMailerDeffered);

        return readMailerDeffered;
      }
    };
  };

  return new UsersModel();
});
