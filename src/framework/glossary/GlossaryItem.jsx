import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GlossaryProvider from './GlossaryProvider';
import GlossaryTooltip from './GlossaryTooltip';

class GlossaryItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      glossaryItem: null,
    };

    this.onGlossaryLoad = this.onGlossaryLoad.bind(this);
  }

  componentDidMount() {
    GlossaryProvider.subscribe(this.onGlossaryLoad);
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      GlossaryProvider.unsubscribe(this.onGlossaryLoad);
      GlossaryProvider.subscribe(this.onGlossaryLoad);
    }
  }

  componentWillUnmount() {
    GlossaryProvider.unsubscribe(this.onGlossaryLoad);
  }

  onGlossaryLoad(glossary) {
    this.setState({ glossaryItem: glossary[this.props.id] });
  }

  render() {
    const { children, dataId, iconPosition = 'before' } = this.props;
    const { glossaryItem } = this.state;

    if (glossaryItem) {
      return (
        <GlossaryTooltip
          dataId={dataId}
          link={glossaryItem.link}
          linkText={glossaryItem.linkText}
          message={glossaryItem.definition}
          iconPosition={glossaryItem.iconPosition || iconPosition}
        >
          {children}
        </GlossaryTooltip>
      );
    }

    return null;
  }
}

GlossaryItem.propTypes = {
  children: PropTypes.any,
  dataId: PropTypes.string,
  id: PropTypes.string.isRequired,
  iconPosition: PropTypes.string,
};

export default GlossaryItem;
