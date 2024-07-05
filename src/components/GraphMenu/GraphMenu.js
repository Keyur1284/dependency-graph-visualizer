import _filter from 'lodash/filter';
import PropTypes from 'prop-types';
import _toLower from 'lodash/toLower';
import _includes from 'lodash/includes';
import React, { useState, useCallback, useMemo, memo } from 'react';

import './GraphMenu.css';
import SearchBar from '../SearchBar';
import MenuContent from '../MenuContent';
import menuIcon from '../../assets/menuIcon.svg';
import closeIcon from '../../assets/closeIcon.svg';
import useFilterNodesToHide from '../../hooks/useFilterNodesToHide';

// eslint-disable-next-line prefer-arrow-callback
const GraphMenu = memo(function GraphMenu({ nodes, hiddenNodes, updateHiddenNodes }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = useMemo(
    () => _filter(nodes, node => _includes(_toLower(node.name), _toLower(searchQuery))),
    [nodes, searchQuery],
  );
  const { toggleCheckbox, handleSubmit, handleSelectAll, selectedNodes } = useFilterNodesToHide({
    nodes,
    hiddenNodes,
    filteredNodes,
    updateHiddenNodes,
    updateMenuOpen: setMenuOpen,
  });
  const handleCloseMenu = useCallback(() => setMenuOpen(false), [setMenuOpen]);
  const showMenu = useCallback(() => setMenuOpen(true), [setMenuOpen]);

  return (
    <div>
      {isMenuOpen ? (
        <div className="hamburger-menu">
          <div className="menu-header">
            <div>Visible Nodes</div>
            <button type="button" className="close-button" onClick={handleCloseMenu}>
              <img src={closeIcon} alt="close" />
            </button>
          </div>
          <SearchBar searchQuery={searchQuery} updateSearchQuery={setSearchQuery} />
          <MenuContent
            filteredNodes={filteredNodes}
            selectedNodes={selectedNodes}
            handleSubmit={handleSubmit}
            handleSelectAll={handleSelectAll}
            toggleCheckbox={toggleCheckbox}
          />
        </div>
      ) : (
        <button type="button" className="menu-button" onClick={showMenu}>
          <img src={menuIcon} alt="menu" />
        </button>
      )}
    </div>
  );
});

GraphMenu.propTypes = {
  nodes: PropTypes.array.isRequired,
  hiddenNodes: PropTypes.array.isRequired,
  updateHiddenNodes: PropTypes.func.isRequired,
};

export default GraphMenu;
