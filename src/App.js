import React from 'react'
import { Layout, Button, Row, Menu, Modal, Tabs, Input, Select } from 'antd'
import { Voting } from './components/Voting'
import { Authority } from './components/Authority'
import './App.css'

// web3
import getWeb3Instance from './ethereum/web3'
import web3Config from './ethereum/web3-config.json'

// Contracts
import { contracts, initContracts } from './ethereum/web3Components/contracts'

const { Header, Content, Footer } = Layout
const Option = Select.Option
const TabPane = Tabs.TabPane

class App extends React.Component {
  state = {
    loadWeb3: false,
    nav: '1',
    contractReady: false,
    stakingModal: false,
    selectedMenu: false,
  };

  constructor (props) {
    super(props)
    /* Get web3 instance. */
    getWeb3Instance().then(async web3Config => {
      console.log(web3Config)
      this.initContracts(web3Config.web3)
      this.setState({ loadWeb3: true })
    }, async error => {
      console.log('getWeb3 error: ', error)
      this.setState({ loadWeb3: false })
    })
  }

  async initContracts (web3) {
    initContracts({
      web3: web3,
      netid: web3Config.netid
    }).then(async () => this.setState({ contractReady: true }))
  }

  onMenuClick = ({key}) => {
    this.setState({ nav: key+"" })
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
      case '1': return <Authority title='Authority' contracts={contracts} />
      case '2': return <Voting title='Voting' contracts={contracts} />
      default:
    }
    this.setState({ selectedMenu: true})
  }

  showStakingModal = (e) => {
    this.setState({
      stakingModal: true,
    });
  }

  hideStakingModal = (e) => {
    this.setState({
      stakingModal: false,
    });
  }

  submitMetaStaing = (e) => {
    this.setState({
      stakingModal: false,
    });
  }

  render () {
    return (
      <Layout className='layout'>
        <Header>
          <Row>
            <div className="header-logo"><img src={require('./img/logo_header_blue.png')} alt='' /><span>governance</span></div>
            <div className="header-menu">
              <Menu
                onClick={this.onMenuClick}
                selectedKeys={[this.state.nav ]}
                mode={"horizontal"}>
                <Menu.Item key='1'>Authority</Menu.Item>
                <Menu.Item key='2'>Voting</Menu.Item>
              </Menu>
            </div>
            <div className="header-staking">
              <div>
                <p className="staked">Staked 000,000,000 Meta</p>
                <p className="meta">(Locked 000,000,000 META)</p>
              </div>
              <Button type="primary" onClick={ this.showStakingModal }>META Staking</Button>
            </div>
          </Row>
        </Header>

        <Modal
          className="stakingModal"
          title="META Staking"
          visible={ this.state.stakingModal }
          onOk={ this.submitMetaStaing }
          onCancel={ this.hideStakingModal }
          footer={[
            <Button key="cancle" onClick={this.hideStakingModal}>cancle</Button>,
            <Button key="submit" type="primary" onClick={this.submitMetaStaing}>
              Submit
            </Button>,
          ]}>
          <p>staked 000,000,000 META (Locked 000,000,000 META)</p>
          <Select defaultValue="Deposit">
            <Option value="Deposit">Deposit Staking</Option>
            <Option value="Withdraw">Withdraw Staking</Option>
          </Select>
          <Input type="number" placeholder="META Amount" addonAfter="META"></Input>
        </Modal>

        <Content style={{ backgroundColor: 'white' }}>
          {this.state.loadWeb3
            ? <div> {this.getContent()} </div>
            : <div> { this.getErrModal()} </div>
          }
        </Content>

        <Footer>
          <Row>
            <p>Copyright © Since 2018 Metadium Technology, Inc. All rights reserved</p>
            <div>
              <Button></Button>
              <Button></Button>
              <Button></Button>
            </div>
          </Row>
        </Footer>
      </Layout>
    )
  }
}

export default App
