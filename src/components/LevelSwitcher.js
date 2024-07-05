import React, { memo } from 'react';
import _map from 'lodash/map';
import _range from 'lodash/range';
import PropTypes from 'prop-types';
import _parseInt from 'lodash/parseInt';

const MAX_LEVELS_TO_DISPLAY = 3;

// eslint-disable-next-line prefer-arrow-callback
const LevelSwitcher = memo(function LevelSwitcher({ visualizeLevelGraph }) {
  const handleLevelButton = event => {
    visualizeLevelGraph(_parseInt(event.target.id));
  };

  return (
    <div className="levels">
      Change level
      {_map(_range(MAX_LEVELS_TO_DISPLAY), level => (
        <button id={level} key={level} type="button" className="level-button" onClick={handleLevelButton}>
          {level}
        </button>
      ))}
    </div>
  );
});

LevelSwitcher.propTypes = {
  visualizeLevelGraph: PropTypes.func.isRequired,
};

export default LevelSwitcher;
