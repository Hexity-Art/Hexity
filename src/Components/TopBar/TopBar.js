import React from 'react';
import PropTypes from 'prop-types';
import './TopBar.css';

import Wallet from '../Wallet/Wallet';

const TopBar = ({ wallet, setWallet }) => (
  <div className="TopBar">
    <nav class="flex items-center justify-between flex-wrap p-5">
      
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight">hexity</span>
      </div>

      <form class="w-full max-w-sm">
        <div class="flex items-center border-b ">
          <input class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search" />
        </div>
      </form>
      
    
      <div class="w-full block lg:flex lg:items-center lg:w-2/4">
        <div class="text-sm lg:flex-grow">
          <a href="#responsive-header" class="topbar-text block mt-4 text-base lg:w-1/6 lg:inline-block lg:mt-0 text-white mr-4">
            Discover
          </a>
          <a href="#responsive-header" class="topbar-text block mt-4 text-base lg:w-1/6 lg:inline-block lg:mt-0 text-white mr-4">
            List
          </a>
          <a href="#responsive-header" class="topbar-text block mt-4 text-base lg:w-1/6 lg:inline-block lg:mt-0 text-white mr-4">
            Mint
          </a>
          <a href="#responsive-header" class="topbar-text block mt-4 text-base lg:w-1/6 lg:inline-block lg:mt-0 text-white mr-4">
            Learn
          </a>
          <a href="#responsive-header" class=" block mt-4 text-base lg:w-1/5 lg:inline-block lg:mt-0 text-white ">
            <Wallet 
            wallet={wallet}
            setWallet={setWallet}
            />
          </a>
        </div>
      
      </div>
    
    </nav>
    
  </div>
);

TopBar.propTypes = {};

TopBar.defaultProps = {};

export default TopBar;
