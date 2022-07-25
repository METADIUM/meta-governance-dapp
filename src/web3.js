import Web3 from "web3";
import {
  MAINNET_CHAIN_INFO,
  TESTNET_CHAIN_INFO,
  MAINNET_CONTRACTS,
  TESTNET_CONTRACTS,
  walletTypes,
} from "./constants";
import * as abis from "./abis/index";

const isDev = process.env.NODE_ENV === "development";

// get network deploy informations
export const chainInfo = isDev ? TESTNET_CHAIN_INFO : MAINNET_CHAIN_INFO;
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

// call contract method (no value)
export const onlyCallContractMethod = async (web3, contract, method) => {
  const data = await web3.web3Contracts[contract].methods[method]().call();
  return data;
};

// call contract method (with value)
export const callContractMethod = async (
  web3,
  contract,
  method,
  value = null
) => {
  const data = await web3.web3Contracts[contract].methods[method](value).call();
  return data;
};

// encodeABI (value in method)
export const encodeABIValueInMethod = (web3, contract, method, ...value) => {
  try {
    let trxData = {
      to: getContractAddr(contract),
    };
    switch (method) {
      case "addProposalToAddMember":
      case "addProposalToChangeMember": {
        const {
          staker,
          voter,
          reward,
          name,
          enode,
          ip,
          port,
          lockAmount,
          memo,
          duration,
          oldStaker,
        } = value[0];
        trxData.data = web3.web3Contracts.GovImp.methods
          .addProposalToChangeMember(
            [
              staker,
              voter,
              reward,
              name,
              enode,
              ip,
              port,
              lockAmount,
              memo,
              duration,
            ],
            method === "addProposalToChangeMember" ? oldStaker : null
          )
          .encodeABI();
        break;
      }
      case "addProposalToChangeEnv": {
        const { envName, envType, envVal, memo, duration } = value[0];
        trxData.data = web3.web3Contracts.GovImp.methods
          .addProposalToChangeEnv(envName, envType, envVal, memo, duration)
          .encodeABI();
        break;
      }
      default: {
        trxData.data = web3.web3Contracts[contract].methods[method](
          ...value
        ).encodeABI();
        break;
      }
    }
    return trxData;
  } catch (err) {
    return err;
  }
};

// encodeABI (value in trxData)
export const encodeABIValueInTrx = (web3, contract, method, value) => {
  try {
    let trxData = {
      to: getContractAddr(contract),
      value,
      data: web3.web3Contracts[contract].methods[method]().encodeABI(),
    };

    return trxData;
  } catch (err) {
    return err;
  }
};

// get contract address
const getContractAddr = (contract) => {
  const contracts = isDev ? TESTNET_CONTRACTS : MAINNET_CONTRACTS;
  const address = contracts.filter((item) => {
    return item.name === contract;
  })[0].address;

  return address;
};

// get accounts
export const getAccounts = async (walletType) => {
  const { META_MASK, WALLET_CONNECT, COIN_BASE } = walletTypes;
  let account;

  switch (walletType) {
    case META_MASK:
      account = await web3Instance.web3.eth.requestAccounts();
      return account[0];
    case WALLET_CONNECT:
    case COIN_BASE:
      account = await web3Instance.web3.eth.getAccounts();
      return account[0];
    default:
  }
};

export { web3Instance };
export default getWeb3Instance;
