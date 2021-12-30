define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/initiate-collection",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojinputtext"
], function(oj, ko, $, CollectionModel, resourceBundle) {
  "use strict";

  const vm = function(params) {
    const self = this;
    let i;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.stageIndex = params.index;
    self.allDocsSelected = ko.observable(["false"]);
    self.clauseModalHeading = ko.observable();
    self.selectedClauses = ko.observable();
    self.selectedClausesLength = ko.observable(0);

    self.datasourceForDoc = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.docArray, {
      idAttribute: "id"
    }));

    self.viewClauses = function(selectedDoc) {
      self.clausePushFlag = true;
      self.selectedClausesLength(selectedDoc.clause.length);

      for (let i = 0; i < self.clauseTableArray().length; i++) {
        if (self.clauseTableArray()[i].docId === selectedDoc.id) {
          self.selectedClauses(self.clauseTableArray()[i]);
          self.clausePushFlag = false;
          break;
        }
      }

      if (self.clausePushFlag && selectedDoc.clause && selectedDoc.clause.length > 0) {
        self.clauseTableArray.push({
          allClauseSelected: ko.observable(["false"]),
          docId: selectedDoc.id,
          docName: params.baseModel.format(self.nls.labels.documentName, {
            docName: selectedDoc.docName
          }),
          datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(selectedDoc.clause, {
            idAttribute: "rowId"
          }))
        });

        self.selectedClauses(self.clauseTableArray()[self.clauseTableArray().length - 1]);
      }

      if (params.baseModel.small()) {
        self.clauseModalHeading(self.selectedClauses().docName);
        $("#documentClauses").trigger("openModal");
      }
    };

    self.hideDocumentClauses = function() {
      $("#documentClauses").hide();
    };

    self.incotermSubscribe = self.collectionDetails.incoterm.subscribe(function(newValue) {
      if (!$.isEmptyObject(newValue)) {
        if (self.incotermOptions()) {
          const incotermLabel = self.incotermOptions().filter(function(data) {
            return data.value === newValue;
          });

          if (incotermLabel && incotermLabel.length > 0) {
            self.dropdownLabels.incoterm(incotermLabel[0].label);
          }
        }
      }
    });

    CollectionModel.fetchIncoterm().done(function(incotermData) {
      const incotermList = incotermData.incotermList.map(function(data) {
        return {
          value: data.code,
          label: data.description
        };
      });

      self.incotermOptions(incotermList);

      if (self.collectionDetails.incoterm() && self.collectionDetails.incoterm() !== null) {
        const incotermLabel = self.incotermOptions().filter(function(data) {
          return data.value === self.collectionDetails.incoterm();
        });

        if (incotermLabel && incotermLabel.length > 0) {
          self.dropdownLabels.incoterm(incotermLabel[0].label);
        }
      }

      self.dropdownListLoaded.incoterm(true);
    });

    self.docSelectionHandler = function(event) {
      if (event.detail.value) {
        const docId = event.target.id.split("_")[1];

        self.docArray().forEach(function(entry) {
          if (entry.id === docId) {
            entry.originals(0);
            entry.originalsOutOff(0);
            entry.copies(0);
            entry.secondOriginals(0);
            entry.secondOriginalsOutOff(0);
            entry.secondCopies(0);
          }
        });

        self.clauseTableArray.remove(function(clauseData) {
          if (clauseData.docId === docId) {
            return true;
          }

          return false;
        });
      }
    };

    self.continueFunc = function() {
      const tracker = document.getElementById("docValidationTracker");

      if (tracker.valid === "valid") {
        self.stages[self.stageIndex()].expanded(false);
        self.stages[self.stageIndex()].validated(true);
        self.stages[self.stageIndex() + 1].expanded(true);
      } else {
        self.stages[self.stageIndex()].validated(false);
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.selectAllDocListener = function(event) {
      let allDocsSelected = "false";

      if (event.detail.value.length > 0 && event.detail.value[0] === "true") {
        allDocsSelected = "true";
      }

      for (i = 0; i < self.docArray().length; i++) {
        self.docArray()[i].docSelected([allDocsSelected]);
      }
    };

    self.selectAllClauseListener = function(data, event) {
      let allClauseSelected = "false";

      if (event.detail.value.length > 0 && event.detail.value[0] === "true") {
        allClauseSelected = "true";
      }

      for (i = 0; i < self.docArray().length; i++) {
        if (self.docArray()[i].id === data) {
          for (let j = 0; j < self.docArray()[i].clause.length; j++) {
            self.docArray()[i].clause[j].selected([allClauseSelected]);
          }
        }
      }
    };

    $(document).ready(function() {
      $(document).on("change", "input[name=selectionParentDocument]", function() {
        for (let i = 0; i < self.docArray().length; i++) {
          self.docArray()[i].docSelected(["" + $("input[name=selectionParentDocument]").prop("checked")]);
        }
      });

      $(document).on("change", "input[name=docSelected]", function() {
        self.allDocsSelected(["" + ($("input[name=docSelected]:checked").length === $("input[name=docSelected]").length)]);
      });

      $(document).on("change", "input[name=selectionParentClause]", function(data) {
        const id = data.currentTarget.id.split("_")[2],
          headerClass = "header-clause-cb-" + id;

        for (let i = 0; i < self.docArray().length; i++) {
          if (self.docArray()[i].id === id) {
            for (let j = 0; j < self.docArray()[i].clause.length; j++) {
              self.docArray()[i].clause[j].selected(["" + $("." + headerClass).prop("checked")]);
            }
          }
        }
      });

      $(document).on("change", "input[name=clauseSelected]", function(data) {
        const id = data.currentTarget.classList[0].split("-")[2],
          valueClass = "clause-cb-" + id;

        for (let i = 0; i < self.clauseTableArray().length; i++) {
          if (self.clauseTableArray()[i].docId === id) {
            self.clauseTableArray()[i].allClauseSelected(["" + ($("." + valueClass + ":checked").length === $("." + valueClass).length)]);
          }
        }
      });
    });
  };

  vm.prototype.dispose = function() {
    this.incotermSubscribe.dispose();
  };

  return vm;
});
