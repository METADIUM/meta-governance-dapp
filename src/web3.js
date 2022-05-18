import Web3 from "web3";
import { constants as metaWeb3Constants } from "meta-web3";

var web3Instance;

let getWeb3Instance = () => {
  if (web3Instance) return web3Instance;

  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      let web3, netName, netId, branch, network, defaultAccount;
      // Checking if Web3 has been injected by the browser
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else if (typeof window.web3 !== "undefined") {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        reject(new Error("MetaMask is not found"));
        return;
      }

      if (web3) {
        // Distingush between mainnet and testnet
        const buildNetworkType = process.env.REACT_APP_NETWORK_TYPE;
        let errMsg = `Unknown network. Please access to METADIUM ${buildNetworkType}`;
        netId = await web3.eth.net.getId();
        network = await web3.eth.net.getNetworkType();

        // Gets the appropriate web3 config value for each network
        if (netId in metaWeb3Constants.NETWORK && network === "private") {
          netName = metaWeb3Constants.NETWORK[netId].NAME;
          branch = metaWeb3Constants.NETWORK[netId].BRANCH;

          // Compare the current netwok with build network
          if (branch !== buildNetworkType) {
            reject(new Error(errMsg));
            return;
          }

          try {
            const accounts = await web3.eth.requestAccounts();
            defaultAccount = accounts[0];
          } catch (e) {
            reject(new Error(`${e.message || "User denied account access"}`));
          }
        } else {
          netName = "ERROR";
          branch = "ERROR";
          reject(new Error(errMsg));
          return;
        }

        // Initialization web3 instance
        web3Instance = {
          web3,
          netName,
          netId,
          branch,
          defaultAccount,
          names: [
            "identity",
            "ballotStorage",
            "envStorage",
            "governance",
            "staking",
          ],
        };

        resolve(web3Instance);
      } else {
        // Fallback to local if no web3 injection.
        reject(new Error("No web3 instance injected, using Local web3."));
        return;
      }
    });
  });
};
export default getWeb3Instance;
export { web3Instance };
