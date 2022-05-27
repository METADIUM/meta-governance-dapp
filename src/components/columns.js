let columns = {};

columns.ballotColumns = [
  {
    // Ballot creator
    title: "Creator",
    key: "creator",
    value: "WEMIX",
  },
  {
    title: "Ballot Type",
    key: "ballotType",
    value: "ballotType",
  },
  {
    title: "Proposal Address",
    key: "proposalAddr",
    value: "0xcd93366D12931BeAbfBF892d1b0111D6573Ac0e3",
  },
  {
    title: "State",
    key: "state",
    value: "Ready",
  },
];

columns.ballotBasicColumns = [
  {
    title: "Start Time",
    dataIndex: "startTime",
    key: "startTime",
    // width: '20%',
  },
  {
    title: "End Time",
    dataIndex: "endTime",
    key: "endTime",
    // width: '20%',
  },
  {
    title: "Ballot Type",
    dataIndex: "ballotType",
    key: "ballotType",
    // width: '20%',
  },
  {
    title: "Creator",
    dataIndex: "creator",
    key: "creator",
    // width: '20%',
  },
  {
    title: "Memo",
    dataIndex: "memo",
    key: "memo",
    // width: '20%',
  },
  {
    title: "Total Voters",
    dataIndex: "totalVoters",
    key: "totalVoters",
    // width: '20%',
  },
  {
    title: "Accepts",
    dataIndex: "powerOfAccepts",
    key: "powerOfAccepts",
    // width: '20%',
  },
  {
    title: "Rejects",
    dataIndex: "powerOfRejects",
    key: "powerOfRejects",
    // width: '20%',
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
    // width: '20%',
  },
  {
    title: "Finalized",
    dataIndex: "isFinalized",
    key: "isFinalized",
    // width: '20%',
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    // width: '20%',
  },
];

export { columns };
