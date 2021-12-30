define([
  "baseService"
], function (BaseService) {
  "use strict";

  const SearchSegmentModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        return {
          name: "",
          status: "",
          enterpriseRole: "",
          code: "",
          limits: [],
          roles: [],
          version: ""
        };
      };

    return {
      /**
       * FetchSegment - read the segment using the respective segment code.
       *
       * @param  {Object} code  - Unique identifier of the segment.
       * @return {Promise}     Returns the promise object.
       */
      fetchSegment: function (code) {
        const params = {
            code: code
          },
          options = {
            url: "segments/{code}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchSegments - fetch the list of segments for given search criteria.
       *
       * @param  {Object} code           - Unique identifier of the segment whose details need to be updated.
       * @param  {Object} name           - Name of the segment.
       * @param  {Object} enterpriseRole - User type of the segment.
       * @return {Promise}                Returns the promise object.
       */
      fetchSegments: function (code, name, enterpriseRole) {
        const params = {
            code: code,
            name: name,
            enterpriseRole: enterpriseRole
          },
          options = {
            url: "segments?code={code}&name={name}&enterpriseRole={enterpriseRole}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchEnterpriseRoles - fetch entrprise roles for mapping segment user type.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchEnterpriseRoles: function () {
        const options = {
          url: "enterpriseRoles"
        };

        return baseService.fetch(options);
      },
      /**
       * GetNewModel - provide object representing the segment.
       *
       * @return {Object}  Segment object.
       */
      getNewModel: function () {
        return new Model();
      }
    };
  };

  return new SearchSegmentModel();
});