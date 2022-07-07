// contract addresses
export const TESTNET_CONTRACTS = [
  { name: "Registry", address: "0x31455db91Dc663c81d7062dFB662F59713c33e7d" },
  {
    name: "EnvStorageImp",
    address: "0x33197Adc46D41ce816C2472E50ae702a8dB761cf",
  },
  { name: "EnvStorage", address: "0xdF19250B5D1Ebe6df05F7fdb169b0856297C5153" },
  {
    name: "BallotStorage",
    address: "0xB96F108819425EBB5b3EF180e2B6CaC06f624D39",
  },
  { name: "Staking", address: "0x301584bd9aA6CEd0d617f7DeDF3912863C1d3cf7" },
  { name: "GovImp", address: "0xF9572E0cDAc41a3ea178a9F793F7B22561b9bfE7" },
  { name: "Gov", address: "0x6896239a6450355120646713C9296DC820E9041A" },
];
export const MAINNET_CONTRACTS = [
  { name: "Registry", address: "0x31455db91Dc663c81d7062dFB662F59713c33e7d" },
  {
    name: "EnvStorageImp",
    address: "0x33197Adc46D41ce816C2472E50ae702a8dB761cf",
  },
  { name: "EnvStorage", address: "0xdF19250B5D1Ebe6df05F7fdb169b0856297C5153" },
  {
    name: "BallotStorage",
    address: "0xB96F108819425EBB5b3EF180e2B6CaC06f624D39",
  },
  { name: "Staking", address: "0x301584bd9aA6CEd0d617f7DeDF3912863C1d3cf7" },
  { name: "GovImp", address: "0xF9572E0cDAc41a3ea178a9F793F7B22561b9bfE7" },
  { name: "Gov", address: "0x6896239a6450355120646713C9296DC820E9041A" },
];

// wemix chain info
export const TESTNET_CHAIN_INFO = {
  chainId: "0x458",
  chainName: "Wemix Testnet",
  rpcUrls: "https://api.test.wemix.com",
  blockExplorerUrls: "https://microscope.test.wemix.com",
  name: "WEMIX",
  decimals: 18,
  symbol: "WEMIX",
};
export const MAINNET_CHAIN_INFO = {
  chainId: "0x458",
  chainName: "Wemix Mainnet",
  rpcUrls: "https://api.wemix.com",
  blockExplorerUrls: "https://microscope.wemix.com",
  name: "WEMIX",
  decimals: 18,
  symbol: "WEMIX",
};

// proposal list
export const ENV_VOTING_PROPOSAL_LIST = [
  { id: "Add Authority Member", value: "AddAuthorityMember" },
  { id: "Replace Authority Member", value: "ReplaceAuthorityMember" },
  { id: "Remove Authority Member", value: "RemoveAuthorityMember" },
  { id: "Governance Contract Address", value: "GovernanceContractAddress" },
  {
    id: "Voting Duration Setting",
    value: "VotingDurationSetting",
    sha3Name:
      "0xe10074dceffb75f13bf0ce50145afd35182d63796823f1280ce40e01c19109e7",
  },
  {
    id: "Authority Member Staking Amount",
    value: "AuthorityMemberStakingAmount",
    sha3Name:
      "0x6c6f69f426081752a5d3e73746599acd2a4cb145d5de4203ca1e3473b281680b",
  },
  {
    id: "Block Creation Time",
    value: "BlockCreationTime",
    sha3Name:
      "0x8086da5becff4dfac91a3105821b361078d2d4abba0ccc2401b974cf0dcf05c1",
  },
  {
    id: "Block Reward Amount",
    value: "BlockRewardAmount",
    sha3Name:
      "0x89dd490ecaf395283ed4ff2fd9557ca767fc425dce063451a9b0da6d72f600c3",
  },
  {
    id: "Block Reward Distribution Method",
    value: "BlockRewardDistributionMethod",
    sha3Name:
      "0x3a9129cf69b4fa0fbe5d48e0d50863014e21ae09ffabcd72cebe10b1835251b9",
  },
  {
    id: "MaxPriorityFeePerGas",
    value: "MaxPriorityFeePerGas",
    sha3Name:
      "0xbe90e461bbdb9a95a694f7796912ea04244caf7f5b60ad7ded17e16821d3e44c",
  },
  {
    id: "GasLimit & BaseFee",
    value: "GasLimitBaseFee",
    sha3Name:
      "0x04f7b94450bbcad85f37ea47cd1062728f884bb2040e357738f8fd53056134bc",
  },
];
export const ENV_MY_INFO_PROPOSAL_LIST = [
  { id: "Voting Address", value: "VotingAddress" },
  { id: "Reward Address", value: "RewardAddress" },
];

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

const constants = {
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
