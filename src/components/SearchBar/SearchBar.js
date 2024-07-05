import React, { memo } from 'react';
import PropTypes from 'prop-types';

import './SearchBar.css';

// eslint-disable-next-line prefer-arrow-callback
const SearchBar = memo(function SearchBar({ searchQuery, updateSearchQuery }) {
  const handleInputChange = event => {
    updateSearchQuery(event.target.value);
  };

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search for files"
      value={searchQuery}
      onChange={handleInputChange}
    />
  );
});

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
};

export default SearchBar;
