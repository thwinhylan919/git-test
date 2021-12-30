define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for Demand Deposit account interest section in the interest certificate page. It serves as the model where the data to be used by the demand deposit account interest section is defined.
   *
   * @namespace DDAModel~Model
   * @class DDAModel
   */
  const DDAModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();

    let fetchPDFDeferred;
    const fetchPDF = function(model) {
      const options = {
        url: "accounts/balanceCertificates?media=application/pdf&month=" + model.month + "&year=" + model.year
      };

      baseService.downloadFile(options);
    };
    let getBalanceCertificateDeferred;
    const getBalanceCertificateData = function(model, deferred) {
      const options = {
        url: "accounts/balanceCertificates?month=" + model.month + "&year=" + model.year,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchMediaTypeDeferred;
    const fetchMediaType = function(deferred) {
      const options = {
        url: "enumerations/mediatype",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCurrentDateDeferred;
    /**
     * FetchCurrentDate - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchCurrentDate = function(deferred) {
      const options = {
        url: "payments/currentDate",
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
      fetchCurrentDate: function() {
        fetchCurrentDateDeferred = $.Deferred();
        fetchCurrentDate(fetchCurrentDateDeferred);

        return fetchCurrentDateDeferred;
      },
      fetchPDF: function(model) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(model,fetchPDFDeferred);

        return fetchPDFDeferred;
      },
      getBalanceCertificateData: function(model) {
        getBalanceCertificateDeferred = $.Deferred();
        getBalanceCertificateData(model, getBalanceCertificateDeferred);

        return getBalanceCertificateDeferred;
      },
      fetchMediaType: function() {
        fetchMediaTypeDeferred = $.Deferred();
        fetchMediaType(fetchMediaTypeDeferred);

        return fetchMediaTypeDeferred;
      }
    };
  };

  return new DDAModel();
});
