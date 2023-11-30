import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const useConnect = () => {
  const [connectionLoading, setConnectionLoading] = useState(false);

  const isConnected = useSelector((state) => state.connect.isConnected);
  const providerType = useSelector((state) => state.connect.providerType);
  
  const dispatch = useDispatch();
  let { activate, account, library, deactivate, chainId, active, error, connector } = useWeb3React();

  async function MetaMaskEagerlyConnect(injected, connectCallback, errCallback) {
    if (providerType === "metaMask") {
      try {
        injected.isAuthorized().then((isAuthorized) => {
          if (isAuthorized && isConnected) {
            connect(providerType, injected, connectCallback);
          } else {
            dispatch({
              type: "UPDATE_STATE",
              account: "",
              isConnected: false,
              providerType: "",
            });
            dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
            if (errCallback) {
              errCallback();
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function WalletConnectEagerly(walletConnect, connectCallback, errCallback) {
    if (providerType === "walletConnect") {
      try {
        if (isConnected) {
          setTimeout(() => {
            connect(providerType, walletConnect, connectCallback);
          }, 0);
        } else {
          dispatch({
            type: "UPDATE_STATE",
            account: "",
            isConnected: false,
            providerType: "",
          });
          dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
          if (errCallback) {
            errCallback();
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const switchToBscTestnet = async (params = []) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: params,
        });
        dispatch({
          type: "CONNECTION_ERROR",
          payload: "",
        });
      } else {
        console.log("Can't setup the BSC Testnet on BSC network");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async (providerType, provider, callback, errorCallback) => {
    if (typeof window.ethereum === "undefined" && providerType === "metaMask") {
      dispatch({
        type: "CONNECTION_ERROR",
        payload: "No MetaMask detected",
      });
      return;
    }

    if (providerType === "metaMask") {
      setConnectionLoading(true);
    }

    if (active) {
      await disconnect();
    }

    if (providerType === "metaMask") {
      try {
        new Promise((resolve, reject) => {
          activate(provider, undefined, true).then(resolve).catch(reject);
        })
          .then(() => {
            if (callback) callback();
            dispatch({
              type: "UPDATE_STATE",
              isConnected: true,
              providerType,
            });
          })
          .catch((e) => {
            dispatch({ type: "UPDATE_STATE", account: "", isConnected: false });
  
            if (
              e.toString().startsWith("UnsupportedChainIdError") ||
              e.toString().startsWith("t: Unsupported chain id")
            ) {
              dispatch({
                type: "CONNECTION_ERROR",
                payload: "Please switch your network in wallet",
              });
              // if (injected instanceof WalletConnectConnector) {
              //   injected.walletConnectProvider = undefined;
              // }
            }
  
            if (errorCallback) errorCallback();
          })
          .finally(() => {
            setTimeout(() => {
              dispatch({ type: "SET_TRIED_RECONNECT", payload: true });
            }, 500);
  
            setConnectionLoading(false);
          });
      } catch (error) {
        console.log("Error on connecting: ", error);
      }
    }

    if (providerType === "walletConnect") {
      console.log(provider)
    }
  };

  async function disconnect() {
    try {
      if (library && library.provider && library.provider.close) {
        await library.provider.close();
      }

      deactivate();

      dispatch({
        type: "UPDATE_STATE",
        account: "",
        providerType: "",
      });
    } catch (error) {
      console.log("Error on disconnect: ", error);
    }
  }

  async function web3PersonalSign(library, account, message, callback, errCallback) {
    try {
      const signature = await library.eth.personal.sign(message, account);
      if (callback) callback(account, signature);
    } catch (err) {
      if (errCallback) errCallback(err);
    }
  }

  const values = useMemo(
    () => ({
      account: account ?? "",
      active,
      connect,
      disconnect,
      library,
      connectionLoading,
      chainId,
      MetaMaskEagerlyConnect,
      WalletConnectEagerly,
      switchToBscTestnet,
      web3PersonalSign,
    }),
    [account, active, connectionLoading, chainId, library],
  );

  return values;
};
