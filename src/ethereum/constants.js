let constants = {}
constants.organization = 'METADIUM'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  Identity: 'Identity.json',
  IdentityManager: 'IdentityManager.json',
  AttestationAgencyRegistry: 'AttestationAgencyRegistry.json',
  TopicRegistry: 'TopicRegistry.json',
  Achievement: 'Achievement.json',
  AchievementManager: 'AchievementManager.json'
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
