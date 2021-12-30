import React from 'react';
import PropTypes from 'prop-types';
import './Home.css';

import TopBar from '../../Components/TopBar/TopBar';
import CommingSoon from '../../Components/CommingSoon/CommingSoon';

const Home = () => (
    <div className="Home">
        <CommingSoon />
    </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;