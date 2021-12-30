define([
  "ojs/ojcore",
  "jquery",
  "knockout",
  "ojL10n!resources/nls/attribute-transaction-tree",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout",
  "ojs/ojtreeview",
  "ojs/ojjsontreedatasource",
  "ojs/ojkeyset"
], function (oj, $, ko, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.expandAllKeySet = new oj.ExpandAllKeySet().addAll();
    self.selection = !ko.isObservable(params.data.selectedTasks) ? ko.observableArray(params.data.selectedTasks) : params.data.selectedTasks;

    self.nls = resourceBundle;
    self.disableTree = params.disableTree;
    self.attributeDataId = params.data.treeData[0].attr.id;
    self.count = params.transactionCount;
    self.partyLevelAccessAllowed = params.partyLevelAccessAllowed;
    self.dataLength = params.dataLength;

    $(document).on("mapAllClick", function (_event, param1, param2) {
      self.attributeDataId = param1;
      self.selectItem($("#" + param1), param2);
    });

    self.handleClick = function (event) {
      if (!self.disableTree()) {
        self.attributeDataId = params.data.treeData[0].attr.id;
        self.selectItem($(event.target).closest(".oj-treeview-item-content"));
      }

    };

    oj.Context.getContext(document.querySelector("oj-tree-view")).getBusyContext().whenReady().then(function () {
      $("oj-tree-view").find("ins").hide();

    });

    self.handleKeyDown = function (event) {
      if (!self.disableTree() && (event.keyCode === 13 || event.keyCode === 32)) {
        self.attributeDataId = params.data.treeData[0].attr.id;

        const $element = $("oj-tree-view[data-id=program" + self.attributeDataId + "]");

        self.selectItem($("#" + $element[0].currentItem));
      }
    };

    const createSelectionSubscription = function (id) {
        return function (newSelected) {
          if (newSelected === 1) {
            self.selection.push(id);

            if (self.selection().length === params.data.treeData[0].attr.arLeafSelected.length && self.count() !== self.dataLength()) {
              self.count(self.count() + 1);
            }
          } else {
            self.selection.remove(id);
            self.partyLevelAccessAllowed.removeAll();

            if (self.selection().length === (params.data.treeData[0].attr.arLeafSelected.length - 1) && self.count() > 0) {
              self.count(self.count() - 1);
            }
          }

          if (self.count() === self.dataLength()) {
            self.partyLevelAccessAllowed.push("true");
          }
        };
      },
      createParentSelectedObservable = function (arChildSelected) {
        return ko.computed(function () {
          let isAllSelected = true;

          for (let j = 0; j < arChildSelected.length; j++) {
            const childSelected = arChildSelected[j]();

            if (childSelected !== 1) {
              isAllSelected = false;
            }

            // Even if it has been determined that the parent selection is
            // partial, we can't break the for loop because it will prevent
            // the parent computed observable from having all of its child
            // observables as dependencies.
          }

          return isAllSelected ? 1 : -1;
        });
      },
      addSelectedObservables = function (rows) {
        const arLeafSelected = [],
          arChildSelected = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          let selected;

          if (!row.children || row.children.length === 0) {
            // Leaf node or childless parent node.
            // Set initial selection and subscribe to update the selection array.
            selected = ko.observable(self.selection.indexOf(row.attr.taskId) !== -1 ? 1 : -1);
            arLeafSelected.push(selected);
            selected.subscribe(createSelectionSubscription(row.attr.taskId));
          } else {
            // Parent node with children.
            // Recursively decorate the child rows.
            const selectedObj = addSelectedObservables(row.children);

            selected = createParentSelectedObservable(selectedObj.arChildSelected);
            row.attr.arLeafSelected = selectedObj.arLeafSelected;
            arLeafSelected.push.apply(arLeafSelected, selectedObj.arLeafSelected);
          }

          row.attr.selected = selected;
          arChildSelected.push(selected);
        }

        return {
          arLeafSelected: arLeafSelected,
          arChildSelected: arChildSelected
        };
      };

    self.selectItem = function (node, mapAll) {
      if (node.length < 1) {
        return;
      }

      const $element = $("oj-tree-view[data-id=program" + self.attributeDataId + "]"),
        data = $element[0].getContextByNode(node[0]).data;
      let newSelected;

      if (mapAll) {
        newSelected = mapAll;
      } else {
        newSelected = data.selected() === 1 ? -1 : 1;
      }

      if (data.arLeafSelected) {
        // Parent node with children.
        // Toggle the selected observables of all its leaf descendants.
        for (let i = 0; i < data.arLeafSelected.length; i++) {
          data.arLeafSelected[i](newSelected);
        }
      } else {
        // Leaf node or childless parent node.
        // Toggle the selected observable.
        data.selected(newSelected);
      }
    };

    self.structureTreeData = function (treeData) {

      addSelectedObservables(treeData);
      self.dataSource = new oj.JsonTreeDataSource(treeData);
    };

    self.structureTreeData(params.data.treeData);

  };
});