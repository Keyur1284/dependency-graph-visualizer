import _size from 'lodash/size';
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import leftArrow from '../assets/leftArrow.svg';
import rightArrow from '../assets/rightArrow.svg';

// eslint-disable-next-line prefer-arrow-callback
const InteractionsSwitcher = memo(function InteractionsSwitcher({
  currentInteractionIndex,
  showPreviousInteraction,
  showNextInteraction,
  nodesHistory,
}) {
  return (
    <div className="directions">
      <button
        type="button"
        onClick={showPreviousInteraction}
        disabled={currentInteractionIndex === 0}
        className="arrow-button">
        <img src={leftArrow} alt="previous" className="arrow" />
      </button>
      <button
        type="button"
        onClick={showNextInteraction}
        disabled={currentInteractionIndex === _size(nodesHistory) - 1}
        className="arrow-button">
        <img src={rightArrow} alt="next" className="arrow" />
      </button>
    </div>
  );
});

InteractionsSwitcher.propTypes = {
  currentInteractionIndex: PropTypes.number.isRequired,
  showPreviousInteraction: PropTypes.func.isRequired,
  showNextInteraction: PropTypes.func.isRequired,
  nodesHistory: PropTypes.array.isRequired,
};

export default InteractionsSwitcher;
