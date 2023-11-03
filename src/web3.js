import Web3 from "web3"

import * as abis from "./abis/index"
import {
  MAINNET_CHAIN_INFO,
  TESTNET_CHAIN_INFO,
  DEVNET_CHAIN_INFO,
  MAINNET_CONTRACTS,
  TESTNET_CONTRACTS,
  walletTypes,
  DEVMETANET_CONTRACTS
} from "./constants"

const type = process.env.REACT_APP_MODE
const network = process.env.REACT_APP_NETWORK_TYPE

// get network deploy informations
export const chainInfo =
  type === "production"
    ? MAINNET_CHAIN_INFO
    : type === "testnet"
      ? TESTNET_CHAIN_INFO
      : DEVNET_CHAIN_INFO
const contracts =
  network === "mainnet"
    ? MAINNET_CONTRACTS
    : network === "testnet"
      ? TESTNET_CONTRACTS
      : DEVMETANET_CONTRACTS

// set contracts
const initContracts = async (web3) => {
  let contractInstance = {}

  // take contract addresses and abi files, set each contract object
  contracts.map(async (item) => {
    contractInstance = {
      ...contractInstance,
      [item.name]: new web3.eth.Contract(abis[item.name].abi, item.address)
    }
  })
  return contractInstance
}

let web3Instance
const getWeb3Instance = () => {
  return new Promise(async (resolve, reject) => {
    // set default web3 instance
    const { rpcUrls } = chainInfo
    const web3 = new Web3(rpcUrls)

    if (web3) {
      const web3Contracts = await initContracts(web3)
      web3Instance = {
        web3,
        web3Contracts,
        netName:
          network === "testnet"
            ? "TESTNET"
            : network === "mainnet"
              ? "MAINNET"
              : network === "devnet"
                ? "DEVNET"
                : "DEVMETANET"
      }
      resolve(web3Instance)
    } else {
      // web3 is not found
      reject(new Error("No web3 instance injected."))
    }
  })
}

// batch method (only call)
export const onlyCallBatchMethod = (web3, contract, method) => {
  const data = web3.web3Contracts[contract].methods[method]().call.request({})
  return data
}

// batch method (with value)
export const callBatchMethod = (web3, contract, method, ...value) => {
  let data
  if (method === "hasAlreadyVoted") {
    const { id, voter } = value[0]
    data = web3.web3Contracts.BallotStorage.methods
      .hasAlreadyVoted(id, voter)
      .call.request({})
  } else {
    data = web3.web3Contracts[contract].methods[method](value[0]).call.request(
      {}
    )
  }
  return data
}

// call contract method (no value)
export const onlyCallContractMethod = async (web3, contract, method) => {
  const data = await web3.web3Contracts[contract].methods[method]().call()
  return data
}

// call contract method (with value)
export const callContractMethod = async (web3, contract, method, ...value) => {
  let data
  if (method === "hasAlreadyVoted") {
    const { id, voter } = value[0]
    data = await web3.web3Contracts.BallotStorage.methods
      .hasAlreadyVoted(id, voter)
      .call()
  } else {
    data = await web3.web3Contracts[contract].methods[method](value[0]).call()
  }
  return data
}

// encodeABI (value in method)
export const encodeABIValueInMethod = (web3, contract, method, ...value) => {
  try {
    let trxData = {
      to: getContractAddr(contract)
    }
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
      newGovAddr,
      envName,
      envType,
      envVal,
      companyName,
      companyAddress,
      investmentAmount,
      description,
      link,
      id,
      txHashArr
    } = value[0]
    switch (method) {
      case "addProposalToAddMember":
        trxData.data = web3.web3Contracts.GovImp.methods
          .addProposalToAddMember([
            staker,
            voter,
            reward,
            name,
            enode,
            ip,
            port,
            lockAmount,
            memo,
            duration
          ])
          .encodeABI()
        break
      case "addProposalToChangeMember":
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
              duration
            ],
            oldStaker
          )
          .encodeABI()
        break
      case "addProposalToRemoveMember":
        trxData.data = web3.web3Contracts.GovImp.methods
          .addProposalToRemoveMember(staker, lockAmount, memo, duration)
          .encodeABI()
        break
      case "addProposalToChangeGov":
        trxData.data = web3.web3Contracts.GovImp.methods
          .addProposalToChangeGov(newGovAddr, memo, duration)
          .encodeABI()
        break
      case "addProposalToChangeEnv":
        trxData.data = web3.web3Contracts.GovImp.methods
          .addProposalToChangeEnv(envName, envType, envVal, memo, duration)
          .encodeABI()
        break
      case "addProposal":
        trxData.data = web3.web3Contracts.WaitGovernance.methods
          .addProposal([
            companyName,
            companyAddress,
            investmentAmount,
            description,
            link,
            []
          ])
          .encodeABI()
        break
      case "setTransactionHashes":
        trxData.data = web3.web3Contracts.WaitGovernance.methods
          .setTransactionHashes(id, txHashArr)
          .encodeABI()
        break
      default:
        trxData.data = web3.web3Contracts[contract].methods[method](
          ...value
        ).encodeABI()
        break
    }
    return trxData
  } catch (err) {
    return err
  }
}

// encodeABI (value in trxData)
export const encodeABIValueInTrx = (web3, contract, method, value) => {
  try {
    let trxData = {
      to: getContractAddr(contract),
      value,
      data: web3.web3Contracts[contract].methods[method]().encodeABI()
    }

    return trxData
  } catch (err) {
    return err
  }
}

// get contract address
const getContractAddr = (contract) => {
  const address = contracts.filter((item) => {
    return item.name === contract
  })[0].address

  return address
}

// get accounts
export const getAccounts = async (walletType) => {
  const { META_MASK, WALLET_CONNECT, COIN_BASE } = walletTypes
  let account
  switch (walletType) {
    case META_MASK:
      account = await web3Instance.web3.eth.requestAccounts()
      return account[0]
    case WALLET_CONNECT:
    case COIN_BASE:
      account = await web3Instance.web3.eth.getAccounts()
      return account[0]
    default:
  }
}

export { web3Instance }
export default getWeb3Instance
