define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    SystemConfigurationDetails = function() {
      const Model = function() {
        this.serverName = null;
        this.fromEmailAddress = null;
        this.port = null;
        this.recipientAddress = null;
        this.userName = null;
        this.password = null;
        this.authenticationFlag = null;
      };
      let Deferred;
      const fireUrl = function(url, deferred) {
        const options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let validateHostConnectivityDeferred;
      const validateHostConnectivity = function(gatewayIp, port, hostName,hostVersion, deferred) {
        const options = {
            url: "extConnection/validate/{gatewayIp}/{port}?hostName={hostName}&hostVersion={hostVersion}",
            showMessage: false,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            gatewayIp: gatewayIp,
            port: port,
            hostName: hostName,
            hostVersion : hostVersion
          };

        baseService.fetch(options, params);
      };
      let validateSmtpServerConnectivityDeferred;
      const validateSmtpServerConnectivity = function(payload, deferred) {
        const options = {
          url: "extConnection/validate/smtpServer",
          showMessage: false,
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };

        baseService.add(options);
      };

      return {
        getNewModel: function() {
          return new Model();
        },
        fireUrl: function(url) {
          Deferred = $.Deferred();
          fireUrl(url, Deferred);

          return Deferred;
        },
        validateHostConnectivity: function(gatewayIp, port, hostName,hostVersion) {
          validateHostConnectivityDeferred = $.Deferred();
          validateHostConnectivity(gatewayIp, port, hostName,hostVersion, validateHostConnectivityDeferred);

          return validateHostConnectivityDeferred;
        },
        validateSmtpServerConnectivity: function(payload) {
          validateSmtpServerConnectivityDeferred = $.Deferred();
          validateSmtpServerConnectivity(payload, validateSmtpServerConnectivityDeferred);

          return validateSmtpServerConnectivityDeferred;
        }
      };
    };

  return new SystemConfigurationDetails();
});