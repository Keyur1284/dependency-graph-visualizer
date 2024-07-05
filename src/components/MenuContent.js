import _map from 'lodash/map';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';
import _reduce from 'lodash/reduce';
import React, { useMemo, useCallback, memo } from 'react';

import Checkbox from './CheckBox';

// eslint-disable-next-line prefer-arrow-callback
const MenuContent = memo(function MenuContent({
  filteredNodes,
  selectedNodes,
  handleSubmit,
  handleSelectAll,
  toggleCheckbox,
}) {
  const handleCheckboxChange = useCallback(event => toggleCheckbox(event.target.id), [toggleCheckbox]);
  const areAllNodesChecked = useMemo(
    () => _reduce(filteredNodes, (result, node) => result && selectedNodes[node.id], true),
    [filteredNodes, selectedNodes],
  );

  return (
    <div>
      <div className="menu-content">
        <div className="checkbox-container">
          <input
            type="checkbox"
            className="checkbox"
            name="selectAll"
            checked={areAllNodesChecked}
            onChange={handleSelectAll}
          />
          Select All
        </div>
        {_map(_sortBy(filteredNodes, 'name'), node => (
          <Checkbox key={node.id} node={node} isChecked={selectedNodes[node.id]} onChange={handleCheckboxChange} />
        ))}
      </div>
      <button type="button" className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
});

MenuContent.propTypes = {
  filteredNodes: PropTypes.array.isRequired,
  selectedNodes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  toggleCheckbox: PropTypes.func.isRequired,
};

export default MenuContent;
