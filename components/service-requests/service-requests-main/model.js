define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ServiceRequestsMainModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    let
      fetchDefaultListDeferred;
    const fetchDefaultList = function(status, fromDate, toDate, firstName, lastname, userName, partyId, requestType, product, severity, requestCategory, refNumber, requestName, deferred) {
      const params = {
          status: status,
          toDate: toDate,
          fromDate: fromDate,
          firstName: firstName,
          lastname: lastname,
          userName: userName,
          partyId: partyId,
          requestType: requestType,
          product: product,
          severity: severity,
          requestCategory: requestCategory,
          refNumber: refNumber,
          requestName: requestName
        },
        options = {
          url: "servicerequest?status={status}&toDate={toDate}&fromDate={fromDate}" + (firstName !== "" ? "&firstName={firstName}" : "") + (lastname ? "&lastName={lastname}" : "") + (userName ? "&userName={userName}" : "") + (partyId ? "&partyId={partyId}" : "") + (product ? "&product={product}" : "") + (severity ?
            "&severity={severity}" : "") + (requestCategory ? "&requestCategory={requestCategory}" : "") + (requestType ? "&fbRequestType={requestType}" : "") + (refNumber ?
            "&referenceNumber={refNumber}" : "") + (requestName ? "&requestName={requestName}" : ""),
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchRequestTypeDeferred;
    const fetchRequestType = function(deferred) {
      const params = {},
        options = {
          url: "enumerations/srFormBuilderRequestTypes",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchStatusTypeDeferred;
    const fetchStatusType = function(deferred) {
      const params = {},
        options = {
          url: "enumerations/srStatus",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchSeverityDeferred;
    const fetchSeverity = function(deferred) {
      const
        options = {
          url: "enumerations/priorityType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fetchCategoryTypesDeferred;
    const fetchCategoryTypes = function(productName, deferred) {
      const
        options = {
          url: "servicerequest/products/{productName}/categories",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productName: productName
        };

      baseService.fetch(options, params);
    };
    let fetchProductNamesDeferred;
    const fetchProductNames = function(deferred) {
      const
        options = {
          url: "servicerequest/products",
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
      fetchDefaultList: function(status, fromDate, toDate, firstName, lastname, userName, partyId, requestType, productName, severity, requestCategory, refNumber, requestName) {
        fetchDefaultListDeferred = $.Deferred();
        fetchDefaultList(status, fromDate, toDate, firstName, lastname, userName, partyId, requestType, productName, severity, requestCategory, refNumber, requestName, fetchDefaultListDeferred);

        return fetchDefaultListDeferred;
      },
      fetchStatusType: function() {
        fetchStatusTypeDeferred = $.Deferred();
        fetchStatusType(fetchStatusTypeDeferred);

        return fetchStatusTypeDeferred;
      },
      fetchRequestType: function() {
        fetchRequestTypeDeferred = $.Deferred();
        fetchRequestType(fetchRequestTypeDeferred);

        return fetchRequestTypeDeferred;
      },
      fetchCategoryTypes: function(productName) {
        fetchCategoryTypesDeferred = $.Deferred();
        fetchCategoryTypes(productName, fetchCategoryTypesDeferred);

        return fetchCategoryTypesDeferred;
      },
      fetchSeverity: function() {
        fetchSeverityDeferred = $.Deferred();
        fetchSeverity(fetchSeverityDeferred);

        return fetchSeverityDeferred;
      },
      fetchProductNames: function() {
        fetchProductNamesDeferred = $.Deferred();
        fetchProductNames(fetchProductNamesDeferred);

        return fetchProductNamesDeferred;
      }
    };
  };

  return new ServiceRequestsMainModel();
});