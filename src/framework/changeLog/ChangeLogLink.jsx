import React from 'react';
import PropTypes from 'prop-types';
import HollowButton from '../button/HollowButton.jsx';

const ChangeLogLink = props => (
  <div className="changeLogLink">
    <HollowButton
      dataId="changeLogButton"
      onClick={props.onClick}
      type={HollowButton.TYPE.LOG}
    >
      Change Log
    </HollowButton>
  </div>
);

ChangeLogLink.propTypes = {
  onClick: PropTypes.func,
};

export default ChangeLogLink;
