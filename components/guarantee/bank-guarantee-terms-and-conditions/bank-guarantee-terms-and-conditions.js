define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojvalidationgroup",
  "ojs/ojarraytabledatasource",
  "ojs/ojarraytabledatasource",
  "ojs/ojcheckboxset",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojpagingtabledatasource",
  "ojs/ojpagingtabledatasource"
], function(oj, ko) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.stageIndex = params.index;

    self.datasourceForTermsAndConditions = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.termsAndConditionsArray, { idAttribute: "id" }));

    self.continueFunc = function() {

      const termsAndConditionsTracker = document.getElementById("termsAndConditionsTracker");

      if (termsAndConditionsTracker.valid === "valid") {
        self.stages[self.stageIndex()].expanded(false);
        self.stages[self.stageIndex()].validated(true);
        self.stages[self.stageIndex() + 1].expanded(true);
      } else {
        self.stages[self.stageIndex()].validated(false);
        termsAndConditionsTracker.showMessages();
        termsAndConditionsTracker.focusOn("@firstInvalidShown");
      }
    };

    self.addTermsAndConditions = function(){
      self.termsAndConditionsArray.push({
        id: ko.observable(self.termsAndConditionsArray().length + 1),
        code: ko.observable(""),
        description: ko.observable("")
      });
    };

    function findIndexInData(data, value){
      for(let i=0;i<data.length;i++){
        if(ko.utils.unwrapObservable(data[i].id) === value){
          return i;
        }
      }

      return -1;
    }

    self.remove = function(data){
      self.termsAndCondsDataSourceLoaded(false);

      const index = findIndexInData(self.termsAndConditionsArray(),ko.utils.unwrapObservable(data.id));

      self.termsAndConditionsArray.splice(index,1);
      self.termsAndCondsDataSourceLoaded(true);
    };

  };
});
