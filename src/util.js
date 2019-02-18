import web3 from './ethereum/web3'

const fetch = require('node-fetch')

var borderColor = {
  valid: '#3db389',
  invalid: 'red'
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Convert UNIX timestamp to readable
 * @param {*} timestamp UNIX
 */
function timeConverter (timestamp) {
  var a = new Date(timestamp * 1000)
  var month = months[a.getMonth()]
  return a.getFullYear() + ' / ' + month + ' / ' + a.getDate()
}

function convertHexToString (input) {
  var hex = input.toString()
  var str = ''
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)) }
  return str
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function refine (m) {
  if (!m) return null
  Object.keys(m).forEach(key => {
    if (!isNaN(key)) return delete m[key]
    switch (key) {
      case 'title': m[key] = convertHexToString(m[key]); break
      case 'explanation': m[key] = convertHexToString(m[key]); break
      case 'reward': m[key + 'Meta'] = web3.utils.fromWei(m[key], 'ether') + 'META'; break
      case 'reserved': m[key + 'Meta'] = web3.utils.fromWei(m[key], 'ether') + 'META'; break
      case 'createdAt': m[key] = timeConverter(m[key]); break
      default: if (!m[key]) m[key] = ''; break
    }
  })
  return m
}

function cmpIgnoreCase (a, b) {
  return a.toLowerCase().includes(b.toLowerCase())
}

/**
 *
 * @param {*} key
 * @param {*} val
 * @returns {map} b: true if valid or false if invalid, err: error message
 */
function validate (key, val) {
  switch (key) {
    case 'title':
    case 'explanation':
      if (!val) return { b: false, err: 'Please fill all red box' }
      if (isValidLength(val) > 32) return { b: false, err: 'Only 32 bytes allowed' }
      return { b: true }
    case 'reward':
    case 'reserve':
      if (val < 5) return { b: false, err: key.toUpperCase() + ' should be greater than 5 META' }
      return { b: true }
    case 'issuer':
      if (!val || !web3.utils.isAddress(val)) return { b: false, err: 'Please fill up valid issuers' }
      return { b: true }
    case 'topics':
      if (!val || val.length === 0) return { b: false, err: 'Select at least 1 topic' }
      else if (val.filter(e => e.title === val).length > 0) return { b: false, err: 'Duplicated topic' }
      else if (val.filter(e => e.issuer === '').length > 0) return { b: false, err: 'Please fill up valid issuers' }
      return { b: true }
    default: return { b: false, err: 'Error encountered, please try again' }
  }
}

var encoder = new TextEncoder('utf-8')

/**
 * Check if in 32 bytes or not
 * @param {*} str
 */
function isValidLength (str) {
  return encoder.encode(str).length
}

async function getGithubContents (org, repo, branch, source) {
  const URL = `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${source}`
  return fetch(URL).then(response => response.json())
}

/**
 * Serialize / Deserialize object at local storage
 */
var save = (key, obj) => window.localStorage.setItem(key, JSON.stringify(obj))
var load = (key) => JSON.parse(window.localStorage.getItem(key))

var getUsersFromLocal = () => load('users')
var getTopicsFromLocal = () => load('topics')
var getAchievementsFromLocal = () => load('achievements')
var setUsersToLocal = (obj) => save('users', obj)
var setTopicsToLocal = (obj) => save('topics', obj)
var setAchievementsToLocal = (obj) => save('achievements', obj)

export {
  borderColor,
  timeConverter,
  sleep,
  convertHexToString,
  asyncForEach,
  refine,
  cmpIgnoreCase,
  isValidLength,
  getGithubContents,
  validate,
  save,
  load,
  getUsersFromLocal,
  getTopicsFromLocal,
  getAchievementsFromLocal,
  setUsersToLocal,
  setTopicsToLocal,
  setAchievementsToLocal
}
