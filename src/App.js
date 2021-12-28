// import logo from './logo.svg';
import './App.css';

import ArtCreateView from "./views/artCreate";

import React, { useState, useEffect } from "react";
import { Keypair, LAMPORTS_PER_SOL, Loader, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { MintLayout, TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, programs, actions, NodeWallet } from '@metaplex/js';
import solKP from "./keypairs/solKeypair.json";
import arKP from "./keypairs/arKeypair.json";

import axios from "axios";

import Arweave from "arweave";
import { BN } from 'bn.js';


const arweave = Arweave.init({});
const {
  Creator, 
  Metadata, 
  MetadataDataData,  
  MetadataProgram, 
  MasterEdition, 
  CreateMetadata, 
  CreateMasterEdition ,
} = programs.metadata;
const {
  CreateMint,
  CreateAssociatedTokenAccount,
  MintTo,
} = programs;
const { sendTransaction } = actions;

const network = process.env.REACT_APP_SOLANA_NETWORK;
const opts = {
  preflightCommitment: 'processed',
};

const appAccount = Keypair.fromSecretKey(Uint8Array.from(Object.values(solKP._keypair.secretKey)));
// const appArwStore = JSON.parse(arKP);

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("DedJwASgXeWYFRdU1ktCD3hZPNgt17E2T3BH2a5kr3mB");
  const [attributes, setAttributes] = useState({
    name: 'New Name, Who Dis?',
    symbol: 'NNWD',
    // description: '',
    // external_url: '',
    uri: 'https://arweave.net/WhbvSR4Q_eF3HYHxz1HmYCv9SW79BSm67VQSsX2anlY',
    // animation_url: undefined,
    // attributes: undefined,
    sellerFeeBasisPoints: 0,
    creators: [],
    // properties: {
    //   files: [],
      // category: MetadataCategory.Image,
    // },
  });

  const getProvider = () => {
    const connection = new Connection(network);

    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );

    return provider;
  }

  const checkIfWalletIsConnected = async () => {
    try {
      setIsLoading(true);
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected with pubkey:", response.publicKey.toString());
          setWalletAddress(response.publicKey);
          setAttributes({ 
            ...attributes,
            creators: [
              new Creator({
                address: response.publicKey.toString(),
                share: 100,
                verified: true,
              }),
            ],
          });
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey);
      setAttributes({ 
        ...attributes,
        creators: [
          new Creator({
            address: response.publicKey.toString(),
            share: 100,
            verified: true,
          }),
        ],
      });
    }
    setIsLoading(false);
  };

  const getAirdrop = async (wallet, num) => {
    try{
      setIsLoading(true);

      const connection = new Connection(network);
      let sig = await connection.requestAirdrop(new PublicKey(wallet), num * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, { commiment: "confirmed" });
      console.log("Sig:", sig);

      setIsLoading(false);
    } catch(e){
      console.log(e);
      setIsLoading(false);
    }
  }

  const mint = async () => {
    try{
      setIsLoading(true);
      const connection = new Connection(network);

      let bal = await connection.getBalance(appAccount.publicKey);
      // console.log(bal);
      if(bal < LAMPORTS_PER_SOL){
        await getAirdrop(appAccount.publicKey, 3);
      }

      const token = await Token.createMint(connection, appAccount, appAccount.publicKey, null, 0, TOKEN_PROGRAM_ID);
      console.log("tok:", token.publicKey.toString());

      const appTknAcnt = await token.getOrCreateAssociatedAccountInfo(appAccount.publicKey);
      console.log("assos acnt", appTknAcnt.address.toString());

      await token.mintTo(appTknAcnt.address, appAccount, [], 1);
      console.log(appTknAcnt.amount.toString());

      await token.setAuthority(token.publicKey, null, "MintTokens", appAccount.publicKey, []);
      console.log("minting disabled");
      // await token.mintTo(appTknAcnt.address, appAccount, [], 1);
      // console.log(appTknAcnt.amount.toString());

      await createMetadata(token.publicKey);

      // console.log(token);

      const toTknAcnt = await token.getOrCreateAssociatedAccountInfo(walletAddress);
      console.log("to acont", toTknAcnt.address.toString());

      const tx = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          appTknAcnt.address,
          toTknAcnt.address,
          appAccount.publicKey,
          [],
          1
        )
      );
      // console.log("tx:", tx);

      const sig = await sendAndConfirmTransaction(connection, tx, [appAccount], { commitment: "confirmed"});
      console.log("sig:", sig);

      setTokenAddress(token.publicKey.toString());

      setIsLoading(false);
    } catch(e){
      console.log(e);
      setIsLoading(false);
    }
  }

  const createMetadata = async () => {
    try {
      setIsLoading(true);

      const connection = new Connection(network);

      const mint = Keypair.generate();
      const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
      const mintParams = {
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
        decimals: 0,
        owner: appAccount.publicKey,
      }
      const createMintTx = new CreateMint(
        { feePayer: appAccount.publicKey },
        mintParams,
      );      

      const metadataPDA = await Metadata.getPDA(mint.publicKey);
      const metadataData = new MetadataDataData({
        name: attributes.name,
        symbol: attributes.symbol,
        uri: attributes.uri,
        sellerFeeBasisPoints: attributes.sellerFeeBasisPoints,
        creators: null, // Creator (user) must sign tx, null for now
      });
      const metadataParams = {
        metadata: metadataPDA,
        metadataData: metadataData,
        updateAuthority: appAccount.publicKey,
        mint: mint.publicKey,
        mintAuthority: appAccount.publicKey,
      }
      const createMetadataTx = new CreateMetadata(
        { feePayer: appAccount.publicKey }, 
        metadataParams
      );

      const recipient = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        appAccount.publicKey,
      );
      const createAssociatedTokenAccountTx = new CreateAssociatedTokenAccount(
        { feePayer: appAccount.publicKey },
        {
          associatedTokenAddress: recipient,
          splTokenMintAddress: mint.publicKey,
        },
      );

      const mintToParams = {
        mint: mint.publicKey,
        dest: recipient,
        amount: new BN(1),
        authority: appAccount.publicKey,
      }
      const mintToTx = new MintTo(
        { feePayer: appAccount.publicKey },
        mintToParams,
      )

      const masterPDA = await MasterEdition.getPDA(mint.publicKey);
      const masterEditionParams = {
        edition: masterPDA,
        metadata: metadataPDA,
        updateAuthority: appAccount.publicKey,
        mint: mint.publicKey,
        mintAuthority: appAccount.publicKey,  
        maxSupply: new BN(1),
      }
      const masterEditionTx = new CreateMasterEdition(
        { feePayer: appAccount.publicKey },
        masterEditionParams,
      );
      
      // console.log(createMetadataTx, masterEditionTx);
      console.log(mint.publicKey.toString(), )

      const tx = await sendTransaction({
        connection,
        signers: [mint],
        txs: [
          createMintTx,
          createMetadataTx,
          createAssociatedTokenAccountTx,
          mintToTx,
          masterEditionTx,
        ],
        wallet: new NodeWallet(appAccount)
      });

      console.log(tx);

      setLoading(false);
    } catch(e){
      setIsLoading(false);
      console.log(e);
    }
  }


  // test();

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const setLoading = (bool) => {
    setIsLoading(bool);
  }

  const setURI = (uri) => {
    setAttributes({
      ...attributes,
      uri: uri,
    });
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      {!walletAddress && renderNotConnectedContainer()}
      {walletAddress && (
        <button disabled={isLoading} onClick={() => { getAirdrop(walletAddress, 1) }}>
          Request Airdrop
        </button>
      )}
      {walletAddress && (
        <button disabled={isLoading} onClick={mint}>
          Mint
        </button>
      )}
      {walletAddress && (
        <button 
          disabled={isLoading} 
          onClick={() => { 
            const connection = new Connection(network);

            const token = new Token(connection, new PublicKey(tokenAddress), TOKEN_PROGRAM_ID, appAccount);
            createMetadata(token);
          }}
        >
          Create Metadata
        </button>
      )}
      {walletAddress && (
        <ArtCreateView
          isLoading={isLoading}
          setLoading={setLoading}
          attributes={attributes}
          setURI={setURI}
        >
        </ArtCreateView>
      )}
      {/* <input id="img" type="file" accept=".png,.jpg,.gif,.svg" onChange={onFileChange}/> */}
    </div>
  );
}

export default App;
