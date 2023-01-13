import React from "react";
// import { useConnect } from "../../hooks/use-connect";
import { MetaMask } from "../../../assets/svg";

import styles from "./ConnectWallet.module.css";

export const ConnectMetaMask = () => {
  return (
    <div className={styles.option}>
      <span className={styles.connectIcon}>
        <MetaMask />
      </span>
      MetaMask
    </div>
  );
};
