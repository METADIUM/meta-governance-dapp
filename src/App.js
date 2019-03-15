import React from 'react'
import { Layout } from 'antd'
import { TopNav, FootNav } from './components/Nav'
import { StakingModal, ErrModal } from './components/Modal'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import { BaseLoader } from './components/BaseLoader'

import * as util from './util'
import { constants } from './ethereum/constants'
import './App.css'

// web3
import getWeb3Instance from './ethereum/web3'
import { web3Instance } from './ethereum/web3'

// Contracts
import { contracts, initContracts } from './ethereum/web3Components/contracts'

const { Header, Content, Footer } = Layout
class App extends React.Component {
  data = {
    myBalance: 0,
    myLockedBalance: 0,
    stakingTopic: 'deposit',
    stakingAmount: '1',
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
    stakingInvalidErr: false,
    errModalVisible: false,
    loading: false,
    showProposal: false
  };

  constructor (props) {
    super(props)
    this.updateAccountBalance = this.updateAccountBalance.bind(this)
    this.updateDefaultAccount = this.updateDefaultAccount.bind(this)
    this.onMenuClick = this.onMenuClick.bind(this)
    this.getIsMainNet = this.getIsMainNet.bind(this)
    this.getContent = this.getContent.bind(this)
    this.getErrModal = this.getErrModal.bind(this)
    this.submitMetaStaking = this.submitMetaStaking.bind(this)
    this.convertVotingComponent = this.convertVotingComponent.bind(this)
    this.convertLoading = this.convertLoading.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.getStakingModal = this.getStakingModal.bind(this)

    /* Get web3 instance. */
    getWeb3Instance().then(async web3Config => {
      console.log(web3Config)
      this.initContracts(web3Config)
      await this.initAuthorityLists()
      this.setState({ loadWeb3: true })
    }, async error => {
      console.log('getWeb3 error: ', error)
      this.setState({ loadWeb3: false })
    })
  }
  
  async initContracts (web3Config) {
    initContracts({
      web3: web3Config.web3,
      netid: web3Config.netId
    }).then(async () => {
      await this.updateAccountBalance();
      window.ethereum.on('accountsChanged', async (chagedAccounts) => {
        await this.updateDefaultAccount(chagedAccounts[0]);
      })
      this.setStakingEventsWatch();
      this.data.isMember = await contracts.gov.isMember(web3Instance.defaultAccount)
      this.setState({ contractReady: true })
    })
  }

  async updateAccountBalance(){
    this.data.myBalance = await contracts.staking.balanceOf(web3Instance.defaultAccount)
    this.data.myLockedBalance = await contracts.staking.lockedBalanceOf(web3Instance.defaultAccount)
    this.data.myBalance = web3Instance.web3.utils.fromWei(this.data.myBalance, 'ether')
    this.data.myLockedBalance = web3Instance.web3.utils.fromWei(this.data.myLockedBalance, 'ether')
    this.setState({stakingModalVisible: false, loading: false})
  }
  
  async updateDefaultAccount(account){
    if(web3Instance.defaultAccount.toLowerCase() !== account.toLowerCase() ){
      console.log("change address:",account);
      web3Instance.defaultAccount = account;
      await this.updateAccountBalance();
      this.setStakingEventsWatch();
      this.data.isMember = await contracts.gov.isMember(web3Instance.defaultAccount)
      this.setState({showProposal: false})
    }else{
      console.log("notChanged");
    }
  }

  setStakingEventsWatch(){
    if (this.data.eventsWatch ){
      let subscription = this.data.eventsWatch;
      subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
      });
    }
    var filteraddress = web3Instance.web3.eth.abi.encodeParameter('address', web3Instance.defaultAccount);
    this.data.eventsWatch = contracts.staking.stakingInstance.events.allEvents(
      {
        fromBlock: 'latest',
        topics: [null, filteraddress]
      }, (error, events) => { 
        console.log(events); 
        if(error) console.log("error", error)
        else this.updateAccountBalance()
      }
    )
    console.log("Successfully subscribed!");
  }

  async initAuthorityLists () {
    this.data.authorityOriginData = await util.getAuthorityLists(constants.authorityRepo.org, constants.authorityRepo.repo, constants.authorityRepo.branch, constants.authorityRepo.source)
    Object.keys(this.data.authorityOriginData).forEach((index) => {
      this.data.authorityOriginData[index].addr = web3Instance.web3.utils.toChecksumAddress(this.data.authorityOriginData[index].addr)
    })
  }

  onMenuClick({ key }) {
    this.setState({ nav: key })
  }

  getContent () {
    if (!this.state.loadWeb3) return
    switch (this.state.nav) {
      case '1': return <Authority
        title='Authority'
        contracts={contracts}
        getErrModal={this.getErrModal}
        authorityOriginData={this.data.authorityOriginData}
        netid={this.getIsMainNet()}/>
      case '2': return <Voting
        title='Voting'
        contracts={contracts}
        getErrModal={this.getErrModal}
        authorityOriginData={this.data.authorityOriginData}
        convertComponent={this.convertVotingComponent}
        buttonLoading={this.state.loading}
        convertButtonLoading={this.convertLoading}
        newProposal={this.state.showProposal}
        isMember={this.data.isMember}/>
      default:
    }
    this.setState({ selectedMenu: true })
  }

  convertVotingComponent(component) {
    switch(component) {
      case 'voting': this.setState({showProposal: false}); break
      case 'proposal': this.setState({showProposal: true}); break
    }
  }

  convertLoading(state) {
    if(typeof(state) === 'boolean') {
      this.setState({ loading: state })
    } 
  }

  getIsMainNet() {
    //return constants.NETWORKS[web3Instance.netId].NAME === 'MAINNET' ? 'mainNet' : 'testNet'
    return 'mainNet'
  }

  getErrModal(_err = 'Unknown Error', _title = 'Unknown Error', _link = false) {
    if(_err.includes('error:')) _err = _err.split('error:')[1]

    this.data.errTitle = _title
    this.data.errContent = _err
    if(_link) this.data.errLink = constants.NETWORKS[web3Instance.netId] + _link
    else this.data.errLink = false
    this.setState({errModalVisible: true})
  }

  getStakingModal() {
    this.data.stakingAmount = '1'
    this.data.stakingTopic = 'deposit'
    this.setState({ stakingModalVisible: true })
  }

  submitMetaStaking() {
    if(!/^[1-9]\d*$/.test(this.data.stakingAmount)) {
      this.setState({ stakingModalVisible: false })
      this.getErrModal('The staking amount format is incorrect.', 'Staking Error')
      return
    }

    this.setState({loading: true})
    let trx = {}
    console.log("before this.data.stakingAmount;",this.data.stakingAmount )
    let amount = web3Instance.web3.utils.toWei(this.data.stakingAmount, 'ether')
    console.log("after this.data.stakingAmount;", amount )
    if (this.data.stakingTopic === 'deposit') {
      console.log("Send Transaction for deposit");
      trx = contracts.staking.deposit()
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        value: amount,
        to: trx.to,
        data: trx.data
      },  async (err, hash) => {
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

  handleSelectChange(topic) {
    this.data.stakingTopic = topic
    this.setState({})
  }

  handleInputChange(event) {
    this.data.stakingAmount = event.target.value
    if(/^[1-9]([0-9]*)$/.test(event.target.value)) this.setState({stakingInvalidErr: false})
    else this.setState({stakingInvalidErr: true})
  }

  render () {
    return (
      <Layout className='layout'>
        {this.state.contractReady && this.state.loadWeb3
          ? <div className="flex-column">
            <Header className={this.getIsMainNet()}>
              <TopNav
                netid={this.getIsMainNet()}
                nav={this.state.nav}
                myBalance={this.data.myBalance}
                myLockedBalance={this.data.myLockedBalance} 
                onMenuClick={this.onMenuClick}
                getStakingModal={this.getStakingModal}/>
            </Header>

            <StakingModal
              netid={this.getIsMainNet()}
              accountBalance={{ balance: this.data.myBalance, lockedBalance: this.data.myLockedBalance }}
              stakingModalVisible={this.state.stakingModalVisible}
              loading={this.state.loading}
              stakingAmount={this.data.stakingAmount}
              stakingTopic={this.data.stakingTopic}
              stakingInvalidErr={this.state.stakingInvalidErr}
              hideStakingModal={() => {if(!this.state.loading) this.setState({ stakingModalVisible: false })}}
              submitMetaStaking={this.submitMetaStaking}
              handleInputChange={this.handleInputChange}
              handleSelectChange={this.handleSelectChange} />

            <ErrModal
              netid={this.getIsMainNet()}
              title={this.data.errTitle}
              err={this.data.errContent}
              link={this.data.errLink}
              visible={this.state.errModalVisible}
              coloseErrModal = {() => this.setState({ errModalVisible: !this.state.loadWeb3})} />

            <Content>
              {this.state.loadWeb3
                ? <div> {this.getContent()} </div>
                : this.getErrModal('This is an unknown network. Please connect to Metadium network', 'Connecting Error')
              }
            </Content>

            <Footer>
              <FootNav netid={this.getIsMainNet()} />
            </Footer>
          </div>
          :
          <div>
            <BaseLoader />
          </div>}
      </Layout>
    )
  }
}

export default App
