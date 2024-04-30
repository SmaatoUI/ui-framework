/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import React from 'react';

const GLOSSARY_LOADED_EVENT = 'GLOSSARY_LOADED_EVENT';
const GLOSSARY_STATUS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  FAILED: 'FAILED',
};

window.__GLOSSARY_DATA = {};
window.__GLOSSARY_STATUS = GLOSSARY_STATUS.UNLOADED;

class GlossaryProvider extends React.Component {
  static subscribe(listener) {
    if (!listener) {
      throw new Error('Listener function not passed to subscribe.');
    }

    if (window.__GLOSSARY_STATUS === GLOSSARY_STATUS.LOADED) {
      listener(window.__GLOSSARY_DATA);
    }

    document.addEventListener(GLOSSARY_LOADED_EVENT, listener);
  }

  static unsubscribe(listener) {
    if (!listener) {
      throw new Error('Listener function not passed to unsubscribe.');
    }

    document.removeEventListener(GLOSSARY_LOADED_EVENT, listener);
  }

  componentDidMount() {
    const fetchGlossary = async () => {
      window.__GLOSSARY_STATUS = GLOSSARY_STATUS.LOADING;

      const data = await this.props.queryFn();

      window.__GLOSSARY_STATUS = GLOSSARY_STATUS.LOADED;
      window.__GLOSSARY_DATA = data;

      const event = new CustomEvent(GLOSSARY_LOADED_EVENT, {
        detail: window.__GLOSSARY_DATA,
      });
      document.dispatchEvent(event);
    };

    fetchGlossary().catch(
      () => { window.__GLOSSARY_STATUS = GLOSSARY_STATUS.FAILED; }
    );
  }

  render() {
    return this.props.children;
  }
}

GlossaryProvider.propTypes = {
  queryFn: PropTypes.func.isRequired,
  children: PropTypes.any,
};

export default GlossaryProvider;
