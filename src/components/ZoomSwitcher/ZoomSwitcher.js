import React from 'react';
import PropTypes from 'prop-types';

import './ZoomSwitcher.css';

const ZoomSwitcher = ({ handleZoomIn, handleZoomOut, handleReset }) => (
  <div className="zoom-controls">
    <button type="button" onClick={handleZoomOut}>
      Zoom Out
    </button>
    <button type="button" onClick={handleReset}>
      Reset
    </button>
    <button type="button" onClick={handleZoomIn}>
      Zoom In
    </button>
  </div>
);

ZoomSwitcher.propTypes = {
  handleZoomIn: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};

export default ZoomSwitcher;
