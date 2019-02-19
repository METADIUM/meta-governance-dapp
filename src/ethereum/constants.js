let constants = {}
constants.organization = 'blueisle'
constants.repoName = 'governanace-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  // contracts.json: contract address
  Registry: 'Registry.json',
  Staking: 'Staking.json',
  EnvStorage: 'EnvStorage.json',
  BallotStorage: 'BallotStorage.json',
  Gov: 'Gov.json',
  GovImp: 'GovImp.json'
}
constants.NETID_TESTNET = '101'

constants.NETWORKS = {
  '101': {
    NAME: 'TESTNET',
    RPC: 'http://13.124.111.52:8545',
    BRANCH: 'master',
    NETWORK: 'private',
    TESTNET: true
  }
}

export { constants }
