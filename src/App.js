import React from 'react'
import { Layout, Button, Row, Col, Modal, Tabs } from 'antd'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import './App.css'
import { getAddresses, getABI } from './ethereum/contract'

// web3
import getWeb3Instance from '../src/ethereum/web3'
import { constants } from '../src/ethereum/constants'

const { Header, Content, Footer } = Layout
const TabPane = Tabs.TabPane

class App extends React.Component {
  state = {
    loadWeb3: false,
    nav: '1'
  };

  constructor (props) {
    super(props)

    /* Get web3 instance. */
    getWeb3Instance().then(async web3Config => {
      console.log('web3 information: ', web3Config)
      this.setState({ loadWeb3: true })
      let web3 = web3Config.web3Instance;
      return web3

    }, async error => {
      console.log('getWeb3 error: ', error);
      this.setState({ loadWeb3: false });
    })
    /* Get contract instances. */
    .then(async web3 => {
      let addresses = await getAddresses(constants.branchName)

      let ballotStorageABI = await getABI(constants.branchName,'BallotStorage')
      let envStorageABI = await getABI(constants.branchName, 'EnvStorage')
      let govABI = await getABI(constants.branchName, 'Gov')
      let registryABI = await getABI(constants.branchName, 'Registry')
      let stakingABI = await getABI(constants.branchName, 'Staking')

      let ballotStorageInstance = new web3.eth.Contract(ballotStorageABI.abi, addresses.BALLOT_STORAGE_ADDRESS)
      let envStorageInstance = new web3.eth.Contract(envStorageABI.abi, addresses.ENV_STORAGE_ADDRESS)
      let govInstance = new web3.eth.Contract(govABI.abi, addresses.GOV_ADDRESS)
      let registryInstance = new web3.eth.Contract(registryABI.abi, addresses.REGISTRY_ADDRESS)
      let stakingInstance = new web3.eth.Contract(stakingABI.abi, addresses.STAKING_ADDRESS)
      
      console.log(ballotStorageInstance)
      console.log(envStorageInstance)
      console.log(govInstance)
      console.log(registryInstance)
      console.log(stakingInstance)
    })
  }

  onMenuClick = (key) => {
    this.setState({ nav: key })
    console.log(key)
  }

  getErrModal () {
    return <Modal
      title='ERROR'
      visible={!this.state.loadWeb3}
      okButtonProps={{ disabled: true }}
      cancelButtonProps={{ disabled: true }}
    >
      <p>This is an unknown network. Please connect to Metadium network</p>
    </Modal>
  }

  getContent () {
    if (!this.state.loadWeb3) return
    switch (this.state.nav) {
      case '1': return <Authority title='Authority' />
      case '2': return <Voting title='Voting' />
      default:
    }
  }

  render () {
    return (
      <Layout className='layout'>
        <Header style={{ padding: '0 15%', backgroundColor: 'white', borderBottom: 'inset' }}>
          <Row>
            <Col span={4}><img src='https://raw.githubusercontent.com/METADIUM/metadium-token-contract/master/misc/Metadium_Logo_Vertical_PNG.png' alt='' width='35%' height='35%' style={{ float: 'left' }} /><h3>Governance</h3></Col>
            <Col offset={15} span={5}>
              <Tabs defaultActiveKey='1' onChange={this.onMenuClick}>
                <TabPane tab='Authority' key='1' />
                <TabPane tab='Voting' key='2' />
              </Tabs>
            </Col>
          </Row>
        </Header>

        <Content style={{ backgroundColor: 'white' }}>
          {this.state.loadWeb3
            ? <div> {this.getContent()} </div>
            : <div> { this.getErrModal()} </div>
          }
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Copyright © Since 2018 Metadium Technology, Inc. All rights reserved
        </Footer>
      </Layout>
    )
  }
}

export default App
