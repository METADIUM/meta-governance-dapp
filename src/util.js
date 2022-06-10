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

//  ---------- check ----------- //
// check the parameter is a function
export const shouldPass = () => {
  // eslint-disable-next-line
  throw "Function should be passed";
};

// ---------- refine data ---------- //
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
