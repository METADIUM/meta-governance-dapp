const buildNetworkType = process.env.REACT_APP_NETWORK_TYPE;

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
    MemverAdd: "1",
    MemberRemoval: "2",
    MemberChange: "3",
    ChangeOfGovernanceContractAddress: "4",
    GasPrice: "5",
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
    "MemberAdd",
    "MemberRemoval",
    "MemberChange",
    "ChangeOfGovernanceContractAddress",
    "GasPrice",
  ],
  /* Debug */
  debugMode: false,
};

export { constants };
