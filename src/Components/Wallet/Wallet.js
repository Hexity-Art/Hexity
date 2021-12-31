import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Wallet.css';

const Wallet = ({ wallet, setWallet }) => {
  const checkIfWalletIsConnected = async () => {
    try {
      // setIsLoading(true);
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected with pubkey:", solana.publicKey.toString(), solana);
          setWallet(solana);
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
      console.log('Connected with Public Key:', solana.publicKey.toString(), solana);
      setWallet(solana);
    }
    // setIsLoading(false);
  };

  const disconnectWallet = async () => {
    // setIsLoading(true);
    const { solana } = window;

    if (solana) {
      const response = await solana.disconnect();
      console.log('Disconnected', solana);
      setWallet(null);
    }
    // setIsLoading(false);
  };

  return (
    <div className="Wallet">
      {!wallet && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {wallet && (
        <div>
          <p>
            Connected to {wallet.publicKey.toString()}
          </p>
          <button onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

// Wallet.propTypes = {};

// Wallet.defaultProps = {};

export default Wallet;
