import React from 'react'
import { Layout } from 'antd'
import { contracts, initContractsByNames, constants as metaWeb3Constants } from 'meta-web3'

import { TopNav, FootNav, StakingModal, ErrModal, Voting, Authority, BaseLoader } from './components'
import getWeb3Instance, { web3Instance } from './web3'
import { constants } from './constants'
import * as util from './util'

import './App.css'

const { Header, Content, Footer } = Layout

class App extends React.Component {
  data = {
    myBalance: 0,
    myLockedBalance: 0,
    stakingTopic: 'deposit',
    stakingAmount: '',
    stakingMax: null,
    stakingMin: null,
    eventsWatch: null,
    authorityOriginData: [],
    errTitle: null,
    errContent: null,
    errLink: null,
    isMember: false
  }

  state = {
    loadWeb3: false,
    nav: '1',
    contractReady: false,
    stakingModalVisible: false,
    errModalVisible: false,
    errStakging: false,
    loading: false,
    showProposal: false
  };

  constructor (props) {
    super(props)

    /* Get web3 instance. */
    getWeb3Instance().then(async web3Config => {
      this.initContracts(web3Config)
      console.log('debugMode: ', constants.debugMode)
      this.setState({ loadWeb3: true })
    }, async error => {
      console.log('getWeb3 error: ', error)
      this.setState({ loadWeb3: false })
    })
  }

  async initContracts (web3Config) {
    initContractsByNames({
      web3: web3Config.web3,
      branch: web3Config.branch,
      names: web3Config.names
    }).then(async () => {
      await this.getStakingRange()
      await this.initAuthorityLists()
      await this.updateAccountBalance()
      window.ethereum.on('accountsChanged', async (chagedAccounts) => {
        await this.updateDefaultAccount(chagedAccounts[0])
      })
      this.setStakingEventsWatch()
      this.data.isMember = await contracts.governance.isMember(web3Instance.defaultAccount)
      this.setState({ contractReady: true })
    })
  }

  async updateAccountBalance () {
    this.data.myBalance = await contracts.staking.balanceOf(web3Instance.defaultAccount)
    this.data.myLockedBalance = await contracts.staking.lockedBalanceOf(web3Instance.defaultAccount)
    this.data.myBalance = web3Instance.web3.utils.fromWei(this.data.myBalance, 'ether')
    this.data.myLockedBalance = web3Instance.web3.utils.fromWei(this.data.myLockedBalance, 'ether')
    this.setState({ stakingModalVisible: false, loading: false })
  }

  async updateDefaultAccount (account) {
    if (web3Instance.defaultAccount.toLowerCase() !== account.toLowerCase()) {
      web3Instance.defaultAccount = account
      await this.updateAccountBalance()
      this.setStakingEventsWatch()
      this.data.isMember = await contracts.governance.isMember(web3Instance.defaultAccount)
      this.setState({ showProposal: false })
    }
  }

  setStakingEventsWatch () {
    if (this.data.eventsWatch) {
      this.data.eventsWatch.unsubscribe((error, success) => {
        if (error) console.log('Faild to unsubscribed!')
        // else if (success) console.log('Successfully unsubscribed!')
      })
    }
    var filteraddress = web3Instance.web3.eth.abi.encodeParameter('address', web3Instance.defaultAccount)
    this.data.eventsWatch = contracts.staking.stakingInstance.events.allEvents(
      {
        fromBlock: 'latest',
        topics: [null, filteraddress]
      }, (error, events) => {
        // console.log(events)
        if (error) console.log('error', error)
        else this.updateAccountBalance()
      }
    )
  }

  async getStakingRange () {
    if (['MAINNET', 'TESTNET'].includes(web3Instance.netName)) {
      this.data.stakingMin = web3Instance.web3.utils.fromWei(await contracts.envStorage.getStakingMin())
      this.data.stakingMax = web3Instance.web3.utils.fromWei(await contracts.envStorage.getStakingMax())
    }
  }

  async initAuthorityLists () {
    this.data.authorityOriginData = await util.getAuthorityLists(
      constants.authorityRepo.org,
      constants.authorityRepo.repo,
      constants.authorityRepo.branch,
      constants.authorityRepo.source
    )
    Object.keys(this.data.authorityOriginData).forEach((index) => {
      this.data.authorityOriginData[index].addr = web3Instance.web3.utils.toChecksumAddress(this.data.authorityOriginData[index].addr)
    })
  }

  onMenuClick = ({ key }) => {
    if (this.state.showProposal && this.state.nav === '2' && key === '2') {
      this.convertVotingComponent('voting')
    } else {
      this.setState({ nav: key })
    }
  }

  onClickFootIcon = (e) => {
    switch (e.target.alt) {
      case 'metadium': window.open('https://metadium.com/', '_blank'); break
      case 'explorer': window.open(metaWeb3Constants.NETWORK[web3Instance.netId].EXPLORER); break
      case 'github': window.open('https://github.com/METADIUM/', '_blank'); break
      default:
    }
  }

  getContent () {
    if (!this.state.loadWeb3) return
    switch (this.state.nav) {
      case '1':
        return <Authority
          title='Authority'
          contracts={contracts}
          getErrModal={this.getErrModal}
          authorityOriginData={this.data.authorityOriginData}
          netName={web3Instance.netName}
        />
      case '2':
        return <Voting
          title='Voting'
          contracts={contracts}
          getErrModal={this.getErrModal}
          authorityOriginData={this.data.authorityOriginData}
          convertVotingComponent={this.convertVotingComponent}
          loading={this.state.loading}
          convertLoading={this.convertLoading}
          showProposal={this.state.showProposal}
          isMember={this.data.isMember}
          stakingMax={this.data.stakingMax}
          stakingMin={this.data.stakingMin}
        />
      default:
    }
    this.setState({ selectedMenu: true })
  }

  convertVotingComponent = (component) => {
    switch (component) {
      case 'voting': this.setState({ showProposal: false }); break
      case 'proposal': this.setState({ showProposal: true }); break
      default: break
    }
  }

  convertLoading = (state) => {
    if (typeof (state) === 'boolean') {
      this.setState({ loading: state })
    }
  }

  getErrModal = (_err = 'Unknown Error', _title = 'Unknown Error', _link = false) => {
    if (_err.includes('error:')) _err = _err.split('error:')[1]

    this.data.errTitle = _title
    this.data.errContent = _err
    if (_link) this.data.errLink = metaWeb3Constants.NETWORK[web3Instance.netId] + _link
    else this.data.errLink = false
    this.setState({ errModalVisible: true })
  }

  getStakingModal = () => {
    this.data.stakingAmount = ''
    this.data.stakingTopic = 'deposit'
    this.setState({ stakingModalVisible: true })
  }

  submitMetaStaking = () => {
    if (!/^[1-9]\d*$/.test(this.data.stakingAmount)) {
      this.setState({ errStakging: true })
      return
    }

    this.setState({ loading: true })
    let trx = {}
    // console.log('before this.data.stakingAmount;', this.data.stakingAmount)
    let amount = web3Instance.web3.utils.toWei(this.data.stakingAmount, 'ether')
    // console.log('after this.data.stakingAmount;', amount)
    if (this.data.stakingTopic === 'deposit') {
      // console.log('Send Transaction for deposit')
      trx = contracts.staking.deposit()
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        value: amount,
        to: trx.to,
        data: trx.data
      }, async (err, hash) => {
        if (err) {
          console.log(err)
          this.getErrModal(err.message, 'Deposit Error')
          this.setState({ stakingModalVisible: false, loading: false })
        } else {
          console.log('hash: ', hash)
        }
      })
    } else {
      trx = contracts.staking.withdraw(amount)
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, async (err, hash) => {
        if (err) {
          console.log(err)
          this.getErrModal(err.message, 'Withdraw Error')
          this.setState({ stakingModalVisible: false, loading: false })
        } else {
          console.log('hash: ', hash)
        }
      })
    }
  }

  handleSelectChange = (topic) => {
    this.data.stakingTopic = topic
    this.setState({})
  }

  handleInputChange = (event) => {
    let value = event.target.value
    if (/^([0-9]*)$/.test(value)) {
      this.data.stakingAmount = value
      this.setState({ errStakging: false })
    }
  }

  render () {
    return (
      <Layout className='layout'>
        {this.state.contractReady && this.state.loadWeb3
          ? <div className='flex-column'>
            <Header className={web3Instance.netName}>
              <TopNav
                netName={web3Instance.netName}
                nav={this.state.nav}
                myBalance={this.data.myBalance}
                myLockedBalance={this.data.myLockedBalance}
                onMenuClick={this.onMenuClick}
                getStakingModal={this.getStakingModal}
              />
            </Header>

            <StakingModal
              netName={web3Instance.netName}
              accountBalance={{ balance: this.data.myBalance, lockedBalance: this.data.myLockedBalance }}
              stakingModalVisible={this.state.stakingModalVisible}
              loading={this.state.loading}
              stakingAmount={this.data.stakingAmount}
              errStakging={this.state.errStakging}
              stakingTopic={this.data.stakingTopic}
              hideStakingModal={() => { if (!this.state.loading) this.setState({ stakingModalVisible: false }) }}
              submitMetaStaking={this.submitMetaStaking}
              handleInputChange={this.handleInputChange}
              handleSelectChange={this.handleSelectChange}
            />

            <ErrModal
              netName={web3Instance.netName}
              title={this.data.errTitle}
              err={this.data.errContent}
              link={this.data.errLink}
              visible={this.state.errModalVisible}
              coloseErrModal={() => this.setState({ errModalVisible: !this.state.loadWeb3 })} />

            <Content>
              {this.state.loadWeb3
                ? <div> {this.getContent()} </div>
                : this.getErrModal('This is an unknown network. Please connect to Metadium network', 'Connecting Error')
              }
            </Content>

            <Footer>
              <FootNav
                netName={web3Instance.netName}
                onClickFootIcon={this.onClickFootIcon}
              />
            </Footer>
          </div>
          : <div>
            <BaseLoader />
          </div>
        }
      </Layout>
    )
  }
}

export default App
