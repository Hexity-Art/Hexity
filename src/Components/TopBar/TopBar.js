import React from 'react';
import PropTypes from 'prop-types';
import './TopBar.css';

import Wallet from '../Wallet/Wallet';

const TopBar = ({ wallet, setWallet }) => (
  <div className="TopBar">
    <Wallet 
      wallet={wallet}
      setWallet={setWallet}
    />
    TopBar Component
  </div>
);

TopBar.propTypes = {};

TopBar.defaultProps = {};

export default TopBar;
