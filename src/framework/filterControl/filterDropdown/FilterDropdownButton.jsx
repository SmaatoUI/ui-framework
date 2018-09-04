
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const FilterDropdownButton = (props) => {
  const classes = classNames('filterDropdownButton', {
    'is-filter-dropdown-open': props.isOpen,
  });

  return (
    <div
      className={classes}
      onClick={props.onClick}
    >
      <div className="filterDropdownButton__addButton" />
    </div>
  );
};

FilterDropdownButton.propTypes = {
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default FilterDropdownButton;
