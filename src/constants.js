const buildNetworkType = process.env.REACT_APP_NETWORK_TYPE;

// envName
export const ENV_NAMES = {
  ENV_BALLOT_DURATION_MIN_MAX: "ballotDurationMinMax",
  ENV_STAKING_MIN_MAX: "stakingMinMax",
};

// envName sha3
export const ENV_NAMES_SHA3 = [
  {
    name: "Voting Duration Setting",
    sha3Name:
      "0xe10074dceffb75f13bf0ce50145afd35182d63796823f1280ce40e01c19109e7",
  },
  {
    name: "Authority Member Staking Amount",
    sha3Name:
      "0x6c6f69f426081752a5d3e73746599acd2a4cb145d5de4203ca1e3473b281680b",
  },
];

const constants = {
  authorityRepo: {
    org: "METADIUM",
    repo: "meta-authorities",
    branch: buildNetworkType,
    source: "authorities.json",
  },
  /* ControlEnums */
  expirationTime: 300000,
  /* AuthorityEnums */
  authoritieDescriptionHeight: 88,
  authoritieDescriptionHeightToPixel: "88px",
  /* BallotEnums */
  ballotDetailHeight: 124,
  ballotDetailHeightToPixel: "124px",
  ballotState: {
    Invalid: "0",
    Ready: "1",
    InProgress: "2",
    Accepted: "3",
    Rejected: "4",
    Canceled: "5",
  },
  ballotTypes: {
    Invalid: "0",
    AddAuthorityMember: "1",
    MemberRemoval: "2",
    MemberChange: "3",
    GovernanceContractAddress: "4",
    ChangedEnv: "5",
  },
  ballotStateArr: [
    "Invalid",
    "Ready",
    "InProgress",
    "Accepted",
    "Rejected",
    "Canceled",
  ],
  ballotTypesArr: [
    "Invalid",
    "Add Authority Member",
    "MemberRemoval",
    "MemberChange",
    "Governance Contract Address",
    "Changed Env",
  ],
  /* Debug */
  debugMode: false,
};

export { constants };
