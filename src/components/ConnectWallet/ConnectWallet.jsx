import React, { useState } from "react";
import useConnect from "../../hooks/use-connect";

import styles from "./ConnectWallet.module.css";

const ConnectWallet = () => {
  const [ walletModal, setWalletModal ] = useState(false);

  const { connect, disconnect, account, accountC, balance, isConnected, chainIdC } = useConnect();
  console.log(accountC, balance, isConnected, chainIdC);
  const handleModalOpen = (state) => {
    setWalletModal(state);
  };

  return (
    <>
      <p>{account}</p>
      {account ? (
        <div className={styles.button} onClick={() => disconnect()}>
          Disconnect
        </div>
      ) : (
        <div className={styles.button} onClick={() => handleModalOpen(true)}>
          Connect Wallet
        </div>
      )}
      <div
        style={{ display: walletModal ? "flex" : "none" }}
        className={styles.modalContainer}
      >
        <div onClick={() => handleModalOpen(false)} className={styles.closeModal}>
          X
        </div>
        <div
          className={styles.leftBtn}
          onClick={() => {
            handleModalOpen(false);
            connect("metaMask");
          }}
        >
          Metamask
        </div>
        <div
          className={styles.rightBtn}
          onClick={() => {
            handleModalOpen(false);
            connect("walletConnect");
          }}
        >
          WalletConnect
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;
