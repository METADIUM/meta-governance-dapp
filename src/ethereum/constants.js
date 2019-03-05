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
    RPC: 'https://api-dev.metadium.com/test',
    BRANCH: 'master',
    NETWORK: 'private',
    TESTNET: true
  }
}
constants.branchName = 'testnet'

constants.authorityRepo = {
  org: 'blueisle',
  repo: 'meta-authorities',
  branch: 'master',
  source: 'authorities.json'
}

constants.limitAmount = {
  stakingMin: 1,
  stakingMax: 8
}

/**
 * BallotEnums
 */
constants.ballotState = {
  Invalid: '0',
  Ready: '1',
  InProgress: '2',
  Accepted: '3',
  Rejected: '4',
  Canceled: '5'
}

constants.ballotTypes = {
  Invalid: '0',
  MemverAdd: '1',
  MemberRemoval: '2',
  MemberChange: '3',
  GovernanceChange: '4',
  EnvValChange: '5'
}

constants.ballotStateArr = ['Invalid', 'Ready', 'InProgress', 'Accepted', 'Rejected', 'Canceled']
constants.ballotTypesArr = ['Invalid', 'MemberAdd', 'MemberRemoval', 'MemberChange', 'GovernanceChange', 'EnvValChange']

export { constants }
