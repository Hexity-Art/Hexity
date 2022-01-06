import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {BiWallet} from 'react-icons/bi';
import './Wallet.css';

const Wallet = ({ wallet, setWallet}) => {
  
  const [simplifiedAddress, setSimplifiedAddress] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      // setIsLoading(true);
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          setWallet(solana);
          simplifyAddress(solana.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
      // setIsLoading(false);
    } catch (error) {
      console.error(error);
      // setIsLoading(false);
    }
  };

  const simplifyAddress = (address) => {
    setSimplifiedAddress(address.substring(0, 5) + "..." + address.slice(-5));
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const connectWallet = async () => {
    // setIsLoading(true);
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      setWallet(solana);
      simplifyAddress(solana.publicKey.toString());
    }
    // setIsLoading(false);
  };



  return (
    <div className="hover:scale-105 flex rounded p-0.5 items-center justify-between Wallet css-selector px-1 py-1">
      <BiWallet/>
      {!wallet && <button className="" onClick={connectWallet}>
         Connect Wallet
      </button>}
      {wallet && <p>
        {simplifiedAddress}
      </p>}
    </div>
  );
};

// Wallet.propTypes = {};

// Wallet.defaultProps = {};

export default Wallet;
