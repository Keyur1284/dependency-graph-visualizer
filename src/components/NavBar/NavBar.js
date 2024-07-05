import React, { memo } from 'react';
import PropTypes from 'prop-types';

import './NavBar.css';
import LevelSwitcher from '../LevelSwitcher';
import useManageHistory from '../../hooks/useManageHistory';
import InteractionsSwitcher from '../InteractionsSwitcher';

// eslint-disable-next-line prefer-arrow-callback
const NavBar = memo(function NavBar({
  updateNodes,
  nodesHistory,
  visualizeLevelGraph,
  currentInteractionIndex,
  updateCurrentInteractionIndex,
}) {
  const { showPreviousInteraction, showNextInteraction } = useManageHistory({
    updateNodes,
    nodesHistory,
    currentInteractionIndex,
    updateCurrentInteractionIndex,
  });

  return (
    <div className="navbar">
      <InteractionsSwitcher
        nodesHistory={nodesHistory}
        showNextInteraction={showNextInteraction}
        currentInteractionIndex={currentInteractionIndex}
        showPreviousInteraction={showPreviousInteraction}
      />
      <div className="title">Dependency Graph Visualizer</div>
      <LevelSwitcher visualizeLevelGraph={visualizeLevelGraph} />
    </div>
  );
});

NavBar.propTypes = {
  visualizeLevelGraph: PropTypes.func.isRequired,
  currentInteractionIndex: PropTypes.number.isRequired,
  updateCurrentInteractionIndex: PropTypes.func.isRequired,
  updateNodes: PropTypes.func.isRequired,
  nodesHistory: PropTypes.array.isRequired,
};

export default NavBar;
