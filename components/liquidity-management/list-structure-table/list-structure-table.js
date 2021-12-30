  /**
   * account-structure-details
   *
   * @module liquidity-management
   * @requires {ojcore} oj
   * @requires {knockout} ko
   * @requires {jquery} $
   * @requires {object} accountStructureDetailModel
   * @requires {object} ResourceBundle
   */
  define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/list-structure-table",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
  ], function(oj, ko, ResourceBundle) {
    "use strict";

    /** Account-structure-details.
     *
     * It allows user to view structure details in tabular form.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
      const self = this;

      ko.utils.extend(self, rootParams.rootModel);

      self.structureDetailsDataSource = ko.observable(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.params.cardDetails, {
        idAttribute: "structureId"
      }) || []));

      self.resource = ResourceBundle;
    };
  });
