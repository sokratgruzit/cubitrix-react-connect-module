import React from "react";
import { useConnect } from "../../hooks/use-connect";
import { WalletConnect } from "../../../assets/svg";
import styles from "./ConnectWallet.module.css";

export const ConnectWallet = () => {
  const { connect, disconnect, account } = useConnect();
  return (
    <div className={styles.option}>
      <span className={styles.connectIcon}>
        <WalletConnect />
      </span>
      WalletConnect
    </div>
  );
};
