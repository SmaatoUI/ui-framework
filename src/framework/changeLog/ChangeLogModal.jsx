import classNames from 'classnames';
import moment from 'moment';
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import Column from '../columnLayout/Column.jsx';
import ColumnLayout from '../columnLayout/ColumnLayout.jsx';
import Modal from '../modal/Modal.jsx';
import ModalBody from '../modal/ModalBody.jsx';
import ModalFooter from '../modal/footer/ModalFooter.jsx';
import ModalHeader from '../modal/header/ModalHeader.jsx';
import PrimaryButton from '../button/PrimaryButton.jsx';
import Progress from '../progress/Progress.jsx';
import Text from '../text/Text.jsx';
import VerticalLayout from '../verticalLayout/VerticalLayout.jsx';

export default class ChangeLogModal extends Component {
  renderChanges() {
    return this.props.changes.map((change, index) => {
      let changeIconClass;
      let changeText;

      switch (change.type) {
        case 'D': {
          changeIconClass = 'icon-remove-circle-red';
          changeText =
            `Removed ${change.field} "${change.oldValue}" by ${change.user}`;
          break;
        }

        case 'I': {
          changeIconClass = 'icon-plus-circle-green';
          changeText =
            `Added ${change.field} "${change.newValue}" by ${change.user}`;
          break;
        }

        case 'U': {
          changeIconClass = 'icon icon-edit-blue';
          changeText =
            `Changed ${change.field} from "${change.oldValue}"
            to "${change.newValue}" by ${change.user}`;
          break;
        }

        default:
          break;
      }

      const changeIcon = (
        <span
          className={classNames(
            'changeLogModalChangeIcon',
            'icon',
            changeIconClass
          )
          }
        />
      );

      const changeDate = new Date(change.time);
      const changeTime = (
        <span className="changeLogModalChangeTime">
          {moment(changeDate).format('MMM DD, YYYY @ hh:mmA').toUpperCase()}
        </span>
      );

      return (
        <ColumnLayout key={index}>
          <Column width={4}>
            <Text>
              {changeIcon}
              {changeTime}
            </Text>
          </Column>
          <Column width={8}>
            <Text>
              <span
                className="changeLogModalChangeText"
                data-id={`changeLogModalChangeText-${index}`}
              >
                {changeText}
              </span>
            </Text>
          </Column>
        </ColumnLayout>
      );
    });
  }

  render() {
    let modalBodyContent;

    if (this.props.isLoadingChanges || !this.props.changes) {
      modalBodyContent = (
        <div style={{ textAlign: 'center' }}>
          <Progress />
        </div>
      );
    } else if (!this.props.changes.length) {
      modalBodyContent = (
        <div style={{ textAlign: 'center' }}>
          <Text>No Changes.</Text>
        </div>
      );
    } else {
      modalBodyContent = (
        <VerticalLayout>
          {this.renderChanges()}
        </VerticalLayout>
      );
    }

    return (
      <Modal
        index={this.props.index}
        stackCount={this.props.stackCount}
        width={this.props.width}
      >
        <ModalHeader
          onClose={this.props.onClose}
          type={ModalHeader.TYPE.LOG}
        >
          Change Log
        </ModalHeader>

        <ModalBody>
          <span data-id="changeLogContentPanel">
            {modalBodyContent}
          </span>
        </ModalBody>

        <ModalFooter
          right={(
            <PrimaryButton
              dataId="changeLogModalOkButton"
              onClick={this.props.onClose}
            >
              OK
            </PrimaryButton>
          )}
        />
      </Modal>
    );
  }

}

ChangeLogModal.MODAL_WIDTH = 800;

ChangeLogModal.propTypes = {
  changes: PropTypes.array,
  index: Modal.propTypes.index,
  isLoadingChanges: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  stackCount: Modal.propTypes.stackCount,
  width: PropTypes.number,
};

ChangeLogModal.defaultProps = {
  changes: [],
  width: ChangeLogModal.MODAL_WIDTH,
};
