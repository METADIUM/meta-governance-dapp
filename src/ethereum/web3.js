import Web3 from 'web3'
import { constants } from './constants'
var web3Instance

let getWeb3Instance = () => {
  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      let web3

      if (window.ethereum) {
        web3 = new Web3(window.ethereum)
        console.log('Injected web3 detected.')
        try {
          await window.ethereum.enable()
        } catch (e) {
          console.error('User denied account access')
          reject({ message: 'User denied account access' })
          return
        }
      } else if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider)
        console.log('Injected web3 detected.')
      }

      let errorMsg = null
      let netIdName
      let netId
      let network
      let defaultAccount = null

      if (web3) {
        netId = await web3.eth.net.getId()
        network = await web3.eth.net.getNetworkType()
        console.log('netId: ', netId, ', network: ', network)
        if (!(netId in constants.NETWORKS) || network !== 'private') {
          netIdName = 'ERROR'
          errorMsg = 'This is an unknown network.'
          console.log('This is an unknown network.')
        } else {
          netIdName = constants.NETWORKS[netId].NAME
          console.log(`This is ${netIdName}`)
        }
        const accounts = await web3.eth.getAccounts()
        defaultAccount = accounts[0] || null
      } else {
        // Fallback to local if no web3 injection.
        console.log('No web3 instance injected, using Local web3.')
        console.error('Metamask not found')

        netId = constants.NETID_TESTNET
        const network = constants.NETWORKS[netId]

        web3 = new Web3(new Web3.providers.HttpProvider(network.RPC))
        netIdName = network.NAME
      }

      if (errorMsg !== null) {
        reject({ message: errorMsg })
        return
      }
      web3Instance = {
        web3: web3,
        netIdName,
        netId,
        defaultAccount
      }
      resolve(web3Instance)
    })
  })
}
export default getWeb3Instance
export { web3Instance }
