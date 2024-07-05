/* eslint-disable no-param-reassign */
import _join from 'lodash/join';
import { toDot } from 'ts-graphviz';
import _split from 'lodash/split';
import _slice from 'lodash/slice';
import _random from 'lodash/random';
import _reduce from 'lodash/reduce';
import _forEach from 'lodash/forEach';
import _includes from 'lodash/includes';

import setupGraph from './setupGraph';
import { BACKSLASH, rootModules } from './utils/constants';
import { fileNodeProperties, folderNodeProperties, hierarchicalColorArray } from './utils/graphProperties';

const getHierarchicalColor = modules => {
  const depth = modules.length - 1;
  const maxHierarchicalDepth = Math.min(Object.keys(hierarchicalColorArray).length - 1, depth);
  return hierarchicalColorArray[maxHierarchicalDepth][
    _random(0, hierarchicalColorArray[maxHierarchicalDepth].length - 1)
  ];
};

const colorMap = _reduce(
  rootModules,
  (result, { name, color }) => {
    const modules = _split(name, BACKSLASH);
    const module = modules[modules.length - 1];
    result[module] = color ?? getHierarchicalColor(modules);
    return result;
  },
  {},
);

const getColor = ({ fullName, label }) => {
  if (colorMap[label]) return colorMap[label];

  const modules = _split(fullName, BACKSLASH);
  colorMap[label] = getHierarchicalColor(modules);
  return colorMap[label];
};

const createSubGraph = ({ modules, graph }) =>
  _reduce(
    modules,
    (currentGraph, label, index) =>
      currentGraph.createSubgraph(_join(_slice(modules, 0, index + 1), BACKSLASH), {
        label,
        fillcolor: getColor({ fullName: _join(_slice(modules, 0, index + 1), BACKSLASH), label }),
        margin: 50,
        cluster: true,
      }),
    graph,
  );

const addFileToGraph = ({ name, graph }) => {
  const modules = _split(name, BACKSLASH);
  const label = modules.pop();
  const subGraph = createSubGraph({ modules, graph });
  const node = subGraph.createNode(name);

  node.attributes.apply({
    label,
    fillcolor: _includes(name, '.') ? fileNodeProperties.fillcolor : getColor({ fullName: name, label }),
    height: _includes(name, '.') ? fileNodeProperties.height : folderNodeProperties.height,
    shape: _includes(name, '.') ? fileNodeProperties.shape : folderNodeProperties.shape,
    width: _includes(name, '.') ? fileNodeProperties.width : folderNodeProperties.width,
  });

  return node;
};

const generateDotSchema = nodes => {
  const graph = setupGraph();
  const nodesMap = _reduce(
    nodes,
    (map, { name, id }) => {
      map[id] = addFileToGraph({ name, graph });
      return map;
    },
    {},
  );

  _forEach(nodes, ({ id, allDependencies }) => {
    _forEach(allDependencies, dependencyID => {
      if (nodesMap[dependencyID]) {
        graph.createEdge([nodesMap[id], nodesMap[dependencyID]]);
      }
    });
  });

  return toDot(graph);
};

export default generateDotSchema;
