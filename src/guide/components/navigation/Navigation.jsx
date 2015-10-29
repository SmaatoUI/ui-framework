
// Import exports from various modules.
import React, {
  Component,
  PropTypes,
} from 'react';

import NavButton from './NavButton.jsx';
import NavTitle from './NavTitle.jsx';

import classNames from 'classnames';

// Define the component class and provide it as an export.
export default class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
  }

  onToggleNav() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  onClickNavButton() {
    this.setState({
      isMenuOpen: false,
    });
  }

  render() {
    const navItems = [];

    navItems.push(
      <NavTitle key="components">Components</NavTitle>
    );

    for (let i = 0; i < this.props.componentRoutes.length; i++) {
      const route = this.props.componentRoutes[i];
      navItems.push(
        <NavButton
          path={route.path}
          onClick={this.onClickNavButton.bind(this)}
          key={`component${i}`}
        >
          {route.name}
        </NavButton>
      );
    }

    navItems.push(
      <NavTitle key="integrations">Integrations</NavTitle>
    );

    for (let i = 0; i < this.props.integrationRoutes.length; i++) {
      const route = this.props.integrationRoutes[i];
      navItems.push(
        <NavButton
          path={route.path}
          onClick={this.onClickNavButton.bind(this)}
          key={`integration${i}`}
        >
          {route.name}
        </NavButton>
      );
    }

    const navMenuClasses = classNames('examplesNavMenu', {
      'is-examples-nav-menu-visible': this.state.isMenuOpen,
    });

    const navMenu = (
      <div
        className={navMenuClasses}
      >
        {navItems}
      </div>
    );

    return (
      <div>
        <div
          className="examplesNavMenuButton"
          onClick={this.onToggleNav.bind(this)}
        >
          Nav
        </div>
        {navMenu}
      </div>
    );
  }

}

Navigation.propTypes = {
  componentRoutes: PropTypes.array,
  integrationRoutes: PropTypes.array,
};