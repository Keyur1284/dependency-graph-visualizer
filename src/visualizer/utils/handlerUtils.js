import _filter from 'lodash/filter';
import _reduce from 'lodash/reduce';
import _toArray from 'lodash/toArray';
import _forEach from 'lodash/forEach';

import { CLASS_NAMES } from './constants';
import { resetNodesAndEdges, addHighlight } from './elements';

export const highlightGraphElements = ({ graphElementMap, closestNodeOrEdge, closestTitleText }) => {
  resetNodesAndEdges();
  addHighlight({ element: closestNodeOrEdge, type: CLASS_NAMES.CURRENT });
  _forEach(graphElementMap.getElement(closestTitleText), addHighlight);
};

export const isTitleChanged = ({ currentHighlightedTitle, closestTitleText }) =>
  !(currentHighlightedTitle === closestTitleText);

const createUniqueNodes = ({ childrenNodes, nodes }) => new Set([...childrenNodes, ...nodes]);

const filterExcludedNodes = ({ nodes, excludeIds }) => _filter(nodes, node => !excludeIds.has(node.id));

const markIncludedNodesAndDependencies = ({ nodes, excludeIds }) => {
  const visitedNodesIds = new Set();

  _forEach(nodes, node => {
    _forEach(node.allDependencies, dependencyID => {
      if (excludeIds.has(dependencyID)) {
        return;
      }

      visitedNodesIds.add(dependencyID);
      visitedNodesIds.add(node.id);
    });
  });

  return visitedNodesIds;
};

export const filterNodes = ({ childrenNodes, nodes, selectedNode }) => {
  const uniqueNodes = createUniqueNodes({ childrenNodes, nodes });
  const nodesToVisualize = filterExcludedNodes({
    nodes: _toArray(uniqueNodes),
    excludeIds: new Set([selectedNode.id]),
  });
  const visitedNodesIds = markIncludedNodesAndDependencies({
    nodes: nodesToVisualize,
    excludeIds: new Set([selectedNode.id]),
  });

  return _filter(nodesToVisualize, node => visitedNodesIds.has(node.id));
};

export const filterToAndFromNodes = ({ childrenNodes, nodes, fromNode, toNode }) => {
  const uniqueNodes = createUniqueNodes({ childrenNodes, nodes });
  const nodesToVisualize = filterExcludedNodes({
    nodes: _toArray(uniqueNodes),
    excludeIds: new Set([fromNode.id, toNode.id]),
  });
  const visitedNodesIds = markIncludedNodesAndDependencies({
    nodes: nodesToVisualize,
    excludeIds: new Set([fromNode.id, toNode.id]),
  });

  return _filter(nodesToVisualize, node => visitedNodesIds.has(node.id));
};

export const getChildrenNodes = ({ node, allNodes }) =>
  _reduce(
    node.children,
    (acc, childID) => {
      acc.push(allNodes[childID]);
      return acc;
    },
    [],
  );

export const handleEdgeType = ({ fromNode, toNode, nodes, childrenNodesOfFromNode, childrenNodesOfToNode }) => {
  if (fromNode.isFile) {
    return filterNodes({ childrenNodes: childrenNodesOfToNode, nodes, clickedNode: toNode });
  }

  if (toNode.isFile) {
    return filterNodes({ childrenNodes: childrenNodesOfFromNode, nodes, clickedNode: fromNode });
  }

  return filterToAndFromNodes({
    childrenNodes: [...childrenNodesOfToNode, ...childrenNodesOfFromNode],
    nodes,
    fromNode,
    toNode,
  });
};

export const removeChildrenNodes = ({ allNodes, nodes, selectedCluster }) => {
  const nodesToProcess = [...selectedCluster.children];
  const childrenNodesToRemove = new Set();

  while (nodesToProcess.length > 0) {
    const nodeID = nodesToProcess.pop();
    const node = allNodes[nodeID];
    childrenNodesToRemove.add(nodeID);
    nodesToProcess.push(...node.children);
  }

  return filterExcludedNodes({ nodes, excludeIds: childrenNodesToRemove });
};
