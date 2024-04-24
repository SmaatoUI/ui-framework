
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

import BaseDropdown from '../base/dropdown/BaseDropdown.jsx';
import DropdownDot from './dropdownDot/DropdownDot.jsx';
import DropdownOption from './DropdownOption.jsx';

export {
  default as DropdownDot,
} from './dropdownDot/DropdownDot.jsx';

export {
  default as DropdownOption,
} from './DropdownOption.jsx';

export default class Dropdown extends Component {

  constructor(props) {
    super(props);

    this.labelProvider = this.labelProvider.bind(this);

    this.dropdownDotColorToClassesMap = {
      [DropdownDot.COLOR.BLUE]: 'dropdownLabel--blue',
      [DropdownDot.COLOR.GREEN]: 'dropdownLabel--green',
      [DropdownDot.COLOR.GREY]: 'dropdownLabel--grey',
      [DropdownDot.COLOR.RED]: 'dropdownLabel--red',
    };
  }

  labelProvider(option) {
    let label = this.props.labelProvider(option);

    if (this.props.dotColor) {
      label = [
        <DropdownDot
          color={this.props.dotColor}
          key={0}
        />,
        <span
          className={this.dropdownDotColorToClassesMap[this.props.dotColor]}
          key={1}
        >
          {label}
        </span>,
      ];
    }

    return label;
  }

  render() {
    const labelClasses = classNames(this.props.labelClasses, {
      'dropdownLabel--borderless': this.props.isBorderless,
      'dropdownLabel--readonly': this.props.isReadonly,
    });

    const extendedProps = Object.assign({}, this.props, {
      labelClasses,
      labelProvider: this.labelProvider,
    });

    return (
      <BaseDropdown
        {...extendedProps}
      />
    );
  }

}

Dropdown.propTypes = Object.assign({}, BaseDropdown.propTypes, {
  dotColor: DropdownDot.propTypes.color,
  isBorderless: PropTypes.bool,
});

Dropdown.defaultProps = Object.assign({}, BaseDropdown.defaultProps, {
  classes: 'dropdown',
  inputClasses: 'dropdown__input',
  labelClasses: 'dropdownLabel',
  labelFocusClasses: 'is-dropdown-label-focus',
  optionListClasses: 'dropdownOptionList',
  optionType: DropdownOption,
  dropdownSearchClasses: 'dropdownSearch',
  searchPrompt: 'Start typing to search...',
});
