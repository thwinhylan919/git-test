define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @class Model
   * @private
   * @memberOf MapModel
   */
  const ImageModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();
    /**
     * This function sends a GET request to fetch the coordinates.
     * It delegates control to the success handler function once the coordinates are successfully fetched
     *
     * @function fetchCoordinates
     * @memberOf MapModel
     * @param {Function} successHandler function to be called on success
     * @example MapModel.fetchCoordinates();
     */
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };
    let retrieveImageDeffered;
    const retrieveImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
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
    let deleteImageDeffered;
    const deleteImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
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

      baseService.remove(options, params);
    };
    let fetchMaxSizeDeffered;
    const fetchMaxSize = function(deferred) {
      const options = {
        url: "configurations/base/DocumentConfig/properties/DOCUMENT_SIZE",
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
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      retrieveImage: function(id) {
        retrieveImageDeffered = $.Deferred();
        retrieveImage(id, retrieveImageDeffered);

        return retrieveImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);

        return deleteImageDeffered;
      },
      fetchMaxSize: function() {
        fetchMaxSizeDeffered = $.Deferred();
        fetchMaxSize(fetchMaxSizeDeffered);

        return fetchMaxSizeDeffered;
      }
    };
  };

  return new ImageModel();
});