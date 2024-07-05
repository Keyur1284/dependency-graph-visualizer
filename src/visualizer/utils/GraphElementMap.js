/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import _split from 'lodash/split';
import _reduce from 'lodash/reduce';
import _toArray from 'lodash/toArray';

import { getTitleText } from './elements';
import { CLASS_NAMES, ARROW_WITH_OPTIONAL_WHITESPACE_REGEX } from './constants';

class GraphElementMap {
  constructor(edges, nodes) {
    this.elementMap = this.buildMap(edges, nodes);
  }

  buildMap(edges, nodes) {
    const titleToNodeMap = this.buildTitleToNodeMap(nodes);
    return _reduce(_toArray(edges), this.addEdgeToMap(titleToNodeMap), {});
  }

  buildTitleToNodeMap(nodes) {
    return _reduce(_toArray(nodes), this.addNodeToMap, {});
  }

  addNodeToMap(map, node) {
    const titleText = getTitleText(node);

    if (titleText) {
      map[titleText] = node;
    }

    return map;
  }

  addEdgeToMap(nodeMap) {
    return (edgeMap, edge) => {
      const titleText = getTitleText(edge);

      if (titleText) {
        const { from, to } = this.getEdgeFromTitle(titleText);

        edgeMap[titleText] = [
          { element: nodeMap[from], type: CLASS_NAMES.CURRENT },
          { element: nodeMap[to], type: CLASS_NAMES.CURRENT },
        ];

        edgeMap[from] = edgeMap[from] ?? [];
        edgeMap[from].push({ element: edge, type: CLASS_NAMES.FROM });
        edgeMap[from].push({ element: nodeMap[to], type: CLASS_NAMES.CURRENT });
        edgeMap[to] = edgeMap[to] ?? [];
        edgeMap[to].push({ element: edge, type: CLASS_NAMES.TO });
        edgeMap[to].push({ element: nodeMap[from], type: CLASS_NAMES.CURRENT });
      }

      return edgeMap;
    };
  }

  getEdgeFromTitle(string) {
    const [from, to] = _split(string, ARROW_WITH_OPTIONAL_WHITESPACE_REGEX);
    return { from, to };
  }

  getElement(titleText) {
    return (titleText && this.elementMap[titleText]) ?? [];
  }
}

export default GraphElementMap;
