import _forEach from 'lodash/forEach';

import {
  getHoverHandler,
  getSelectHandler,
  getNodeClickHandler,
  getEdgeClickHandler,
  getClusterClickHandler,
  getKeyboardEventHandler,
} from './utils/handlers';
import Mode from './utils/Mode';
import { CLASS_NAMES } from './utils/constants';
import GraphElementMap from './utils/GraphElementMap';

const initializeEventHandlers = ({
  nodes,
  updateNodes,
  updateCurrentInteractionIndex,
  nodesHistory,
  updateNodesHistory,
}) => {
  const addClickEventListeners = ({ elements, handler }) => {
    _forEach(elements, element => {
      element.addEventListener(
        'click',
        handler({ element, nodes, updateNodes, updateCurrentInteractionIndex, nodesHistory, updateNodesHistory }),
      );
    });
  };

  const graphMode = new Mode();
  const svgNodes = document.getElementsByClassName(CLASS_NAMES.NODE);
  const svgEdges = document.getElementsByClassName(CLASS_NAMES.EDGE);
  const svgClusters = document.getElementsByClassName(CLASS_NAMES.CLUSTER);

  const graphElementMap = new GraphElementMap(svgEdges, svgNodes);

  document.addEventListener('contextmenu', getSelectHandler({ graphMode, graphElementMap }));
  document.addEventListener('mouseover', getHoverHandler({ graphMode, graphElementMap }));
  document.addEventListener('keydown', getKeyboardEventHandler(graphMode));

  addClickEventListeners({ elements: svgNodes, handler: getNodeClickHandler });
  addClickEventListeners({ elements: svgEdges, handler: getEdgeClickHandler });
  addClickEventListeners({ elements: svgClusters, handler: getClusterClickHandler });
};

export default initializeEventHandlers;
