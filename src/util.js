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

// convert seconds -> day
export const convertSecondsToDay = (seconds) => {
  return seconds < secondsInDay ? 1 : seconds / secondsInDay;
};

// convert day -> seconds
export const convertDayToSeconds = (day) => {
  return day * secondsInDay;
};

// ---------- string ---------- //
// convert hex -> string
const convertHexToString = (input) => {
  if (input === null) {
    return "";
  }
  let hex = input.toString();
  let str = "";
  for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

// encoding string -> sha3
export const encodingSha3 = (input) => {
  return web3Instance.web3.utils.sha3(input);
};

// ---------- refine data ---------- //
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

// check if value is greater than or less than
export const checkDuration = (type, min, max) => {
  const newMin = parseInt(min);
  const newMax = parseInt(max);

  // when no value
  if (!(min && max)) return true;

  if (type === "min") {
    return newMin > newMax ? type : null;
  } else if (type === "max") {
    return newMax < newMin ? type : null;
  } else return;
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
        m[key] = convertHexToString(m[key]);
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

  const splitNodeInfo = (nodeInfo) => {
    let node, ip, port, splitedStr;
    splitedStr = nodeInfo.split("@");
    node = "0x" + splitedStr[0];
    splitedStr = splitedStr[1].split(":");
    ip = web3Instance.web3.utils.asciiToHex(splitedStr[0]);
    splitedStr = splitedStr[1].split("?");
    port = parseInt(splitedStr[0]);
    return { node, ip, port };
  };

  Object.keys(copy).forEach((key) => {
    if (!isNaN(key)) return delete copy[key];
    switch (key) {
      case "newAddr":
      case "oldAddr":
        copy[key] = web3Instance.web3.utils.toChecksumAddress(copy[key]);
        break;
      case "lockAmount":
      case "oldLockAmount":
      case "newLockAmount":
      case "gasLimit":
        copy[key] = web3Instance.web3.utils.toWei(
          copy[key].toString(),
          "ether"
        );
        break;
      case "memo":
      case "newName":
        copy[key] = web3Instance.web3.utils.asciiToHex(copy[key]);
        break;
      case "node":
      case "newNode":
      case "oldNode":
        let { node, ip, port } = splitNodeInfo(copy[key]);
        copy[key] = { node, ip, port };
        break;
      default:
        if (!copy[key]) copy[key] = "";
        break;
    }
  });
  return copy;
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
