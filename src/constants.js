const buildNetworkType = process.env.REACT_APP_NETWORK_TYPE;

// parameter count
export const ENV_PARAMETER_COUNT = {
  "Voting Duration Setting": 2,
  "Authority Member Staking Amount": 2,
  "Block Creation Time": 1,
  "Block Reward Amount": 1,
  "Block Reward Distribution Method": 4,
  MaxPriorityFeePerGas: 1,
  "Gas Limit & baseFee": 4,
};

// envName
export const ENV_NAMES = {
  ENV_BALLOT_DURATION_MIN_MAX: "ballotDurationMinMax",
  ENV_STAKING_MIN_MAX: "stakingMinMax",
  ENV_BLOCK_CREATION_TIME: "blockCreationTime",
  ENV_BLOCK_REWARD_AMOUNT: "blockRewardAmount",
  ENV_BLOCK_REWARD_DISTRIBUTION: "blockRewardDistrbution",
  ENV_MAX_PRIORITY_FEE_PER_GAS: "maxPriorityFeePerGas",
  ENV_GASLIMIT_AND_BASE_FEE: "gasLimitAndBaseFee",
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
  {
    name: "Block Creation Time",
    sha3Name:
      "0x8086da5becff4dfac91a3105821b361078d2d4abba0ccc2401b974cf0dcf05c1",
  },
  {
    name: "Block Reward Amount",
    sha3Name:
      "0x89dd490ecaf395283ed4ff2fd9557ca767fc425dce063451a9b0da6d72f600c3",
  },
  {
    name: "Block Reward Distribution Method",
    sha3Name:
      "0x3a9129cf69b4fa0fbe5d48e0d50863014e21ae09ffabcd72cebe10b1835251b9",
  },
  {
    name: "MaxPriorityFeePerGas",
    sha3Name:
      "0xbe90e461bbdb9a95a694f7796912ea04244caf7f5b60ad7ded17e16821d3e44c",
  },
  {
    name: "Gas Limit & baseFee",
    sha3Name:
      "0x04f7b94450bbcad85f37ea47cd1062728f884bb2040e357738f8fd53056134bc",
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
    ReplaceAuthorityMember: "3",
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
    "Replace Authority Member",
    "Governance Contract Address",
    "Changed Env",
  ],
  /* Debug */
  debugMode: false,
};

export { constants };
