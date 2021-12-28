import React from 'react';
import PropTypes from 'prop-types';
import './Home.css';

import TopBar from '../../Components/TopBar/TopBar';

const Home = () => (
    <div className="Home">
        <TopBar />
        Home page
    </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;