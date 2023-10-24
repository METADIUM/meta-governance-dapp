import { useEffect, useState, useContext } from "react";
import { GovInitCtx } from "../contexts/GovernanceInitContext";
import { useNavigate } from "react-router-dom";
import { web3Instance, callContractMethod } from "../web3";
import * as util from "../util";
import { useAccount, useNetwork, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

const useAuth = () => {
  const { data: GovCtxData } = useContext(GovInitCtx);
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount({
    onConnect: () => {
      console.log("onConnect");
      GovCtxData.address = address;
    },
  });
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const [myBalance, setMyBalance] = useState("");
  const [lockedBalance, setLockedBalance] = useState("");

  console.log(GovCtxData);

  const [isMember, setIsMember] = useState(false);
  const [isStaker, setIsStaker] = useState(false);

  // useEffect(() => {
  //   if (address && web3Instance) {
  //     updateAccountData(address);
  //   }
  // }, [address, web3Instance]);

  const onLogin = async () => {
    try {
      await open();
    } catch (e) {
      console.error(e);
    }
  };
  const onLogout = () => {
    GovCtxData.isMember = false;
    GovCtxData.isStaker = false;
    GovCtxData.myBalance = "0";
    GovCtxData.myLockedBalance = "0";
    GovCtxData.address = "";
    setIsMember(false);
    setIsStaker(false);
    disconnect();

    // 로그 아웃 시  list 페이지로 무조건 이동
    localStorage.clear();
    redirectTo();
  };

  const redirectTo = () => navigate("/voting/list");

  // update data related to new account
  const updateAccountData = async (newAccount) => {
    if (!web3Instance) return;
    // if (web3Instance.web3.currentProvider.constructor.name === "HttpProvider") {
    //   return;
    // }

    // checksum
    newAccount = web3Instance.web3.utils.toChecksumAddress(newAccount);

    await updateAccountBalance(newAccount);
    setStakingEventsWatch(newAccount);
    const isMember = await callContractMethod(
      web3Instance,
      "GovImp",
      "isMember",
      newAccount
    );
    const isStaker = await callContractMethod(
      web3Instance,
      "GovImp",
      "isStaker",
      newAccount
    );
    GovCtxData.isMember = isMember;
    GovCtxData.isStaker = isStaker;
    setIsMember(isMember);
    setIsStaker(isStaker);

    // 계정이 바꼈는데 멤버가 아닐 경우 리스트로 강제 이동
    // if (!isMember && pathname !== "/voting/list") {
    //   redirectTo();
    // }
  };

  // set the balance of account
  const updateAccountBalance = async (defaultAccount = address) => {
    const weiBalance = await callContractMethod(
      web3Instance,
      "Staking",
      "balanceOf",
      defaultAccount
    );
    const locked = await callContractMethod(
      web3Instance,
      "Staking",
      "lockedBalanceOf",
      defaultAccount
    );
    const myBalance = util.convertWeiToEther(weiBalance);
    const lockedMyBalance = util.convertWeiToEther(locked);
    GovCtxData.myBalance = myBalance;
    GovCtxData.myLockedBalance = lockedMyBalance;
    setMyBalance(myBalance);
    setLockedBalance(lockedMyBalance);
    // this.setState({ stakingModalVisible: false, loading: false });
  };

  // update balance (after send transaction, changed account)
  const setStakingEventsWatch = async (defaultAccount = address) => {
    try {
      // for getting only default accounts event
      const filteraddress = web3Instance.web3.eth.abi.encodeParameter(
        "address",
        defaultAccount
      );
      const result = await web3Instance.web3Contracts.Staking.getPastEvents(
        "allEvents",
        {
          fromBlock: "latest",
          topics: [null, filteraddress],
        }
      );

      if (result) {
        // update balance
        updateAccountBalance(defaultAccount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    isMember,
    isStaker,
    address,
    myBalance,
    lockedBalance,
    isLoggedIn: isConnected,
    chain,
    updateAccountData,
    setStakingEventsWatch,
    onLogin,
    onLogout,
  };
};

export { useAuth };
