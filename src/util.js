import { web3Instance } from "./web3";

const secondsInDay = 86400;

// ---------- time ---------- //
// convert UNIX timestamp to readable
export const timeConverter = (
  timestamp,
  isFullText = false,
  utc = false,
  showSeconds = false
) => {
  const a = new Date(timestamp * 1000);
  // set month, date, hours, minute
  const convert = (d) => (d.toString().length === 1 ? `0${d}` : d);
  const month = convert(a.getMonth() + 1);
  const date = convert(a.getDate());
  const hours = convert(a.getHours());
  const minute = convert(a.getMinutes());
  const seconds = convert(a.getSeconds());

  return `${a.getFullYear()}-${month}-${date}${
    isFullText
      ? ` ${hours}:${minute}${showSeconds ? `:${seconds}` : ""} ${
          utc ? "UTC+9" : "(KST)"
        }`
      : ""
  }`;
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

export const loginAcc = (acc) => `${acc.slice(0, 6)}...${acc.slice(-4)}`;

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
        m.startTimeConverted = timeConverter(m[key]);
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

  // wait protocol의 경우 power 값 재계산
  if (m.isWait) {
    // 0: 투표 안한 사람, 1: 찬성 투표율, 2: 반대 투표율, 3: 기권율
    const [notVoters, approves, rejects, abstains] = m.powers;
    const powers = [];
    powers.push(notVoters);
    powers.push(parseInt(approves) ? parseInt(approves) / 100 : 0);
    powers.push(parseInt(rejects) ? parseInt(rejects) / 100 : 0);
    powers.push(parseInt(abstains) ? parseInt(abstains) / 100 : 0);

    m = {
      ...m,
      powers
    };
    return m;
  }
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
      case "oldStaker":
      case "staker":
      case "voter":
      case "reward":
      case "newGovAddr":
      case "newVotingAddr":
      case "newRewardAddr":
      case "companyAddress":
        copy[key] = web3Instance.web3.utils.toChecksumAddress(copy[key]);
        break;
      case "lockAmount":
      case "investmentAmount":
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

// wait protocol company name check -> 영어 한글 숫자 입력 가능, 앞글자 공백 불가
export const checkCompanyName = (name) => {
  return /^\S[a-zA-Z0-9가-힣 ]*$/.test(name);
};

// numbers only
export const checkPrice = (price) => {
  return /^[0-9]{1,}$/.test(price);
};

// percent
export const checkPercent = (percent) => {
  return Number(percent) > 0 || Number(percent) < 100; // /^[0-9]{0,100}$/.test(percent);
};

// numbers + decimal 8
export const checkInvestmentAmount = (amount) => {
  return /^\d{1,}.?\d{0,8}$/.test(amount);
};

// start with 0x, hexadecimal only 40 characters
export const checkAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// start with 0x, hexadecimal only 40 characters
export const checkTxHash = (hash) => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

// up to 128 character hexadecimal, @ after that, ip:port
export const checkNode = (node) => {
  return /^([a-fA-F0-9]{128})+@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])+:([0-9]{2,5})$/.test(
    node
  );
};

// at least 0.1
export const checkBlockCreationTime = (time) => {
  if (Number(time) < 1) return false;
  return /^(\d+)(,\d{1,2}|[1-9](?:\.[0-9]{1})?|0?\.[1-9]{1})?$/.test(time);
};

// at least 1 and error with 18 decimal place or more
export const checkRewardAmount = (amount) => {
  if (Number(amount) < 1) return false;
  return /^(\d+)(,\d{1,2}|[1-9](?:\.[0-9]{1})?|0?\.[1-9]{1,18})?$/.test(amount);
};

// check if value is greater than or less than
export const checkNumberRange = (type, min, max) => {
  const newMin = parseInt(min);
  const newMax = parseInt(max);

  // when no value
  if (!(min && max) || newMin < 1 || newMax < 1) return true;
  else {
    if (type === "min") {
      return newMin > newMax ? type : null;
    } else if (type === "max") {
      return newMax < newMin ? type : null;
    } else return false;
  }
};

// check max member staking amount
export const checkMemberStakingAmount = (min, max) => {
  const newMin = parseInt(min);
  const newMax = parseInt(max);

  return !(newMin < newMax && newMax <= 4980000);
};

// ---------- number ----------
export const hexToNumberJs = (hex) => {
  return parseInt(hex, 16);
};

// ---------- etc ----------
// check the parameter is a function
export const shouldPass = () => {
  // eslint-disable-next-line
  throw "Function should be passed";
};

// serialize and deserialize object at local storage
const save = (key, obj) =>
  window.localStorage.setItem(key, JSON.stringify(obj));
const load = (key) => JSON.parse(window.localStorage.getItem(key));

export const getBallotBasicFromLocal = () => load("wmBallotBasic");
export const getBallotMemberFromLocal = () => load("wmBallotMember");
export const getUpdatedTimeFromLocal = () => load("wmUpdatedTime");
export const getAuthorityFromLocal = () => load("wmAuthority");
export const getModifiedFromLocal = () => load("wmModifiedBlock");
export const setBallotBasicToLocal = (obj) => save("wmBallotBasic", obj);
export const setBallotMemberToLocal = (obj) => save("wmBallotMember", obj);
export const setAuthorityToLocal = (obj) => save("wmAuthority", obj);
export const setUpdatedTimeToLocal = (obj) => save("wmUpdatedTime", obj);
export const setModifiedToLocal = (obj) => save("wmModifiedBlock", obj);

// -- 3자리마다 콤마 추가하기
export function addCommasToNumber(number) {
  if (number) {
    return number
      .toString()
      .replace(
        /(\..*)$|(\d)(?=(\d{3})+(?!\d))/g,
        (digit, fract) => fract || digit + ","
      );
  }
}
// -- 3자리마다 콤마 제거하기--
export function removeCommasFromNumber(formattedNumber) {
  return formattedNumber.replace(/,/g, "");
}
