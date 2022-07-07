import Web3 from "web3";
import {
  MAINNET_CHAIN_INFO,
  TESTNET_CHAIN_INFO,
  MAINNET_CONTRACTS,
  TESTNET_CONTRACTS,
} from "./constants";
import * as abis from "./abis/index";

const isDev = process.env.NODE_ENV === "development";

// get network deploy informations
const chainInfo = isDev ? TESTNET_CHAIN_INFO : MAINNET_CHAIN_INFO;
const contracts = isDev ? TESTNET_CONTRACTS : MAINNET_CONTRACTS;

// set contracts
const initContracts = async (web3) => {
  let contractInstance = {};

  // take contract addresses and abi files, set each contract object
  contracts.map(async (item) => {
    contractInstance = {
      ...contractInstance,
      [item.name]: new web3.eth.Contract(abis[item.name].abi, item.address),
    };
  });
  return contractInstance;
};

let web3Instance;
const getWeb3Instance = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      // set default web3 instance
      const { rpcUrls } = chainInfo;
      const web3 = new Web3(rpcUrls);

      if (web3) {
        const web3Contracts = await initContracts(web3);
        web3Instance = {
          web3,
          web3Contracts,
          isDev,
          netName: isDev ? "TESTNET" : "MAINNET",
        };
        resolve(web3Instance);
      } else {
        // web3 is not found
        reject(new Error("No web3 instance injected."));
        return;
      }
    });
  });
};

export { web3Instance };
export default getWeb3Instance;
