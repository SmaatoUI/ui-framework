
// Import exports from various modules.
import React, {
  PropTypes,
} from 'react';

import classNames from 'classnames';

// Define stateless functional component.
const Button = props => {
  function onClick(event) {
    // onClick is optional, so exit early if it doesn't exist.
    if (!props.onClick) {
      return;
    }
    // Don't even trigger the onClick handler if we're disabled.
    if (props.disabled) {
      return;
    }
    props.onClick(event);
  }

  const classes = classNames('button', props.classes, {
    'is-button-disabled': props.disabled,
  });

  let icon;

  if (props.iconClasses) {
    const iconClasses = classNames('button__icon', props.iconClasses);
    icon = (
      <span className={iconClasses}></span>
    );
  }

  let label;

  if (props.label) {
    label = (
      <span className="button__label">
        {props.label}
      </span>
    );
  }

  return (
    <a
      className={classes}
      onClick={onClick}
    >
      {icon}
      {label}
    </a>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  iconClasses: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  classes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
};

Button.defaultProps = {
  type: 'button',
};

export default Button;