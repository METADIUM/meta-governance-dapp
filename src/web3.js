import Web3 from "web3";
import { constants as metaWeb3Constants } from "meta-web3";

var web3Instance;

let getWeb3Instance = () => {
  if (web3Instance) return web3Instance;

  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      let web3, netName, netId, branch, network, defaultAccount;

      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        // * 220502 remove code
        // 메타마스크에서 계정을 가져오는 부분이 중복으로 작성되어 있어 밑의 코드만 살리고 삭제
        // try {
        //   // * 220428 change for importing account from metamask
        //   // window.ethereum.enable() 이 레거시 코드가 되어 변경
        //   await window.ethereum.request({ method: "eth_requestAccounts" });
        // } catch (e) {
        //   reject(new Error("User denied account access"));
        //   // * 220428 add return
        //   // 사용자가 metamask 에서 권한을 허용하지 않은 경우 아래 코드를 불필요하게 실행시킬 필요가 없음
        //   return;
        // }
      } else if (typeof window.web3 !== "undefined") {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        // * 220428 modify error message
        // 해당 에러는 메타마스크가 없을 때 발생하는 에러이므로 기존의 에러 메시지(User denied account access)는 알맞은 문구가 아님
        reject(new Error("MetaMask is not found"));
        // * 220428 add return
        // metamask 가 설치되어 있지 않은 경우 아래 코드를 불필요하게 실행시킬 필요가 없음
        return;
      }

      if (web3) {
        netId = await web3.eth.net.getId();
        network = await web3.eth.net.getNetworkType();
        const buildNetworkType = process.env.REACT_APP_NETWORK_TYPE;
        let errMsg = `Unknown network. Please access to METADIUM ${buildNetworkType}`;
        // * 220428 refactoring if statement
        // 조건문 사용 시 참이 되는 값으로 비교해야 파악하기 쉬움
        if (netId in metaWeb3Constants.NETWORK && network === "private") {
          netName = metaWeb3Constants.NETWORK[netId].NAME;
          branch = metaWeb3Constants.NETWORK[netId].BRANCH;
          if (branch !== buildNetworkType) {
            reject(new Error(errMsg));
            // * 220428 add return
            // web3 의 network 가 metadium mainnet 이 아닌 경우 아래 코드를 불필요하게 실행시킬 필요가 없음
            return;
          }
          // * 220428 move code
          // web3 의 network 가 metadium mainnet 이 아닌 경우 실행시킬 필요가 없는 코드이기 때문에 위치를 옮김
          // * 220502 change for importing account from metamask
          // 메타마스크에서 계정을 가져오는 부분이 중복으로 작성되어 있어 수정함
          try {
            const accounts = await web3.eth.requestAccounts();
            defaultAccount = accounts[0];
          } catch (e) {
            // * 220502 modify error message
            // metamask 쪽에서 에러를 넘겨주고 있어서 metamask 에러 메시지가 있다면 그 쪽 에러를 출력하고, metamask 에러 메시지가 없다면 default 에러 메시지 출력
            reject(new Error(`${e.message || "User denied account access"}`));
          }
        } else {
          netName = "ERROR";
          branch = "ERROR";
          reject(new Error(errMsg));
          // * 220428 add return
          // web3 의 network 가 metadium mainnet 이 아닌 경우 아래 코드를 불필요하게 실행시킬 필요가 없음
          return;
        }

        // * 220429 move code
        // web3Instance 는 web3 가 있을 때만 만들어서 resolve 하면 됨
        web3Instance = {
          web3: web3,
          netName: netName,
          netId: netId,
          branch: branch,
          defaultAccount: defaultAccount,
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
        // * 220428 add return
        // web3 가 없기 때문에 아래 코드를 불필요하게 실행시킬 필요가 없음
        reject(new Error("No web3 instance injected, using Local web3."));
        return;
      }
    });
  });
};
export default getWeb3Instance;
export { web3Instance };
