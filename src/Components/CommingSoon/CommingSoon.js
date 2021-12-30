import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommingSoon.css';

const CommingSoon = () => (
  <div className="flex h-screen bg-black">
    <div className="m-auto text-white">
      <div className="text-9xl font-light text-[#08BDBD]">HEXITY</div>
      <span className='text-xl text-[#e224c6] font-medium'>Coming soon</span>
      <div className='pt-2'>A community-curated auction house focused on 1/1s, onboarding NFT neophytes and intuitive UI/UX, crosschain, starting with Solana.</div>


      <button className='text-white bg-[#08BDBD] disc-button font-bold py-2 px-4 rounded-full'>Subscribe for updates</button>
    </div>
  
  </div>
);

CommingSoon.propTypes = {};

CommingSoon.defaultProps = {};

export default CommingSoon;
