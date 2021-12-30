define([
  "knockout",
  "ojL10n!resources/nls/generic",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup"
], function(ko,ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let currentParent = -1,
      currentChild = -1,
      currentNode;

    self.resources = ResourceBundle;
    self.isFirst = ko.observable(true);
    self.isLast = ko.observable(false);
    self.validationTracker = ko.observable();
    self.currentComponent = ko.observable();
    self.currentData = ko.observable();
    self.steps = ko.observableArray();

    const maskVisited = function(current) {
        current.isVisited(true);
        current.isCurrent(false);
      },
      setFirstAndLast = function() {
        if (self.steps().length) {
          self.isFirst(false);
          self.isLast(false);

          if (currentParent === 0) {
            if (self.steps()[currentParent].clickable() || currentChild === 0) {
              self.isFirst(true);
            }
          }

          if (currentParent === self.steps().length - 1) {
            if (self.steps()[currentParent].clickable() || currentChild === self.steps()[currentParent].children.length - 1) {
              self.isLast(true);
            }
          }
        }
      },
      setCurrent = function(current, index, isChild) {
        if (currentNode) {
          currentNode.isCurrent(false);
        }

        currentNode = current;
        rootParams.baseModel.registerComponent(current.componentName, current.module);
        self.currentComponent(current.componentName);
        self.currentData(current.data);
        current.isCurrent(true);

        if (isChild) {
          currentChild = index;
        } else {
          currentParent = index;
        }

        setFirstAndLast();
      },
      steps = rootParams.steps.map(function(element, index) {
        element.isVisited = ko.observable(false);
        element.isCurrent = ko.observable(false);
        element.clickable = ko.observable(true);

        if (element.children) {
          element.children = element.children.map(function(child) {
            child.isVisited = ko.observable(false);
            child.isCurrent = ko.observable(false);

            return child;
          });

          element.clickable(false);

          if (index === 0) {
            currentParent = 0;
            setCurrent(element.children[0], 0, true);
            element.isVisited(true);
          }
        } else if (index === 0) {
          setCurrent(element, 0);
        }

        return element;
      });

    ko.utils.arrayPushAll(self.steps, steps);

    self.next = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("form-wizard"))) {
        return;
      }

      const process = currentNode.data.process ? currentNode.data.process() : Promise.resolve();

      process.then(function() {
        if (currentChild === -1) {
          maskVisited(steps[currentParent]);

          if (steps[currentParent + 1]) {
            if (steps[currentParent + 1].clickable()) {
              setCurrent(steps[currentParent + 1], currentParent + 1);
            } else if (steps[currentParent + 1].children) {
              currentParent++;
              steps[currentParent].isVisited(true);
              setCurrent(steps[currentParent].children[0], 0, true);
            }
          }
        } else {
          maskVisited(steps[currentParent].children[currentChild]);

          if (steps[currentParent].children[currentChild + 1]) {
            setCurrent(steps[currentParent].children[currentChild + 1], currentChild + 1, true);
          } else if (steps[currentParent + 1] && steps[currentParent + 1].clickable()) {
            currentParent++;
            currentChild = -1;
            setCurrent(steps[currentParent], currentParent);
          } else if (steps[currentParent + 1] && steps[currentParent + 1].children) {
            currentParent++;
            steps[currentParent].isVisited(true);
            setCurrent(steps[currentParent].children[0], 0, true);
          }
        }
      });
    };

    self.previous = function() {
      if (currentChild === -1) {
        if (steps[currentParent - 1]) {
          currentParent--;

          if (steps[currentParent].children) {
            setCurrent(steps[currentParent].children[steps[currentParent].children.length - 1], steps[currentParent].children.length - 1, true);
          } else if (steps[currentParent].clickable()) {
            setCurrent(steps[currentParent], currentParent);
          }
        }
      } else if (steps[currentParent].children[currentChild - 1]) {
        currentChild--;
        setCurrent(steps[currentParent].children[currentChild], currentChild, true);
      } else if (steps[currentParent - 1]) {
        currentParent--;

        if (steps[currentParent].children) {
          setCurrent(steps[currentParent].children[steps[currentParent].children.length - 1], steps[currentParent].children.length - 1, true);
        } else if (steps[currentParent].clickable()) {
          currentChild = -1;
          setCurrent(steps[currentParent], currentParent);
        }
      }

    };

    self.jump = function(parent, child) {
      currentParent = parent;

      if (rootParams.baseModel.isEmpty(child)) {
        currentChild = -1;
        setCurrent(steps[currentParent], currentParent);
      } else {
        setCurrent(steps[currentParent].children[child], child, true);
      }
    };
  };
});
