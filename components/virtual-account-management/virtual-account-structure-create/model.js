define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for virtual account management Model. This file contains the model definition
   * for list of properties fetched from the host through the pass through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualAccountModel.init}</li>.
   *
   *              <li>[getProperty()]{@link CreateStructureModel.fetchVirtualAccountList}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~CreateStructureModel
   * @class CreateStructureModel
   */
  const CreateStructureModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of virtual account based on search. This
       * method will returned calling function to the parent.
       * @function fetchVirtualAccountList
       * @memberOf CreateStructureModel
       * @param {string} realCustomerNo - A real customer number.
       * @param {String} limit - additional param
       * @param {String} offset - additional param
       * @param {String} taskCode - a param for passing the create or edit task code for structure
       * @returns {void}
       * @private
       */
      fetchVirtualAccountList = function (taskCode) {
        return baseService.fetch({
          url: "accounts/virtual?taskCode={taskCode}&unmapped=true"
        }, {
          taskCode: taskCode
        });
      },
      /**
       * Private method to validate given structure code. This
       * method will calling function to the parent.
       * @function structureCodeValidation
       * @memberOf CreateStructureModel
       * @param {Object} structureCode - A virtual account structure identifier.
       * @returns {void}
       * @private
       */
      structureCodeValidation = function (structureCode) {
        return baseService.fetch({
          url: "virtualAccountStructures/{structureCode}"
        }, {
          structureCode: structureCode
        });

      },
      /**
       * Private method to fetch the virtual accounts.
       *
       * @function fetchVAMEnabledAccounts
       * @memberOf CreateStructureModel
       * @param {String} taskCode - a param for passing the create or edit task code for structure
       * @returns {void}
       * @private
       */

      fetchVAMEnabledAccounts = function (taskCode) {
        return baseService.fetch({
          url: "accounts/vamAccounts?taskCode={taskCode}"
        }, {
          taskCode: taskCode
        });
      },
      /**
       * Private method to fetch the multi currency virtual accounts.
       *
       * @function fetchMultiCurrencyList
       * @memberOf CreateStructureModel
       * @param {String} realCustomerNo - a real customer number
       * @param {String} limit - additional param
       * @param {String} offset - additional param
       * @param {String} taskCode - a param for passing the create or edit task code for structure
       * @param {String} virtualMCA - a param for passing virtualMCA on edit structure page
       * @returns {void}
       * @private
       */

      fetchMultiCurrencyList = function (taskCode, query) {
        return baseService.fetch({
          url: "multiCurrencyAccounts?taskCode={taskCode}&q={query}"
        }, {
          taskCode: taskCode,
          query: query
        });
      },
      /**
       * Private method to create the create Structure DTO. This
       * method will resolve a payload, which can be returned
       * from calling function to the parent.
       *
       * @function createStructureDTO
       * @memberOf CreateStructureModel
       * @private
       */
      createStructureDTO = function () {
        return {
          realCustomerNo: "",
          code: "",
          name: "",
          realAccountNo: "",
          realAccountBrn: "",
          accountLinkage: "",
          groupId: "",
          interestCalcReq: false,
          accountMapDetails: {
            children: [{
              account: {
                mainAccountId: "",
                headerAccountNo: "",
                childAccountId: "",
                parentAccountId: "",
                childAccountName: "",
                balance: ""
              },
              children: []
            }],
            account: {
              mainAccountId: "",
              parentAccountId: "",
              childAccountId: "",
              childAccountName: "",
              balance: ""
            }
          }
        };
      },
      /**
       * Private method to fetch the demand deposits list.
       *
       * @function fetchDemandDepositsList
       * @memberOf CreateStructureModel
       * @returns {void}
       * @private
       */

      fetchDemandDepositsList = function () {
        return baseService.fetch({
          url: "accounts/demandDeposit?"
        });
      };

    return {
      fetchVirtualAccountList: function (taskCode) {
        return fetchVirtualAccountList(taskCode);
      },
      structureCodeValidation: function (structureCode) {

        return structureCodeValidation(structureCode);
      },
      fetchVAMEnabledAccounts: function (taskCode) {
        return fetchVAMEnabledAccounts(taskCode);
      },
      fetchMultiCurrencyList: function (taskCode, query) {
        return fetchMultiCurrencyList(taskCode, query);
      },
      getNewModel: function () {
        return createStructureDTO();
      },
      fetchDemandDepositsList: function () {
        return fetchDemandDepositsList();
      }
    };
  };

  return new CreateStructureModel();
});