import { getContractsAddresses } from '../addresses'

import { BallotStorage } from './BallotStorage.contracts'
import { EnvStorage } from './EnvStorage.contracts'
import { Gov } from './Gov.contracts'
import { GovImp } from './GovImp.contracts'
import { Registry } from './Registry.contracts'
import { Staking } from './Staking.contracts'

const contracts = {
  ballotStorage: new BallotStorage(),
  envStorage: new EnvStorage(),
  gov: new Gov(),
  govImp: new GovImp(),
  registry: new Registry(),
  staking: new Staking()
}

async function initContracts (arg) {
  const { web3, netId } = arg
  if (!web3 || !web3.eth) {
    console.log('web3 NOT FOUND')
    return
  }

  return getContractsAddresses(netId).then(() => Promise.all(Object.values(contracts).map(async (contract) => { await contract.init(arg) })))
}

export {
  contracts,
  getContractsAddresses,
  initContracts,
  BallotStorage,
  EnvStorage,
  Gov,
  GovImp,
  Registry,
  Staking
}
