// contract addresses (dev-staking 사이트)
export const DEVNET_CONTRACTS = [
  { name: "Registry", address: "0x15e8f4e6f169b3cccc8846f2b454d26ecf836c3a" },
  {
    name: "EnvStorageImp",
    address: "0x1310a767d534a93Db338fed3D68963812F603F1d",
  },
  { name: "EnvStorage", address: "0x1310a767d534a93Db338fed3D68963812F603F1d" },
  {
    name: "BallotStorage",
    address: "0x3ADb1c8E8A559DE7670c2eA7f2d175249baf2240",
  },
  { name: "Staking", address: "0xBF83258c72749F66B0F8778B7BAe32d3191092F0" },
  { name: "GovImp", address: "0x669662C6fAD4f2D9688fdbEc0BF017381B35D252" },
  { name: "Gov", address: "0x669662C6fAD4f2D9688fdbEc0BF017381B35D252" },
  // WaitGovernance Contract가 Devnet에 배포되어 있지 않습니다.
  {
    name: "WaitGovernance",
    address: "0x631FE9c57de28dDC2642ea70005fb61e14f0374D",
  },
];
// for wmgov
export const DEVMETANET_CONTRACTS = [
  { name: "Registry", address: "0x06C13fc771Abc31a44D017368176E6B3cba5eeD8" },
  {
    name: "EnvStorageImp",
    address: "0x3f7F9B356b9f5308d39684126De821751902338e",
  },
  { name: "EnvStorage", address: "0x3f7F9B356b9f5308d39684126De821751902338e" },
  {
    name: "BallotStorage",
    address: "0x83d7Bf709aDD8d0112434193B62901b2396555e3",
  },
  { name: "Staking", address: "0x4c9552B876acd6EE90567986150600C38416eD56" },
  { name: "GovImp", address: "0x6c2604D8671F941bdCDb7d43b9CEce5023008FCa" },
  { name: "Gov", address: "0x6c2604D8671F941bdCDb7d43b9CEce5023008FCa" },
  {
    name: "WaitGovernance",
    address: "0xc2f8B7e0A7EF1397F749632D4Da49cf159f39B4f",
  },
  // lending 노드 번호 없는 버전 wait governance contract
  // 0x9c9b2833d1619f6cf700e5fe524e61ebe74d409b
];
// for testnet
export const TESTNET_CONTRACTS = [
  { name: "Registry", address: "0xa68a135ccd37e720000fc30cfcc453b15f8040df" },
  {
    name: "EnvStorageImp",
    address: "0x37779e0d4c9e58c570784879dc755c7833fbedbb",
  },
  { name: "EnvStorage", address: "0x37779e0d4c9e58c570784879dc755c7833fbedbb" },
  {
    name: "BallotStorage",
    address: "0x0735eb9864564a6056385a3ec202e40e1fc34021",
  },
  { name: "Staking", address: "0xEaed1D41A587f7e2821080829013e352cEc91d75" },
  { name: "GovImp", address: "0x2f664960a7fbdada8e133dbaf1bfc27dccbadbfb" },
  { name: "Gov", address: "0x2f664960a7fbdada8e133dbaf1bfc27dccbadbfb" },
  {
    name: "WaitGovernance",
    address: "0xef49F4B544065DCc2D990594a4EF6C4b6BE7ef30",
  },
];

export const MAINNET_CONTRACTS = [
  { name: "Registry", address: "0x2e051a657014024f3e6099fbf3931f8dc14ef0f8" },
  {
    name: "EnvStorageImp",
    address: "0xde6eD165a256d3B7a478a3855DAA63C18ef2B032",
  },
  { name: "EnvStorage", address: "0xde6eD165a256d3B7a478a3855DAA63C18ef2B032" },
  {
    name: "BallotStorage",
    address: "0xb33e1bD1524fE12B3d5711DcE3fe18EBD7C40C3D",
  },
  { name: "Staking", address: "0xbed789c6008f788a28fc222c83082d67033daf7f" },
  { name: "GovImp", address: "0xbc86c1c5944f645d6f1ae39e081ca761f0ac5729" },
  { name: "Gov", address: "0xbc86c1c5944f645d6f1ae39e081ca761f0ac5729" },
  {
    name: "WaitGovernance",
    address: "0x631FE9c57de28dDC2642ea70005fb61e14f0374D",
  },
];

// wemix chain info
export const DEVNET_CHAIN_INFO = {
  chainId: "0x459",
  chainName: "Wemix Devnet",
  rpcUrls: "https://devnet-en.wemix.co",
  blockExplorerUrls: "https://explorer.test.wemix.com",
  name: "WEMIX",
  decimals: 18,
  symbol: "WEMIX",
};
export const TESTNET_CHAIN_INFO = {
  chainId: "0xb",
  chainName: "METADIUM Testnet",
  rpcUrls: "http://3.38.235.244:6588",
  blockExplorerUrls: "",
  name: "META",
  decimals: 18,
  symbol: "META",
};
export const MAINNET_CHAIN_INFO = {
  chainId: "0x457",
  chainName: "Wemix Mainnet",
  rpcUrls: "https://api.wemix.com",
  blockExplorerUrls: "https://explorer.wemix.com",
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
      "0x9b2e0c7fdae148f225bae7deb92d7e7bd24bb77edb12956e8fa7204900dd8a22",
  },
  {
    id: "MaxPriorityFeePerGas",
    value: "MaxPriorityFeePerGas",
    sha3Name:
      "0xbe90e461bbdb9a95a694f7796912ea04244caf7f5b60ad7ded17e16821d3e44c",
  },
  {
    id: "Gas Limit & baseFee",
    value: "GasLimitBaseFee",
    sha3Name:
      "0x04f7b94450bbcad85f37ea47cd1062728f884bb2040e357738f8fd53056134bc",
  },
  { id: "Add Wait Proposal", value: "AddWaitProposal" },
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
  ENV_BLOCK_REWARD_DISTRIBUTION: "blockRewardDistribution",
  ENV_MAX_PRIORITY_FEE_PER_GAS: "maxPriorityFeePerGas",
  ENV_GASLIMIT_AND_BASE_FEE: "gasLimitAndBaseFee",
};

export const walletTypes = {
  META_MASK: "injected",
  WALLET_CONNECT: "walletconnect",
  COIN_BASE: "walletlink",
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
    Canceled: "5",
  },
  ballotTypes: {
    Invalid: "0",
    AddAuthorityMember: "1",
    RemoveAuthorityMember: "2",
    ReplaceAuthorityMember: "3",
    GovernanceContractAddress: "4",
    ChangedEnv: "5",
  },
  ballotStateArr: [
    "Invalid",
    "Ready",
    "InProgress",
    "Approved",
    "Rejected",
    "Canceled",
  ],
  ballotTypesArr: [
    "Invalid",
    "Add Authority Member",
    "Remove Authority Member",
    "Replace Authority Member",
    "Governance Contract Address",
    "Changed Env",
  ],
  /* Debug */
  debugMode: false,
};

export { constants };

const MODE = process.env.REACT_APP_MODE;
const NETWORK = process.env.REACT_APP_NETWORK_TYPE;

const CHAIN_INFO =
  MODE === "production"
    ? MAINNET_CHAIN_INFO
    : NETWORK === "devnet"
    ? DEVNET_CHAIN_INFO
    : TESTNET_CHAIN_INFO;

const NETWORK_SPECIFICATION = {
  id: parseInt(CHAIN_INFO.chainId),
  name: CHAIN_INFO.chainName,
  network: "homestead",
  nativeCurrency: {
    decimals: 18,
    name: CHAIN_INFO.name,
    symbol: CHAIN_INFO.symbol,
  },
  rpcUrls: {
    public: { http: [CHAIN_INFO.rpcUrls] },
    default: { http: [CHAIN_INFO.rpcUrls] },
  },
};

const CURRENT_SPEC = NETWORK_SPECIFICATION;

const PROJECT_ID = "1faac271d9fe1528c3014fbf28ebad55";

export { CURRENT_SPEC, PROJECT_ID };
