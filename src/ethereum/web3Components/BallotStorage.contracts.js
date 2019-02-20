import { getAddresses } from "../addresses";
import { getBranch, getABI } from '../helpers'
import { Gov } from './Gov.contracts'

class BallotStorage {
    async init ({ web3, netid }) {
        this.addresses = getAddresses(netid)
        const { BALLOT_STORAGE_ADDRESS } = this.addresses
        this.ballotStorageAbi = await getABI(getBranch(netid), 'BallotStorage')
        this.ballotStorageInstance = new web3.eth.Contract(this.ballotStorageAbi.abi, BALLOT_STORAGE_ADDRESS)
    }

    async getBallotBasic(id) {
        if (!this.ballotStorageInstance || !this.ballotStorageInstance.methods) return
        return await this.ballotStorageInstance.methods.getBallotBasic(id).call()
    }

    async getBallotMember(id) {
        if (!this.ballotStorageInstance || !this.ballotStorageInstance.methods) return
        return await this.ballotStorageInstance.methods.getBallotMember(id).call()
    }
}
export { BallotStorage }