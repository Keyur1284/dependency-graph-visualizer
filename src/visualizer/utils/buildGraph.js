import _map from 'lodash/map';
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';
import _includes from 'lodash/includes';

// eslint-disable-next-line import/no-unresolved
import dependencyGraph from '../dependencyGraph.json';

const getNodesClone = nodes =>
  _map(nodes, node => ({
    ...node,
    dependencies: [],
  }));

const addDependency = ({ currentNode, dependencyID, visitedNodesIds }) => {
  if (!_includes(currentNode.dependencies, dependencyID) && dependencyID !== currentNode.id) {
    currentNode.dependencies.push(dependencyID);
    visitedNodesIds.add(dependencyID);
    visitedNodesIds.add(currentNode.id);
  }
};

const addDependenciesToNode = ({ currentNode, node, nodes, nodeToLevelMap, visitedNodesIds }) => {
  const { dependencies } = node;

  _forEach(dependencies, dependencyID => {
    const levelDiff = nodeToLevelMap[dependencyID] - currentNode.level;

    if (levelDiff === 0) {
      addDependency({ currentNode, dependencyID, visitedNodesIds });
      return;
    }

    if (levelDiff > 0) {
      const levelDependencyID = nodes[dependencyID].levelWiseParents[levelDiff - 1];
      addDependency({ currentNode, dependencyID: levelDependencyID, visitedNodesIds });
    }
  });
};

const filterNodeDependencies = ({ currentLevelNodes, nodes, nodeToLevelMap }) => {
  const copyOfCurrentLevelNodes = getNodesClone(currentLevelNodes);
  const visitedNodesIds = new Set();

  _forEach(currentLevelNodes, node => {
    const copyNode = _find(copyOfCurrentLevelNodes, { id: node.id });
    addDependenciesToNode({
      node,
      nodes,
      visitedNodesIds,
      nodeToLevelMap,
      currentNode: copyNode,
    });
  });

  return _filter(copyOfCurrentLevelNodes, node => visitedNodesIds.has(node.id));
};

const getLevelNodes = level => {
  const { nodes, nodeToLevelMap } = dependencyGraph;
  const currentLevelNodes = _filter(nodes, { level });
  return filterNodeDependencies({ currentLevelNodes, nodes, nodeToLevelMap });
};

export default getLevelNodes;
