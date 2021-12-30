/**
 * tree-view contains all the methods to create a tree structure including nodes and links
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/tree-view",
    "ojs/ojknockout",
    "ojs/ojdiagram",
    "ojs/ojtoolbar",
    "ojs/ojjsondiagramdatasource"
], function(oj, ko, $, ResourceBundle) {
    "use strict";

    /**
     * A base component to create tree structure having nodes and links.
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     *
     */
    return function(rootParams) {
        const self = this,
            nodes = [],
            links = [];

        ko.utils.extend(self, rootParams.rootModel);
        self.dataSource = ko.observableArray();
        self.dataSourceLoaded = ko.observable(false);
        self.selectedNodesValue = ko.observableArray([]);
        self.treeData = rootParams.treeDetails;
        self.resource = ResourceBundle;
        self.wrapTree = rootParams.wrapTree || false;
        self.svgWidth = rootParams.width || 240;
        self.svgHeight = rootParams.height || 120;
        self.overViewRenderer = rootParams.overViewRenderer || "on";
        self.treePanning = rootParams.treePanning || "auto";
        self.treeZooming = rootParams.treeZooming || "auto";
        self.nodeClickHandler = rootParams.nodeClickHandler;
        self.linkClickHandler = rootParams.linkClickHandler;
        self.moreClickHandler = rootParams.moreClickHandler;
        self.moreNodeSvgColor = rootParams.moreNodeSvgColor;
        self.showDiagram = rootParams.showDiagram;

        const verticalDistanceBetweenNodes = self.svgHeight,
            minHorizontalDistanceBetweenNodes = 25,
            nodeIdjsonPathArray = rootParams.nodeIdjsonPath.split("."),
            maxChildNodes = rootParams.maxChildNodesToRender || 2,
            nodeLinkMap = {},
            latestNodeCoOrdinateArray = [],
            nodeRenderedChildCount = {},
            linkShortDesc = rootParams.linkShortDescValue || null,
            nodeShortDesc = rootParams.nodeShortDescValue ? rootParams.nodeShortDescValue.split(".") : null;
        let treeCurrentLevel = 0;

        /**
         * This function will return the link path matrix to followed to connect two nodes.
         *
         *  @memberOf tree-view
         *  @function linkPathFunc
         *  @param {context} layoutContext  Contains the context of whole svg created.
         *  @param {object} link  An object which contains the information required to derive the path.
         *  @returns {object} path  A matrix which conteins the co-ordinates of link to be followed
         */
        function linkPathFunc(layoutContext, link) {
            const node1 = layoutContext.getNodeById(link.getStartId()),
                node2 = layoutContext.getNodeById(link.getEndId()),
                n1Pos = node1.getPosition(),
                n2Pos = node2.getPosition(),
                x1 = n1Pos.x + (self.svgWidth / 2),
                x2 = n2Pos.x + (self.svgWidth / 2);

            if (!nodeLinkMap[link.getStartId()]) {
                nodeLinkMap[link.getStartId()] = {
                    leftChildsLinked: 0,
                    rightChildsLinked: 0,
                    startvalue: 0,
                    difference: 0
                };
            }

            let Yvalue;

            if (nodeLinkMap[link.getStartId()].startvalue) {
                if (x2 > x1) {
                    Yvalue = nodeLinkMap[link.getStartId()].startvalue - (nodeLinkMap[link.getStartId()].rightChildsLinked * nodeLinkMap[link.getStartId()].difference);
                } else {
                    Yvalue = nodeLinkMap[link.getStartId()].startvalue - (nodeLinkMap[link.getStartId()].leftChildsLinked * nodeLinkMap[link.getStartId()].difference);
                }
            } else {
                nodeLinkMap[link.getStartId()].difference = verticalDistanceBetweenNodes / (Math.round(nodeRenderedChildCount[link.getStartId()] / 2) + 1);
                Yvalue = verticalDistanceBetweenNodes - nodeLinkMap[link.getStartId()].difference;
                nodeLinkMap[link.getStartId()].startvalue = Yvalue;
            }

            if (x2 > x1) {
                nodeLinkMap[link.getStartId()].rightChildsLinked += 1;
            } else {
                nodeLinkMap[link.getStartId()].leftChildsLinked += 1;
            }

            return ["M", x1, n1Pos.y + self.svgHeight,
                "L", x1, n1Pos.y + self.svgHeight + Yvalue,
                "L", Math.abs(x1 - x2) === 1 ? x1 : x2, n1Pos.y + self.svgHeight + Yvalue,
                "L", Math.abs(x1 - x2) === 1 ? x1 : x2, n2Pos.y
            ];
        }

        /**
         * This function will return the label position object.
         *
         *  @memberOf tree-view
         *  @function labelLayoutCallback
         *  @param {context} _layoutContext  Contains the context of whole svg created.
         *  @param {object} linkContext  An object which contains the information required to derive the path.
         *  @returns {object} containing label details
         */
        function labelLayoutCallback(_layoutContext, linkContext) {
            const linkPoints = linkContext.getPoints();

            if (linkPoints[4] === linkPoints[7]) {
                return {
                    x: ((linkPoints[4] + linkPoints[7]) / 2) + 5,
                    y: linkPoints[5] - 10
                };
            }

            return {
                x: ((linkPoints[4] + linkPoints[7]) / 2) - 20,
                y: linkPoints[5] - 30
            };

        }

        self.linkProperties = function(data) {
            return data;
        };

        self.nodeDataId = ko.observable("node" + rootParams.baseModel.incrementIdCount());

        self.nodeRenderer = function(context) {
            return oj.KnockoutTemplateUtils.getRenderer(self.nodeDataId())(context);
        };

        self.treeId = "tree-diagram" + rootParams.baseModel.incrementIdCount();

        self.triggerKeyDownEvent = function(keyCode) {
            document.getElementById(self.treeId).focus();

            const event = new KeyboardEvent("keydown", {
                keyCode: keyCode
            });

            document.getElementById(self.treeId).dispatchEvent(event);
        };

        /**
         * Reducer function for extracting id value from the object
         *
         *  @memberOf tree-view
         *  @function reducer
         *  @param {object} accumulator  The accumulator accumulates the callback's return values; it is the accumulated value previously returned in the last invocation of the callback
         *  @param {object} currentValue  The current element being processed in the array.
         *  @returns {object} contains id
         */
        function reducer(accumulator, currentValue) {
            return accumulator[currentValue];
        }

        /**
         * This function will be called to get account key.
         *
         *  @memberOf tree-view
         *  @function getKey
         *  @param {object} account  An object which contains the account details.
         *  @returns {String} value of the id key
         */
        function getKey(account) {
            return nodeIdjsonPathArray.reduce(reducer, account);
        }

        /**
         * This function will be called to get account key.
         *
         *  @memberOf tree-view
         *  @function getKey
         *  @param {object} account  An object which contains the account details.
         *  @returns {String} value of the id key
         */
        function getNodeShortDescValue(account) {
            return nodeShortDesc.reduce(reducer, account);
        }

        /**
         * This function will be called to create a node.
         *
         *  @memberOf tree-view
         *  @function createNode
         *  @param {object} nodeId  An object which contains the id of the node to be created.
         *  @param {object} x  An object which contains the x co-ordinate of the node.
         *  @param {object} y  An object which contains the y co-ordinate of the node.
         *  @param {object} data  An object which contains the data which needs to display inside the node.
         *  @param {object} nodeHoverText  An object which contains the value that needs to display on node hover.
         *  @returns {object} returns the node created with the provided details.
         */
        function createNode(nodeId, x, y, data, nodeHoverText) {
            return {
                id: nodeId,
                shortDesc: nodeHoverText || nodeId.split("~")[1],
                x: x,
                y: y,
                nodeData: data,
                selectable: self.nodeClickHandler || data.moreNodesCount ? "auto" : "off"
            };
        }

        /**
         * This function will be called to create a link.
         *
         *  @memberOf tree-view
         *  @function createLink
         *  @param {object} linkId  An object which contains the id of the link to be created.
         *  @param {object} startId  An object which contains the startId of the link.
         *  @param {object} endId  An object which contains the endId of the link.
         *  @param {String} label  String which contains the value that needs to display on link.
         *  @returns {object} returns the link created with the provided details.
         */
        function createLink(linkId, startId, endId, label) {
            return {
                id: linkId,
                startNode: startId,
                endNode: endId,
                label: label,
                selectable: self.linkClickHandler ? "auto" : "off"
            };
        }

        /**
         * This function will be recursively called to create a node with its repective child node and link.
         *
         *  @memberOf tree-view
         *  @function recursiveNodeCreation
         *  @param {object} account  An object which contains the details of a parent node.
         *  @param {object} child  An object which contains the child node details of its respective parent node.
         *  @param {object} calculatedWidth  An object which contains the distance between two nodes of same level.
         *  @returns {void}
         */
        function recursiveNodeCreation(account, child) {
            let cx = 0,
                firstChildCx = 0;
            const linkKey = getKey(account),
                startNode = "node~" + linkKey,
                cy = (account.cy + self.svgHeight) + verticalDistanceBetweenNodes;

            if(child){
            nodeRenderedChildCount[startNode] = child.length > maxChildNodes ? maxChildNodes + 1 : child.length;

            for (let i = 0; i < child.length; i++) {
                child[i].account.moreNodesCount = 0;

                const nodeDescValue = getNodeShortDescValue(child[i].account);

                if (i === maxChildNodes) {
                    cx = latestNodeCoOrdinateArray.length ? latestNodeCoOrdinateArray.slice(0, treeCurrentLevel + 1).reduce(function(accumulate, current) {
                        return Math.max(accumulate, isNaN(current) ? -Infinity : current);
                    }) + self.svgWidth + minHorizontalDistanceBetweenNodes : 1;

                    const key = getKey(child[i].account),
                        nodeId = "morenode~" + key;

                    latestNodeCoOrdinateArray[treeCurrentLevel] = cx;
                    child[i].account.moreNodesCount = child.length - i;
                    nodes.push(createNode(nodeId, cx, cy, child[i].account, nodeDescValue));
                    links.push(createLink("morelink~" + linkKey + "-" + key, startNode, nodeId, child[i].account[linkShortDesc]));
                    i = child.length;
                } else if (i < maxChildNodes) {
                    child[i].account.cy = cy;

                    if (child[i].children && child[i].children.length) {
                        treeCurrentLevel++;
                        cx = recursiveNodeCreation(child[i].account, child[i].children);
                        treeCurrentLevel--;
                    } else {
                        cx = latestNodeCoOrdinateArray.length ? latestNodeCoOrdinateArray.slice(0, treeCurrentLevel + 1).reduce(function(accumulate, current) {
                            return Math.max(accumulate, isNaN(current) ? -Infinity : current);
                        }) + self.svgWidth + minHorizontalDistanceBetweenNodes : 1;
                    }

                    if (i === 0) {
                        firstChildCx = cx;
                    }

                    const key = getKey(child[i].account),
                        nodeId = "node~" + key;

                    latestNodeCoOrdinateArray[treeCurrentLevel] = cx;
                    nodes.push(createNode(nodeId, cx, cy, child[i].account, nodeDescValue));
                    links.push(createLink("link~" + linkKey + "-" + key, startNode, nodeId, child[i].account[linkShortDesc]));
                }
                }

            }

            return firstChildCx + ((((cx + self.svgWidth - firstChildCx) / 2) - (self.svgWidth / 2)) || 1);
        }

        /**
         * This function will be called first to create the header node.
         * It then calls the recursiveNodeCreation function to generate further nodes and links.
         * Here the co-ordinated (x,y) of header node is also defined on the basis of which
         * other nodes co-ordinates will be derived.
         *
         *  @memberOf tree-view
         *  @function readStructureDetails
         *  @returns {void}
         */
        function readStructureDetails() {
            if (self.treeData()) {
                const headerAccountId = "node~" + getKey(self.treeData().account);
                let cx = 0;

                $.extend(self.treeData().account, {
                    cy: 0
                });

                treeCurrentLevel = 1;
                self.treeData().account.moreNodesCount = 0;
                cx = recursiveNodeCreation(self.treeData().account, self.treeData().children);

                const nodeDescValue = getNodeShortDescValue(self.treeData().account);

                nodes.push(createNode(headerAccountId, cx, 0, self.treeData().account, nodeDescValue));
            }

            self.nodesValues = ko.observableArray(nodes);
            self.linksValues = ko.observableArray(links);

            self.dataSource(new oj.JsonDiagramDataSource({
                nodes: self.nodesValues(),
                links: self.linksValues()
            }));

            self.dataSourceLoaded(true);
        }

        readStructureDetails();

        const selectedNodesValue = self.selectedNodesValue.subscribe(function() {
            if (self.selectedNodesValue() && self.selectedNodesValue().length > 0) {
                const selectedItem = self.selectedNodesValue()[0].split("~")[0],
                    selectedId = self.selectedNodesValue()[0].split("~")[1];

                if (selectedItem === "node" && self.nodeClickHandler) { self.nodeClickHandler(selectedId); } else if (selectedItem === "link" && self.linkClickHandler) { self.linkClickHandler(selectedId); } else if (selectedItem === "morenode" && self.moreClickHandler) { self.moreClickHandler(); }
            }
        });

        /**
         * This function will return css class to be applied to 'more' node.
         *
         *  @memberOf tree-view
         *  @function getCSSclass
         *  @param {object} data  node data object.
         *  @returns {object} returns class name on the basis of the given condition object.
         */
        self.getCSSclass = function(data) {
            const lhsValue = self.moreNodeSvgColor.lhsKey.split(".").reduce(reducer, data);

            for (let i = 0; i < self.moreNodeSvgColor.conditions.length; i++) {
                if (lhsValue === self.moreNodeSvgColor.conditions[i].rhs) {
                    return self.moreNodeSvgColor.conditions[i].value;
                }
            }

            return self.moreNodeSvgColor.defaultValue;
        };

        self.dropLayout = ko.pureComputed(function() {
            return oj.DiagramUtils.getLayout({
                nodes: self.nodesValues(),
                links: self.linksValues(),
                linkDefaults: {
                    path: linkPathFunc,
                    labelLayout: labelLayoutCallback
                }
            });
        }, self);

        self.dispose = function() {
            selectedNodesValue.dispose();
        };
    };
});