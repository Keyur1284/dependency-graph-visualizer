import _size from 'lodash/size';
import _split from 'lodash/split';

// eslint-disable-next-line import/no-unresolved
import dependencyGraph from '../dependencyGraph.json';
import { resetNodesAndEdges, getTitleText } from './elements';
import { ESCAPE, CLASS_NAMES, ARROW_WITH_OPTIONAL_WHITESPACE_REGEX } from './constants';
import {
  highlightGraphElements,
  isTitleChanged,
  filterNodes,
  getChildrenNodes,
  handleEdgeType,
  removeChildrenNodes,
} from './handlerUtils';

export const getKeyboardEventHandler = graphMode => {
  const keyboardEventHandler = keyboardEvent => {
    if (keyboardEvent.key === ESCAPE) {
      resetNodesAndEdges();
      graphMode.setToHover();
    }
  };

  return keyboardEventHandler;
};

export const getHoverHandler = ({ graphMode, graphElementMap }) => {
  let currentHighlightedTitle;

  const hoverHighlightHandler = mouseEvent => {
    const closestNodeOrEdge = mouseEvent.target.closest(`.${CLASS_NAMES.NODE}, .${CLASS_NAMES.EDGE}`);
    const closestTitleText = getTitleText(closestNodeOrEdge);

    if (isTitleChanged({ currentHighlightedTitle, closestTitleText }) && graphMode.getMode() === graphMode.HOVER) {
      highlightGraphElements({ graphMode, graphElementMap, closestNodeOrEdge, closestTitleText });
      currentHighlightedTitle = closestTitleText;
    }
  };

  return hoverHighlightHandler;
};

export const getSelectHandler = ({ graphMode, graphElementMap }) => {
  let currentHighlightedTitle;

  const selectHighlightHandler = mouseEvent => {
    mouseEvent.preventDefault();

    const closestNodeOrEdge = mouseEvent.target.closest(`.${CLASS_NAMES.NODE}, .${CLASS_NAMES.EDGE}`);
    const closestTitleText = getTitleText(closestNodeOrEdge);

    if (closestNodeOrEdge) {
      graphMode.setToSelect();
    } else {
      graphMode.setToHover();
    }

    if (isTitleChanged({ currentHighlightedTitle, closestTitleText })) {
      highlightGraphElements({ graphElementMap, closestNodeOrEdge, closestTitleText });
      currentHighlightedTitle = closestTitleText;
    }
  };

  return selectHighlightHandler;
};

export const getNodeClickHandler = ({
  element,
  nodes,
  updateNodes,
  updateCurrentInteractionIndex,
  nodesHistory,
  updateNodesHistory,
}) => {
  const nodeClickHandler = mouseEvent => {
    mouseEvent.preventDefault();
    const { nodeToIdMap, nodes: allNodes } = dependencyGraph;
    const titleText = getTitleText(element);
    const selectedNode = allNodes[nodeToIdMap[titleText]];

    if (selectedNode.isFile) {
      return;
    }

    const childrenNodes = getChildrenNodes({ node: selectedNode, allNodes });
    const filteredNodes = filterNodes({ childrenNodes, nodes, selectedNode });
    updateNodes(filteredNodes);
    updateNodesHistory(prevNodesHistory => [
      ...prevNodesHistory,
      { nodes: filteredNodes, message: `Clicked on node ${titleText}` },
    ]);
    updateCurrentInteractionIndex(_size(nodesHistory));
  };

  return nodeClickHandler;
};

export const getEdgeClickHandler = ({
  element,
  nodes,
  updateNodes,
  updateCurrentInteractionIndex,
  nodesHistory,
  updateNodesHistory,
}) => {
  const edgeClickHandler = mouseEvent => {
    mouseEvent.preventDefault();
    const { nodeToIdMap, nodes: allNodes } = dependencyGraph;
    const titleText = getTitleText(element);
    const [fromNodeText, toNodeText] = _split(titleText, ARROW_WITH_OPTIONAL_WHITESPACE_REGEX);
    const fromNode = allNodes[nodeToIdMap[fromNodeText]];
    const toNode = allNodes[nodeToIdMap[toNodeText]];

    if (fromNode.isFile && toNode.isFile) {
      return;
    }

    const childrenNodesOfFromNode = getChildrenNodes({ node: fromNode, allNodes });
    const childrenNodesOfToNode = getChildrenNodes({ node: toNode, allNodes });
    const filteredNodes = handleEdgeType({ fromNode, toNode, nodes, childrenNodesOfFromNode, childrenNodesOfToNode });
    updateNodes(filteredNodes);
    updateNodesHistory(prevNodesHistory => [
      ...prevNodesHistory,
      { nodes: filteredNodes, message: `Clicked on edge between ${fromNodeText} and ${toNodeText}` },
    ]);
    updateCurrentInteractionIndex(_size(nodesHistory));
  };

  return edgeClickHandler;
};

export const getClusterClickHandler = ({
  element,
  nodes,
  updateNodes,
  updateCurrentInteractionIndex,
  nodesHistory,
  updateNodesHistory,
}) => {
  const clusterClickHandler = mouseEvent => {
    mouseEvent.preventDefault();
    const { nodeToIdMap, nodes: allNodes } = dependencyGraph;
    const titleText = getTitleText(element);

    const selectedCluster = allNodes[nodeToIdMap[titleText]];

    if (!selectedCluster) return;

    const filteredNodes = removeChildrenNodes({ allNodes, nodes, selectedCluster });
    updateNodes([selectedCluster, ...filteredNodes]);
    updateNodesHistory(prevNodesHistory => [
      ...prevNodesHistory,
      { nodes: [selectedCluster, ...filteredNodes], message: `Closed cluster ${titleText}` },
    ]);
    updateCurrentInteractionIndex(_size(nodesHistory));
  };

  return clusterClickHandler;
};
