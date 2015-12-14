
import React, {
  PropTypes,
} from 'react';

// Define stateless functional component.
const ModalHeader = (props) => {
  let closeButton;
  let title;
  if (props.title) {
    title = (
      <div className="modalHeader__title">
        {props.title}
      </div>
    );
  }
  if (props.onClose) {
    closeButton = (
      <div
        className="modalHeader__closeButton"
        onClick={props.onClose}
      >
        x
      </div>
    );
  }
  return (
    <div className="modalHeader">
      {title}
      {closeButton}
    </div>
  );
};

ModalHeader.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

export default ModalHeader;