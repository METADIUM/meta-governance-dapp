import { constants } from './constants'

var fetch = require('node-fetch');

function addressesURL(branch) {
  var URL = 'https://raw.githubusercontent.com/' + constants.organization + '/' + constants.repoName + '/' + branch + '/' + constants.addressesSourceFile;
  return URL;
}

function ABIURL(branch, contract) {
  var URL = 'https://raw.githubusercontent.com/' + constants.organization + '/' + constants.repoName + '/' + branch + '/abis/' + constants.ABIsSources[contract];
  return URL;
}

function getAddresses(branch) {
  var addr = addressesURL(branch);
  return fetch(addr).then(function(response){
    return response.json();
  });
}

function getABI(branch, contract) {
  var addr = ABIURL(branch, contract);
  return fetch(addr).then(function (response) {
    return response.json();
  });
}

export { getAddresses, getABI };
