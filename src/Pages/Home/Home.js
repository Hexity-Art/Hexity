import React from 'react';
import PropTypes from 'prop-types';
import './Home.css';

import TopBar from '../../Components/TopBar/TopBar';

const Home = ({ wallet, setWallet }) => (
    <div className="Home">
        <TopBar 
          wallet={wallet}
          setWallet={setWallet}
        />
        Home page
    </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;