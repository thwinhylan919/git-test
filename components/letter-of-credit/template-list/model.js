define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TemplateModel = function() {
    const baseService = BaseService.getInstance();
    let Deferred;
    const getTemplates = function(deferred, url) {
      const options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      },
      getTemplateForLC = function(id, deferred) {
        const options = {
            url: "letterofcredits/templates/{templateId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            templateId: id
          };

        baseService.fetch(options, params);
      },
      getTemplateForSG = function(id, deferred) {
        const options = {
            url: "shippingGuarantees/templates/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            id: id
          };

        baseService.fetch(options, params);
      };

    return {
      getTemplates: function(url) {
        Deferred = $.Deferred();
        getTemplates(Deferred,url);

        return Deferred;
      },
      getTemplateForLC: function(id) {
        Deferred = $.Deferred();
        getTemplateForLC(id, Deferred);

        return Deferred;
      },
      getTemplateForSG: function(id) {
        Deferred = $.Deferred();
        getTemplateForSG(id, Deferred);

        return Deferred;
      }
    };
  };

  return new TemplateModel();
});
