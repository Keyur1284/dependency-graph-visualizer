import React, { memo } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line prefer-arrow-callback
const Checkbox = memo(function Checkbox({ node, isChecked = false, onChange }) {
  return (
    <div className="checkbox-container">
      <input type="checkbox" className="checkbox" id={node.id} name={node.id} checked={isChecked} onChange={onChange} />
      <label htmlFor={node.name}>{node.name}</label>
    </div>
  );
});

Checkbox.propTypes = {
  node: PropTypes.object.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
