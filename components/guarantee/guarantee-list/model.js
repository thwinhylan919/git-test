define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    GuaranteeListModel = function() {
      let Deferred;
      const getTemplates = function(deferred) {
          const options = {
            url: "bankguarantees/templates",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

          baseService.fetch(options);
        },
        getTemplateById = function(id, deferred) {
          const options = {
              url: "bankguarantees/templates/{templateId}",
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
        getDrafts = function(deferred) {
          const options = {
            url: "bankguarantees/drafts",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

          baseService.fetch(options);
        },
        getDraftById = function(id, deferred) {
          const options = {
              url: "bankguarantees/drafts/{draftId}",
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            },
            params = {
              draftId: id
            };

          baseService.fetch(options, params);
        };

      return {
        getTemplates: function() {
          Deferred = $.Deferred();
          getTemplates(Deferred);

          return Deferred;
        },
        getTemplateById: function(id) {
          Deferred = $.Deferred();
          getTemplateById(id, Deferred);

          return Deferred;
        },
        getDrafts: function() {
          Deferred = $.Deferred();
          getDrafts(Deferred);

          return Deferred;
        },
        getDraftById: function(id) {
          Deferred = $.Deferred();
          getDraftById(id, Deferred);

          return Deferred;
        }
      };
    };

  return new GuaranteeListModel();
});