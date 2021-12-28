import React, { useState, useEffect } from "react";
import { Upload } from "antd";
import { Connection } from '@metaplex/js';

import Arweave from "arweave";
import arKP from "../keypairs/arKeypair.json";

import fs from "fs";

import fileToArrayBuffer from "file-to-array-buffer";


const arweave = Arweave.init({});
const { Dragger } = Upload;
const network = process.env.REACT_APP_SOLANA_NETWORK;



const ArtCreateView = ({ isLoading, setLoading, attributes, setURI }) => {
  const [newImg, setNewImg] = useState(undefined);
  const [txID, setTxID] = useState(null);
  // const [name, setName] = useState('');
  // const [basisFee, setBasisFee] = useState(0);

  const uploadImage = async() => {
    let address = await arweave.wallets.jwkToAddress(arKP);
    console.log(address);

    // arweave.transactions.getStatus("t_hvEAfcXLqVpx3x0FkLx0NLBPLjyGBl3iPrl6Smgwo").then(res => {
    //   console.log(res);
    // });

    // const result = await arweave.blocks.get("Vdcr3eX8hDCf6XjJlmPHlyQ1JDDiKxYmjUT3xEhZGIB7wsUiGxfI4wW61X9MZK8D"); 
    // console.log(result);

    try {
      setLoading(true);

      arweave.wallets.getBalance(address).then((bal) => {
        console.log(arweave.ar.winstonToAr(bal));
      });

      let data = await fileToArrayBuffer(newImg);
      
      let tx1 = await arweave.createTransaction({
        data: data
      }, arKP);
      tx1.addTag("Content-Type", "image/png");
      
      await arweave.transactions.sign(tx1, arKP);

      let uploader = await arweave.transactions.getUploader(tx1);

      while(!uploader.isComplete){
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      }

      console.log(tx1);

      arweave.transactions.getStatus(tx1.id).then(res => {
        console.log(res);
        if(res.status >= 200 && res.status <= 300){
          setTxID(tx1.id);

          // setImage("https://arweave.net/" + tx1.id);
        }
      });

      uploadData("https://arweave.net/" + tx1.id);
      
      setLoading(false);
    } catch(e){
      setLoading(false);
      console.log(e);
    }
  }
  
  const uploadData = async(imgLink) => {
    try {
      const data = {
        ...attributes,
        image: imgLink,
      }
      
      let tx1 = await arweave.createTransaction({
        data: JSON.stringify(data),
      }, arKP);
      tx1.addTag("Content-Type", "text/plain");
      
      await arweave.transactions.sign(tx1, arKP);

      let uploader = await arweave.transactions.getUploader(tx1);

      while(!uploader.isComplete){
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      }

      console.log(tx1);

      arweave.transactions.getStatus(tx1.id).then(res => {
        console.log(res);
        if(res.status >= 200 && res.status <= 300){
          setTxID(tx1.id);

          setURI("https://arweave.net/" + tx1.id);
        }
      });
      
    } catch(e){
      console.log(e);
    }
  }

  const test = async () => {
    const connection = new Connection(network);
    // const tokenPubkey = "6RfDGxghEi7M3sMaVrvAN7bTomG1m11gV9VBAEkd3g8T";
    // console.log(newImg);

    // let { data } = await axios.get("https://qorjxwntoxclfshx6hlm424oihsf35hb2dzl2c6sviefz32d4zca.arweave.net/g6Kb2bN1xLLI9_HWzmuOQeRd9OHQ8r0L0qoIXO9D5kQ/?ext=png");
    // console.log(data);
    // const info = await connection.getAccountInfo(new PublicKey(tokenAddress));
    // console.log(info.owner.toString(), MetadataProgram.PUBKEY.toString());
    // const ownedMetadata = await Metadata.load(connection, tokenAddress);
    // console.log(ownedMetadata);

    // let obj = {
    //   connection,
    //    wallet: new NodeWallet(appAccount), 
    //    uri: "", 
    //    maxSupply: 1
    // }
    // actions.mintNFT(obj)

    // console.log(connection);
  }

  return (
    <>
      <Dragger
        accept=".png,.jpg,.gif,.mp4,.svg"
        style={{ padding: 20, background: 'rgba(255, 255, 255, 0.08)' }}
        multiple={false}
        onRemove={() => {
          setNewImg(undefined);
          // setFile(undefined);
        }}
        customRequest={info => {
          // dont upload files here, handled outside of the control
          info?.onSuccess?.({}, null);
        }}
        fileList={newImg ? [newImg] : []}
        onChange={async info => {
          const file = info.file.originFileObj;

          if (!file) {
            return;
          }

          // console.log(file);

          setNewImg(file);
          // setCoverArtError(undefined);
        }}
      >
        <div className="ant-upload-drag-icon">
          <h3 style={{ fontWeight: 700 }}>
            Click to upload image (PNG, JPG, GIF, SVG)
          </h3>
        </div>
        {/* {coverArtError ? (
          <Text type="danger">{coverArtError}</Text>
        ) : (
          <p className="ant-upload-text" style={{ color: '#6d6d6d' }}>
            Drag and drop, or click to browse
          </p>
        )} */}
      </Dragger>
      <button disabled={isLoading} onClick={uploadImage}>
        Upload
      </button>
    </>
  )
}

export default ArtCreateView;