
/**
 * The complexity of this component lies in how its state changes based on
 * different types of interaction (mouse vs keyboard). The user can:
 *
 * 1. Click to OPEN and GAIN FOCUS.
 * 2. Click a second time to CLOSE (but retain focus).
 * 3. Tab onto it to GAIN FOCUS.
 * 4. Tab away to CLOSE and LOSE FOCUS.
 * 5. Press down (if focused) to OPEN.
 * 6. Press escape (if focused) to CLOSE.
 * 7. Press enter (if focused) to CLOSE.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

export default class BaseDropdown extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasFocus: false,
      isOpen: false,
      focusedOptionIndex: -1,
      inputValue: '',
      filteredOptions: this.props.options,
    };

    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onClickLabel = this.onClickLabel.bind(this);
    this.onMouseDownLabel = this.onMouseDownLabel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSelectOption = this.onSelectOption.bind(this);
    this.onMouseOverOption = this.onMouseOverOption.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.isOpen && !nextState.isOpen) {
      this.enableScrolling();
    } else if (!this.state.isOpen && nextState.isOpen) {
      this.disableScrolling();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isOpen && this.state.isOpen) {
      this.chooseOpeningDirection();
    }

    if (prevProps.options !== this.props.options) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        filteredOptions: this.filterOptionsList(this.state.inputValue),
      });
    }
  }

  componentWillUnmount() {
    this.enableScrolling();
  }

  onBlur() {
    this.setState({
      hasFocus: false,
      isOpen: false,
      focusedOptionIndex: -1,
      inputValue: '',
      filteredOptions: this.props.options,
    });
  }

  onFocus() {
    this.setState({
      hasFocus: true,
    });
  }

  onMouseDownLabel(event) {
    // Set focus as soon as the mouse is pressed down. Prevent the default
    // behavior, which would take focus away from the input again.
    this.refs.input.focus();
    event.preventDefault();
  }

  onClickLabel(event) {
    // Stop the event from bubbling up. This is useful in situations where
    // the dropdown is inside of a grid row and the row has an onClick handler.
    // By stopping the event from bubbling up, we prevent the row's onClick
    // handler from being called when the dropdown label is clicked.
    event.stopPropagation();
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  onMouseOverOption(index) {
    this.setState({
      focusedOptionIndex: index,
    });
  }

  onChange(event) {
    const { value } = event.target;
    this.setState({
      focusedOptionIndex: -1,
      inputValue: value,
      filteredOptions: this.filterOptionsList(value),
    });
  }

  onKeyDown(event) {
    if ([13, 27, 38, 40].includes(event.keyCode)) {
      event.preventDefault();
    }

    switch (event.keyCode) {
      // Enter
      case 13: {
        // Select the focused option if the dropdown is open.
        if (this.state.isOpen) {
          this.onSelectOption(
            this.state.filteredOptions[this.state.focusedOptionIndex]
          );
        }
        break;
      }

      // Escape
      case 27: {
        this.setState({
          isOpen: false,
        });
        break;
      }

      // Up
      case 38: {
        // Focus the previous option if the dropdown is open.
        if (this.state.isOpen) {
          this.focusPreviousOption();
        }
        break;
      }

      // Down
      case 40: {
        // Open the options and focus the next one.
        this.setState({
          isOpen: true,
        });
        this.focusNextOption();
        break;
      }

      default: {
        break;
      }
    }
  }

  onSelectOption(option) {
    this.props.onSelect(option);
    this.setState({
      isOpen: false,
    });
  }

  chooseOpeningDirection() {
    const EXTRA_SPACE = 10;
    const dropdown = this.refs.input.parentElement;
    const dropdownList = this.refs.optionList;

    const roomBelow = window.innerHeight -
      dropdown.getBoundingClientRect().top -
      dropdown.offsetHeight - document.body.scrollTop;

    if (roomBelow < dropdownList.clientHeight) {
      const roomAbove = dropdown.getBoundingClientRect().top;
      if (roomBelow < roomAbove) {
        dropdownList.style.top = 'inherit';
        dropdownList.style.bottom = 'calc(100% - 1px)';
        dropdownList.style.maxHeight = `${roomAbove - EXTRA_SPACE}px`;
      } else {
        dropdownList.style.maxHeight = `${roomBelow - EXTRA_SPACE}px`;
      }
    }
  }

  enableScrolling() {
    document.querySelector('body').classList.remove('body--noscroll');
  }

  disableScrolling() {
    document.querySelector('body').classList.add('body--noscroll');
  }

  focusNextOption() {
    const focusedOptionIndex =
      this.state.focusedOptionIndex === this.state.filteredOptions.length - 1 ?
      0 :
      this.state.focusedOptionIndex + 1;

    this.setState({
      focusedOptionIndex,
    });
  }

  focusPreviousOption() {
    const focusedOptionIndex =
      this.state.focusedOptionIndex === 0 ?
      this.state.filteredOptions.length - 1 :
      this.state.focusedOptionIndex - 1;

    this.setState({
      focusedOptionIndex,
    });
  }

  filterOptionsList(searchTerm) {
    if (this.props.searchFilter) {
      return this.props.searchFilter(this.props.options, searchTerm);
    }

    return this.props.options;
  }

  render() {
    const labelStateClasses = {};
    if (this.state.hasFocus) {
      labelStateClasses[this.props.labelFocusClasses] = true;
    }
    const labelClasses = classNames(this.props.labelClasses, labelStateClasses);

    const label = this.props.labelProvider(this.props.selectedOption);

    if (this.props.isReadonly) {
      return (
        <div
          data-id={this.props.dataId}
          className={this.props.classes}
        >
          <div
            className={labelClasses}
          >
            {label}
          </div>
        </div>
      );
    }

    const searchBox = this.props.searchFilter ? (
      <div
        onMouseDown={this.onMouseDownLabel}
        className={this.props.dropdownSearchClasses}
      >
        <span className="icon icon-magnifier" />
        {this.state.inputValue || this.props.searchPrompt}
      </div>
    ) : null;

    let optionList;

    if (this.state.isOpen) {
      const options = this.state.filteredOptions.map((option, index) => (
        React.createElement(
          this.props.optionType,
          {
            classes: option && option.classes,
            hasFocus: this.state.focusedOptionIndex === index,
            index,
            isSelected: this.props.selectedOption === option,
            key: index,
            onMouseOver: this.onMouseOverOption,
            onClick: this.onSelectOption,
            option,
          },
          this.props.optionLabelProvider(option)
        )
      ));

      optionList = (
        <div
          ref="optionList"
          className={this.props.optionListClasses}
        >
          {searchBox}
          {options}
        </div>
      );
    }

    return (
      <div
        data-id={this.props.dataId}
        className={this.props.classes}
      >
        {/* Allow this component to be focusable by adding a hidden input. */}
        <input
          ref="input"
          className={this.props.inputClasses}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={this.state.inputValue}
        />
        <div
          className={labelClasses}
          onClick={this.onClickLabel}
          onMouseDown={this.onMouseDownLabel}
        >
          {label}
        </div>
        {optionList}
      </div>
    );
  }

}

BaseDropdown.propTypes = {
  dataId: PropTypes.string,
  classes: PropTypes.string.isRequired,
  inputClasses: PropTypes.string.isRequired,
  labelClasses: PropTypes.string.isRequired,
  labelFocusClasses: PropTypes.string.isRequired,
  optionListClasses: PropTypes.string.isRequired,
  optionType: PropTypes.func.isRequired,
  options: PropTypes.array,
  selectedOption: PropTypes.any,
  onSelect: PropTypes.func.isRequired,
  labelProvider: PropTypes.func.isRequired,
  optionLabelProvider: PropTypes.func.isRequired,
  isReadonly: PropTypes.bool,
  searchFilter: PropTypes.func,
  searchPrompt: PropTypes.string,
  dropdownSearchClasses: PropTypes.string.isRequired,
};

BaseDropdown.defaultProps = {
  options: [],
};
