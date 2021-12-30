 /**
  * View Structure Details component helps to fetch details of a particular structure
  *
  * @module liquidity-management
  * @requires {knockout} ko
  * @requires {object} ResourceBundle
  */
 define([
     "knockout",
     "ojL10n!resources/nls/view-structure-details"
      ], function(ko, ResourceBundle) {
     "use strict";

     /** View Structure Details.
      * It allows user to view structure details in overlay format from right side of the screen.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      */
     return function(rootParams) {
         const self = this;

         ko.utils.extend(self, rootParams.rootModel);

         self.resource = ResourceBundle;
         rootParams.baseModel.registerComponent("view-structure", "liquidity-management");
         rootParams.baseModel.registerComponent("list-structure", "liquidity-management");
         rootParams.baseModel.registerComponent("create-structure", "liquidity-management");

        if(self.params && self.params.mode){

            if(self.params.mode === "Resumed" || self.params.mode === "Paused" || self.params.mode === "view" ||self.params.mode === "executed"){

                self.data = self.params.structureDetails;
                self.mode = ko.observable(self.params.mode);
            }
        }
        else if(self.params){
            if(!self.params.mode){
                self.data = self.params.structureDetails;
            }
        }
        else{
            self.data = self.structureDetails;
        }

        self.mode = ko.observable(ko.utils.unwrapObservable(self.mode));

        /**
          * This function is used to close overlay which shows structure details.
         *
          * @memberOf view-structure-details
          * @function closeHandler
          * @returns {void}
          */
         self.closeHandler = function(){
            rootParams.closeHandler();
         };
     };

 });