import _size from 'lodash/size';
import { useCallback } from 'react';

import getLevelNodes from '../visualizer/utils/buildGraph';

const useLevelGraphVisualization = ({
  updateNodes,
  nodesHistory,
  updateHiddenNodes,
  updateNodesHistory,
  updateCurrentInteractionIndex,
}) => {
  const visualizeLevelGraph = useCallback(
    level => {
      const levelNodes = getLevelNodes(level);
      updateNodes(levelNodes);
      updateHiddenNodes([]);
      updateNodesHistory(prevNodesHistory => [
        ...prevNodesHistory,
        { nodes: levelNodes, message: `Visualizing level ${level}` },
      ]);
      updateCurrentInteractionIndex(_size(nodesHistory));
    },
    [updateNodes, updateNodesHistory, updateCurrentInteractionIndex, nodesHistory],
  );

  return {
    visualizeLevelGraph,
  };
};

export default useLevelGraphVisualization;
