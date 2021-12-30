import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommingSoon.css';

const CommingSoon = () => (
  <div className="flex h-screen CommingSoon">
    
    <div className="m-auto text-white">
      <div className="text-9xl">HEXITY</div>
      <span className='text-xl'>Comming soon</span>
      <div>A 1/1 blockchain auction house focused on creators</div>


      <button className='discord-button text-white font-bold py-2 px-4 rounded-full'>Discord</button>
    </div>
  
  </div>
);

CommingSoon.propTypes = {};

CommingSoon.defaultProps = {};

export default CommingSoon;
