import { useCallback } from 'react';

const useManageHistory = ({ currentInteractionIndex, nodesHistory, updateNodes, updateCurrentInteractionIndex }) => {
  const showPreviousInteraction = useCallback(() => {
    updateCurrentInteractionIndex(currentInteractionIndex - 1);
    updateNodes(nodesHistory[currentInteractionIndex - 1].nodes);
  }, [currentInteractionIndex, nodesHistory]);

  const showNextInteraction = useCallback(() => {
    updateCurrentInteractionIndex(currentInteractionIndex + 1);
    updateNodes(nodesHistory[currentInteractionIndex + 1].nodes);
  }, [currentInteractionIndex, nodesHistory]);

  return {
    showPreviousInteraction,
    showNextInteraction,
  };
};

export default useManageHistory;
