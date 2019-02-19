let constants = {}
constants.organization = 'blueisle'
constants.repoName = 'governanace-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  BallotStorage: 'BallotStorage.json' ,
  EnvStorage: 'EnvStorage.json',
  Gov: 'Gov.json',
  Registry: 'Registry.json',
  Staking: 'Staking.json'
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
constants.branchName = 'testnet';
export { constants }
