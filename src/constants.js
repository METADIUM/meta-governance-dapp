// for wmgov
export const DEVMETANET_CONTRACTS = [
  { name: "Registry", address: "0x06c13fc771abc31a44d017368176e6b3cba5eed8" },
  {
    name: "EnvStorageImp",
    address: "0x3f7F9B356b9f5308d39684126De821751902338e"
  },
  { name: "EnvStorage", address: "0x3f7F9B356b9f5308d39684126De821751902338e" },
  {
    name: "BallotStorage",
    address: "0x83d7Bf709aDD8d0112434193B62901b2396555e3"
  },
  { name: "Staking", address: "0x4c9552B876acd6EE90567986150600C38416eD56" },
  { name: "GovImp", address: "0x6c2604D8671F941bdCDb7d43b9CEce5023008FCa" },
  { name: "Gov", address: "0x6c2604D8671F941bdCDb7d43b9CEce5023008FCa" },
  {
    name: "WaitGovernance",
    address: "0xc2f8B7e0A7EF1397F749632D4Da49cf159f39B4f"
  }
  // lending 노드 번호 없는 버전 wait governance contract
  // 0x9c9b2833d1619f6cf700e5fe524e61ebe74d409b
];
// for testnet
export const TESTNET_CONTRACTS = [
  { name: "Registry", address: "0xc27344926ddf38206f25c67Aaa95d765f5152C9f" },
  {
    name: "EnvStorageImp",
    address: "0x5a31311f6a1Ca5dCA395766e13df07d1bd6F08ac"
  },
  { name: "EnvStorage", address: "0x5a31311f6a1Ca5dCA395766e13df07d1bd6F08ac" },
  {
    name: "BallotStorage",
    address: "0x21cCE1B31cbe849243c389dAB90035d63ba1f2d8"
  },
  { name: "Staking", address: "0xD32B058a93C4ccB08A73472573c178b2981BCE50" },
  { name: "GovImp", address: "0x3dAE75B816FFCC07da68421a7939e3f2a37AF7EB" },
  { name: "Gov", address: "0x3dAE75B816FFCC07da68421a7939e3f2a37AF7EB" },
  {
    name: "WaitGovernance",
    address: "0xef49F4B544065DCc2D990594a4EF6C4b6BE7ef30"
  }
];

export const MAINNET_CONTRACTS = [
  { name: "Registry", address: "0x06c13fc771abc31a44d017368176e6b3cba5eed8" },
  {
    name: "EnvStorageImp",
    address: "0x3f7F9B356b9f5308d39684126De821751902338e"
  },
  { name: "EnvStorage", address: "0x3f7F9B356b9f5308d39684126De821751902338e" },
  {
    name: "BallotStorage",
    address: "0x83d7Bf709aDD8d0112434193B62901b2396555e3"
  },
  { name: "Staking", address: "0x4c9552b876acd6ee90567986150600c38416ed56" },
  { name: "GovImp", address: "0x6c2604d8671f941bdcdb7d43b9cece5023008fca" },
  { name: "Gov", address: "0x6c2604d8671f941bdcdb7d43b9cece5023008fca" },
  {
    name: "WaitGovernance",
    address: "0x631FE9c57de28dDC2642ea70005fb61e14f0374D"
  }
];

// METADIUM chain info
export const DEVNET_CHAIN_INFO = {
  chainId: "0xb",
  chainName: "METADIUM Devnet",
  rpcUrls: "https://devnet-meta.metadium.club",
  blockExplorerUrls: "",
  name: "META",
  decimals: 18,
  symbol: "META"
};
export const TESTNET_CHAIN_INFO = {
  chainId: "0xc",
  chainName: "METADIUM Testnet",
  rpcUrls: "https://api.metadium.com/dev",
  blockExplorerUrls: "https://testnetexplorer.metadium.com",
  name: "META",
  decimals: 18,
  symbol: "META"
};
export const MAINNET_CHAIN_INFO = {
  chainId: "0xb",
  chainName: "METADIUM Mainnet",
  rpcUrls: "https://api.metadium.com/prod",
  blockExplorerUrls: "https://explorer.metadium.com",
  name: "META",
  decimals: 18,
  symbol: "META"
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
      "0xe10074dceffb75f13bf0ce50145afd35182d63796823f1280ce40e01c19109e7"
  },
  {
    id: "Authority Member Staking Amount",
    value: "AuthorityMemberStakingAmount",
    sha3Name:
      "0x6c6f69f426081752a5d3e73746599acd2a4cb145d5de4203ca1e3473b281680b"
  },
  {
    id: "Block Creation Time",
    value: "BlockCreationTime",
    sha3Name:
      "0x8086da5becff4dfac91a3105821b361078d2d4abba0ccc2401b974cf0dcf05c1"
  },
  {
    id: "Block Reward Amount",
    value: "BlockRewardAmount",
    sha3Name:
      "0x89dd490ecaf395283ed4ff2fd9557ca767fc425dce063451a9b0da6d72f600c3"
  },
  {
    id: "Block Reward Distribution Method",
    value: "BlockRewardDistributionMethod",
    sha3Name:
      "0x9b2e0c7fdae148f225bae7deb92d7e7bd24bb77edb12956e8fa7204900dd8a22"
  },
  {
    id: "Max Priority Fee Per Gas",
    value: "MaxPriorityFeePerGas",
    sha3Name:
      "0xbe90e461bbdb9a95a694f7796912ea04244caf7f5b60ad7ded17e16821d3e44c"
  },
  {
    id: "Gas Limit & baseFee",
    value: "GasLimitBaseFee",
    sha3Name:
      "0x04f7b94450bbcad85f37ea47cd1062728f884bb2040e357738f8fd53056134bc"
  }
];
export const ENV_MY_INFO_PROPOSAL_LIST = [
  { id: "Voting Address", value: "VotingAddress" },
  { id: "Reward Address", value: "RewardAddress" }
];

// parameter count
export const ENV_PARAMETER_COUNT = {
  "Voting Duration Setting": 2,
  "Authority Member Staking Amount": 2,
  "Block Creation Time": 1,
  "Block Reward Amount": 1,
  "Block Reward Distribution Method": 4,
  "Max Priority Fee Per Gas": 1,
  "Gas Limit & baseFee": 4
};

// envName
export const ENV_NAMES = {
  ENV_BALLOT_DURATION_MIN_MAX: "ballotDurationMinMax",
  ENV_STAKING_MIN_MAX: "stakingMinMax",
  ENV_BLOCK_CREATION_TIME: "blockCreationTime",
  ENV_BLOCK_REWARD_AMOUNT: "blockRewardAmount",
  ENV_BLOCK_REWARD_DISTRIBUTION: "blockRewardDistribution",
  ENV_MAX_PRIORITY_FEE_PER_GAS: "maxPriorityFeePerGas",
  ENV_GASLIMIT_AND_BASE_FEE: "gasLimitAndBaseFee"
};

export const walletTypes = {
  META_MASK: "injected",
  WALLET_CONNECT: "walletconnect",
  COIN_BASE: "walletlink"
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
    Approved: "3",
    Rejected: "4",
    Canceled: "5"
  },
  ballotTypes: {
    Invalid: "0",
    AddAuthorityMember: "1",
    RemoveAuthorityMember: "2",
    ReplaceAuthorityMember: "3",
    GovernanceContractAddress: "4",
    ChangedEnv: "5"
  },
  ballotStateArr: [
    "Invalid",
    "Ready",
    "InProgress",
    "Approved",
    "Rejected",
    "Canceled"
  ],
  ballotTypesArr: [
    "Invalid",
    "Add Authority Member",
    "Remove Authority Member",
    "Replace Authority Member",
    "Governance Contract Address",
    "Changed Env"
  ],
  /* Debug */
  debugMode: false
};

export { constants };

const MODE = process.env.REACT_APP_MODE;

const CHAIN_INFO =
  MODE === "production"
    ? MAINNET_CHAIN_INFO
    : MODE === "testnet"
    ? TESTNET_CHAIN_INFO
    : DEVNET_CHAIN_INFO;

const NETWORK_SPECIFICATION = {
  id: parseInt(CHAIN_INFO.chainId),
  name: CHAIN_INFO.chainName,
  network: "homestead",
  nativeCurrency: {
    decimals: 18,
    name: CHAIN_INFO.name,
    symbol: CHAIN_INFO.symbol
  },
  rpcUrls: {
    public: { http: [CHAIN_INFO.rpcUrls] },
    default: { http: [CHAIN_INFO.rpcUrls] }
  }
};

const CURRENT_SPEC = NETWORK_SPECIFICATION;

const PROJECT_ID = "1faac271d9fe1528c3014fbf28ebad55";

export { CURRENT_SPEC, PROJECT_ID };
