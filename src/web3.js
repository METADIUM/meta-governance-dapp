import Web3 from 'web3'
import { constants as metaWeb3Constants } from 'meta-web3'

var web3Instance

let getWeb3Instance = () => {
  if (web3Instance) return web3Instance

  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      let web3, netName, netId, branch, network, defaultAccount

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
        if (!(netId in metaWeb3Constants.NETWORK) || network !== 'private') {
          netName = 'ERROR'
          branch = 'ERROR'
          reject(new Error('This is an unknown network in MetaMask.'))
        } else {
          netName = metaWeb3Constants.NETWORK[netId].NAME
          branch = metaWeb3Constants.NETWORK[netId].BRANCH
          if(branch !== 'mainnet') reject(new Error('Please access to the mainnet in MetaMask'))
        }
        const accounts = await web3.eth.getAccounts()
        defaultAccount = accounts[0]
      } else {
        // Fallback to local if no web3 injection.
        console.log('No web3 instance injected, using Local web3.')
        console.error('Metamask not found')

        Object.keys(metaWeb3Constants.NETWORK).some(key => {
          if (!metaWeb3Constants.NETWORK[key].TESTNET) netId = key
          return !metaWeb3Constants.NETWORK[key].TESTNET
        })
        const network = metaWeb3Constants.NETWORK[netId]
        web3 = new Web3(new Web3.providers.HttpProvider(network.RPC))
        netName = network.NAME
        branch = network.BRANCH
      }

      web3Instance = {
        web3: web3,
        netName: netName,
        netId: netId,
        branch: branch,
        defaultAccount: defaultAccount,
        names: ['identity', 'ballotStorage', 'envStorage', 'governance', 'staking']
      }

      resolve(web3Instance)
    })
  })
}
export default getWeb3Instance
export { web3Instance }
