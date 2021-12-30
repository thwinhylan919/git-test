define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ListMailCategoriesModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    let
      readMappingDeferred;
    const readMapping = function(mappingId, deferred) {
      const options = {
        url: "userGroupSubjectMap/" + mappingId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchCategoryOptionsDeferred;
    const fetchCategoryOptions = function(deferred) {
      const options = {
        url: "mailCategories",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchCategoryOptions: function() {
        fetchCategoryOptionsDeferred = $.Deferred();
        fetchCategoryOptions(fetchCategoryOptionsDeferred);

        return fetchCategoryOptionsDeferred;
      },
      readMapping: function(mappingId) {
        readMappingDeferred = $.Deferred();
        readMapping(mappingId, readMappingDeferred);

        return readMappingDeferred;
      }
    };
  };

  return new ListMailCategoriesModel();
});