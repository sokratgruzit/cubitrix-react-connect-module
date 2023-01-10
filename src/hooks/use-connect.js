import { useState, useEffect, useMemo } from "react";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import axios from "../api/axios";

const useConnect = () => {
  const { activate, account, library, active, deactivate, chainId } = useWeb3React();

  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask

  const [ isConnected, setIsConnected ] = useState(false);
  const [ providerType, setProviderType ] = useState("");
  const [ balance, setBalance ] = useState(0);
  const [ accountC, setAccountC ] = useState("");
  const [ chainIdC, setChainIdC ] = useState("");

  if (window.ethereum === undefined) console.log("error");

  //check if you are connected to an account on supported chain. If so get a balance and set info in global state. else set default info.
  useEffect(() => {
    if (library && account && chainId) {
      const fetchData = async () => {
        library.eth.getBalance(account).then(async (res) => {
          setBalance(+res);
          setAccountC(account);
          setChainIdC(chainId);
          
          // automatically send request for login
          const fetchData = async () => {
            await axios
              .post("/accounts/login", {
                address: account,
                balance: +res,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err.message);
              });
          };
          fetchData();
        });
      };
      fetchData();
    } else {
      setBalance(0);
      setAccountC("");
      setChainIdC("");
      console.log('bla')
    }
  }, [library, account, chainId]);

  // check if user has connected before and try to reconnect. persists user login state across refreshes.
  useEffect(() => {
    async function fetchData() {
      if (isConnected) {
        connect(providerType);
      }
    }
    fetchData();
  }, []);

  // watch user active status and save it in global store for persist.
  useEffect(() => {
    setIsConnected(active);
  }, [active]);

  // console.log(useSelector((state) => state.connect));

  // Connect to wallet
  const connect = async (providerType) => {
    setShouldDisable(true);
    try {
      if (providerType === "metaMask") {
        activate(injected, undefined, true).catch(() => {
          console.log("Please switch your network in wallet");
        });
        setShouldDisable(false);
        setProviderType("metaMask");
        setIsConnected(true);
      } else if (providerType === "walletConnect") {
        activate(walletConnect, undefined, true).catch(() => {
          console.log("Please switch your network in wallet");
        });
        setShouldDisable(false);
        setProviderType("walletConnect");
        setIsConnected(true);
      }

      if (library && account && chainId) {
        const fetchData = async () => {
          library.eth.getBalance(account).then(async (res) => {
            setBalance(+res);
            setAccountC(account);
            setChainIdC(chainId);

            // automatically send request for login
            const fetchData = async () => {
              await axios
                .post("/accounts/login", {
                  address: account,
                  balance: +res,
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err.message);
                });
            };
            fetchData();
          });
        };
        fetchData();
      }
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    try {
      deactivate();
      setProviderType("");
      setIsConnected(false);
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  };

  const values = useMemo(
    () => ({
      account,
      connect,
      disconnect,
      library,
      shouldDisable,
      providerType,
      chainId,
    }),
    [account, shouldDisable, providerType, chainId, balance, chainIdC, accountC, isConnected],
  );

  return values;
};

export default useConnect;
