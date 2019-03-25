const constants = {
  authorityRepo: {
    org: 'METADIUM',
    repo: 'meta-authorities',
    branch: 'master',
    source: 'authorities.json'
  },

  NET_ID: '11',
  branchName: 'mainnet',

  /* BallotEnums */

  ballotState: {
    Invalid: '0',
    Ready: '1',
    InProgress: '2',
    Accepted: '3',
    Rejected: '4',
    Canceled: '5'
  },
  ballotTypes: {
    Invalid: '0',
    MemverAdd: '1',
    MemberRemoval: '2',
    MemberChange: '3',
    GovernanceChange: '4',
    EnvValChange: '5'
  },

  ballotStateArr: ['Invalid', 'Ready', 'InProgress', 'Accepted', 'Rejected', 'Canceled'],
  ballotTypesArr: ['Invalid', 'MemberAdd', 'MemberRemoval', 'MemberChange', 'GovernanceChange', 'EnvValChange']
}

export { constants }
