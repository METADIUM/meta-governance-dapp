import { web3Instance } from "./web3";

const fetch = require("node-fetch");
const secondsInDay = 86400;

// ---------- time ---------- //
// convert UNIX timestamp to readable
const timeConverter = (timestamp) => {
  let a = new Date(timestamp * 1000);
  return (
    a.getFullYear() +
    "/" +
    +0 +
    (a.getMonth() + 1) +
    "/" +
    a.getDate() +
    " " +
    a.getHours() +
    ":" +
    a.getMinutes() +
    "(UTC)"
  );
};

// convert day -> seconds
export const convertDayToSeconds = (day) => {
  return day * secondsInDay;
};

// convert seconds -> day
export const convertSecondsToDay = (second) => {
  return second ? second / secondsInDay : 0;
};

// ---------- string ---------- //
// TODO 테스트 용으로 입력했던 기존 값이 잘못된 값일 경우 나오는 에러 핸들링
// decode hex -> string
export const decodeHexToString = (input) => {
  try {
    return web3Instance.web3.utils.hexToUtf8(input);
  } catch (e) {
    return "";
  }
};

// check undefined
export const checkUndefined = (param) => param === undefined;

// encode string -> sha3
export const encodeStringToSha3 = (input) => {
  return web3Instance.web3.utils.sha3(input);
};

// ---------- refine data ---------- //
// convert wei -> gwei
export const convertWeiToGWei = (amount) => {
  return web3Instance.web3.utils.fromWei(amount, "gwei");
};

// convert gwei -> wei
export const convertGWeiToWei = (amount) => {
  return web3Instance.web3.utils.toWei(amount, "gwei");
};

// convert wei -> ether
export const convertWeiToEther = (amount) => {
  return web3Instance.web3.utils.fromWei(amount, "ether");
};

// convert ether -> wei
export const convertEtherToWei = (amount) => {
  return web3Instance.web3.utils.toWei(amount, "ether");
};

// encode parameters (type, name - only string[])
export const encodeParameters = (type, name) => {
  return web3Instance.web3.eth.abi.encodeParameters(type, name);
};

// decode parameters (string -> type, name)
export const decodeParameters = (type, input) => {
  return web3Instance.web3.eth.abi.decodeParameters(type, input);
};

export const splitNodeInfo = (nodeInfo) => {
  let node, ip, port, splitedStr;
  splitedStr = nodeInfo.split("@");
  node = "0x" + splitedStr[0];
  splitedStr = splitedStr[1].split(":");
  ip = web3Instance.web3.utils.asciiToHex(splitedStr[0]);
  splitedStr = splitedStr[1].split("?");
  port = parseInt(splitedStr[0]);
  return { node, ip, port };
};

// override data format for save storage
export const refineBallotBasic = (m) => {
  if (!m) return null;
  if (m.state === "2" && m.endTime * 1000 < Date.now()) m.state = "4";

  Object.keys(m).forEach((key) => {
    if (!isNaN(key)) return delete m[key];
    switch (key) {
      case "creator":
        m[key] = web3Instance.web3.utils.toChecksumAddress(m[key]);
        break;
      case "startTime":
        m[key] = timeConverter(m[key]);
        break;
      case "endTime":
        m.endTimeConverted = timeConverter(m[key]);
        break;
      case "memo":
        m[key] = decodeHexToString(m[key]);
        break;
      case "duration":
        m[key] /= secondsInDay;
        break;
      case "powerOfRejects":
      case "powerOfAccepts":
        m[key] = parseInt(m[key]) / 100;
        break;
      default:
        if (!m[key]) m[key] = "";
        break;
    }
  });
  return m;
};

// override data format for send transaction
export const refineSubmitData = (m) => {
  if (m === null || typeof m !== "object") {
    return m;
  }
  let copy = {};
  for (let key in m) {
    copy[key] = m[key];
  }

  Object.keys(copy).forEach((key) => {
    if (!isNaN(key)) return delete copy[key];
    switch (key) {
      case "staker":
      case "voter":
      case "reward":
      case "newGovAddr":
        copy[key] = web3Instance.web3.utils.toChecksumAddress(copy[key]);
        break;
      case "lockAmount":
        copy[key] = convertEtherToWei(copy[key]);
        break;
      case "memo":
      case "name":
        copy[key] = web3Instance.web3.utils.utf8ToHex(copy[key]);
        break;
      default:
        if (!copy[key]) copy[key] = "";
        break;
    }
  });
  return copy;
};

// ---------- check data ---------- //
// up to 64 character, english and numbers only
export const checkName = (name) => {
  return /^[A-Za-z0-9+]{1,64}$/.test(name);
};

// numbers only
export const checkPrice = (price) => {
  return /^[0-9]{1,}$/.test(price);
};

// start with 0x, hexadecimal only 40 characters
export const checkAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// up to 128 character hexadecimal, @ after that, ip:port
export const checkNode = (node) => {
  return /^([a-fA-F0-9]{128})+@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])+:([0-9]{5})$/.test(
    node
  );
};

// at least 0.1
export const checkBlockCreationTime = (time) => {
  return /^(\d+)(,\d{1,2}|[1-9](?:\.[0-9]{1})?|0?\.[1-9]{1})?$/.test(time);
};

// at least 1 and error with 18 decimal place or more
export const checkRewardAmount = (amount) => {
  return /^[1-9]+\.?([0-9]{1,17})?$/.test(amount);
};

// check if value is greater than or less than
export const checkNumberRange = (type, min, max) => {
  const newMin = parseInt(min);
  const newMax = parseInt(max);

  // when no value
  if (!(min && max) || min < 1 || max < 1) return true;

  if (type === "min") {
    return newMin > newMax ? type : null;
  } else if (type === "max") {
    return newMax < newMin ? type : null;
  } else return;
};

// check max member staking amount
export const checkMemberStakingAmount = (min, max) => {
  const newMin = parseInt(min);
  const newMax = parseInt(max);

  return !(newMin < newMax && newMax <= 4980000);
};

// ---------- etc ----------
// check the parameter is a function
export const shouldPass = () => {
  // eslint-disable-next-line
  throw "Function should be passed";
};

// get authority list with static file
export const getAuthorityLists = (org, repo, branch, source) => {
  const URL = `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${source}`;
  return fetch(URL).then((response) => response.json());
};

// serialize and deserialize object at local storage
const save = (key, obj) =>
  window.localStorage.setItem(key, JSON.stringify(obj));
const load = (key) => JSON.parse(window.localStorage.getItem(key));

export const getBallotBasicFromLocal = () => load("metaBallotBasic");
export const getBallotMemberFromLocal = () => load("metaBallotMember");
export const getUpdatedTimeFromLocal = () => load("metaUpdatedTime");
export const getAuthorityFromLocal = () => load("metaAuthority");
export const getModifiedFromLocal = () => load("metaModifiedBlock");
export const setBallotBasicToLocal = (obj) => save("metaBallotBasic", obj);
export const setBallotMemberToLocal = (obj) => save("metaBallotMember", obj);
export const setAuthorityToLocal = (obj) => save("metaAuthority", obj);
export const setUpdatedTimeToLocal = (obj) => save("metaUpdatedTime", obj);
export const setModifiedToLocal = (obj) => save("metaModifiedBlock", obj);
