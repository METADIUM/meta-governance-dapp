import Web3 from 'web3'

import { constants } from './constants'

var web3Instance

let getWeb3Instance = () => {
  if (web3Instance) return web3Instance

  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      let web3, netName, netId, network, defaultAccount

      if (window.ethereum) {
        web3 = new Web3(window.ethereum)
        try {
          await window.ethereum.enable()
        } catch (e) {
          reject(new Error('User denied account access'))
        }
      } else if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider)
      } else {
        reject(new Error('User denied account access'))
      }

      if (web3) {
        netId = await web3.eth.net.getId()
        network = await web3.eth.net.getNetworkType()
        if (!(netId in constants.NETWORKS) || network !== 'private') {
          netName = 'ERROR'
          reject(new Error('This is an unknown network.'))
        } else {
          netName = constants.NETWORKS[netId].NAME
          if(netName === 'TESTNET') reject(new Error('Please access to the main net')) 
        }
        const accounts = await web3.eth.getAccounts()
        defaultAccount = accounts[0]
      } else {
        // Fallback to local if no web3 injection.
        console.log('No web3 instance injected, using Local web3.')
        console.error('Metamask not found')

        netId = constants.NET_ID
        const network = constants.NETWORKS[netId]

        web3 = new Web3(new Web3.providers.HttpProvider(network.RPC))
        netName = network.NAME
      }

      web3Instance = {
        web3: web3,
        netName: netName,
        netId: netId,
        defaultAccount: defaultAccount
      }

      resolve(web3Instance)
    })
  })
}
export default getWeb3Instance
export { web3Instance }
