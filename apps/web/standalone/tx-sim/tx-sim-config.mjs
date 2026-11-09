export const CHAINS = Object.freeze({
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
  },
  "zksync-testnet3": {
    id: 312,
    name: "ZKsync Testnet 3",
    rpc: "https://rpc.zksync-era-testnet.zksync.dev",
    explorer: "https://block-explorer.zksync-era-testnet.zksync.dev",
  },
});
export const ADDRESSES = Object.freeze({
  control: "0xeC6A5c568A59C0858ed6680A6862d64aA2DA8D4b",
  governor: "0xbD0C5e503BCFBD81C1Cb2F1CdCB8b11598816A7F",
  timelock: "0x0Acf7E43dcB22c1473d73Ae38c0dC7560D2e3519",
  token: "0xA1531b1564BB2F054190e149afcd657C112A2C66",
  puh: "0xD7B653c373aa9585141223d244DA857b10c92d85",
  board: "0x7E1Ba159c077F333A6B269e15D8A5a12916E6Fc2",
  messenger: "0x0000000000000000000000000000000000008008",
  diamond: "0xbb94d8f4080d5cd34d6215399f26771990f38a1d",
  // transaction-simulator's `construct-protocol-upgrade-proposal` writes its bare
  // `L1Messenger.sendToL1` files from this unowned address; the real call comes from the timelock.
  proposalPlaceholderSender: "0xdeadbeaf00000000000000000000000000000000",
  securityCouncil: "0x2498CAc75FA29b5c30e126C23ABcCc5ac5119821",
  // Safe v1.3.0 SignMessageLib (canonical deployment), delegatecalled by the member Safes.
  signMessageLib: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
});
// SecurityCouncil: 8 member Safes, 4 approvals per upgrade, EIP-712 domain "SecurityCouncil" "1".
export const COUNCIL = Object.freeze({
  members: 8,
  threshold: 4,
  domainName: "SecurityCouncil",
  domainVersion: "1",
  approveTypehash: "ApproveUpgradeSecurityCouncil(bytes32 id)",
});
export const SAFE_DELEGATECALL = 1;
// ChainAdmin.setUpgradeTimestamp(uint256,uint256) called directly on a ChainAdmin. The node reads the
// ServerNotifier's UpgradeTimestampUpdated event (set through ChainAdmin.multicall), so the
// ChainAdmin's own timestamp is not sent.
export const CHAIN_ADMIN_SET_UPGRADE_TIMESTAMP = "0xe2a9d554";
// GovernanceUpgradeTimer.checkDeadline() and deadline(): a stage that calls checkDeadline reverts
// (DeadlineNotYetPassed) until the timer started by an earlier stage has run out.
export const TIMER = Object.freeze({
  checkDeadlineSelector: "0x43bf9936",
  deadlineSelector: "0x29dcb0cf",
});
export const LIMITS = Object.freeze({
  maxFileBytes: 8 * 1024 * 1024,
  maxTransactions: 1000,
  rpcTimeoutMs: 30000,
  dependencyConcurrency: 4,
  pollMs: 12000,
  gasMarginPercent: 120n,
  percent: 100n,
  receiptConfirmations: 1n,
  // Chain 312 seals an L1 batch at 700,000 bytes of pubdata. A 300,000-byte L2->L1 message
  // costs about 65M L2 gas, under the 80M transaction cap. MetaMask rejects large requests
  // ("Request too large"), so the filler steps down through these sizes until one is accepted.
  batchPubdataLimitBytes: 700000,
  batchFillerMessageBytes: [300000, 150000, 100000, 60000, 30000],
});
export const STORAGE = Object.freeze({
  journal: "tx-sim:v1:journal",
  rpc: "tx-sim:v1:rpc",
  vote: "tx-sim:v1:vote",
  lock: "tx-sim:v1:send",
});
export const GOVERNOR_STATES = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
];
export const GOVERNOR_RETRY_STATES = Object.freeze([2, 3, 6]);
export const UPGRADE_STATES = [
  "Not started",
  "Legal veto period",
  "Waiting for approval",
  "Execution pending",
  "Ready to execute",
  "Expired",
  "Executed",
];
export const UPGRADE_TUPLE =
  "tuple(tuple(address target,uint256 value,bytes data)[] calls,address executor,bytes32 salt)";

// Narrowly recognize MetaMask Delegation Framework v1.3's single reverting call.
// Runtime hashes were checked on Sepolia at the failed approval's block.
export const METAMASK = Object.freeze({
  chainId: CHAINS.sepolia.id,
  manager: "0xdb9b1e94b5b69df7e401ddbede43491141047db3",
  managerCodeHash: "0x49c7f94924ffb53300b7e8ee613814d5ba587fd886177f1e72b3203bf17da673",
  implementation: "0x63c0c19a282a1b52b07dd5a65b58948a07dae32b",
  implementationCodeHash: "0x9270f73d98e7ed6978677bf0550038289efd510e67e700d024502d62510fc1e4",
  balanceEnforcer: "0xbd7b277507723490cd50b12eaafe87c616be6880",
  balanceEnforcerCodeHash: "0x61f455a893e4dcb39599bfcd8f59000e438c52639b278b933e469610c7761b76",
  singleRevertingMode: `0x${"00".repeat(32)}`,
  rootAuthority: `0x${"ff".repeat(32)}`,
});
export const WALLET_ABIS = Object.freeze({
  manager: [
    "function redeemDelegations(bytes[] permissionContexts,bytes32[] modes,bytes[] executionCallDatas)",
  ],
  delegations:
    "tuple(address delegate,address delegator,bytes32 authority,tuple(address enforcer,bytes terms,bytes args)[] caveats,uint256 salt,bytes signature)[]",
});

// Reviewed tx-sim operations that commute within a contiguous group. Unknown
// operations keep source-order dependencies unless the operator marks one independent.
export const PARALLEL_CALLS = Object.freeze({
  approve_acceptance: { selector: "0xd4d9bdcd", bytes: 36, label: "Safe approvals" },
  nominate_owner: { selector: "0xf2fde38b", bytes: 36, label: "Owner nominations" },
  grant_puh_admin: { selector: "0x2f2ff15d", bytes: 68, label: "Role grants" },
  renounce_eoa_admin: { selector: "0x36568abe", bytes: 68, label: "Role renunciations" },
});
