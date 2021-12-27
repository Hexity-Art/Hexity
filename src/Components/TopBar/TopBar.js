import React from 'react';
import PropTypes from 'prop-types';
import './TopBar.css';

import Wallet from '../Wallet/Wallet';

const TopBar = () => (
  <div className="TopBar">
    <Wallet />
    TopBar Component
  </div>
);

TopBar.propTypes = {};

TopBar.defaultProps = {};

export default TopBar;
