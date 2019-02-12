import React from 'react';
import { Button, List, Progress, Input, Collapse } from 'antd';
import './style/style.css'


import { columns } from './columns'
import { testData } from './test/testData'

const ballotColumns = columns.ballotColumns;

class Voting extends React.Component {
    data = {
        ballotOriginItems : [],
        activeItems: [],
        proposalItems: [],
        finalizedItems: [],
    }
    state = {
        isBallotLoading: false,
        isBallotDetailLoading: false,
    }

    constructor(props) {
        super(props)
        this.onClickDetailBtn = this.onClickDetailBtn.bind(this)
    }

    componentWillMount() {
        this.getBallotOriginInfo();
    }

    getBallotOriginInfo() {
        let list = []

        testData.votingTestData.map(item => {
            list.push(
                <div className='ballotDiv' state={item.state} key={list.length}>
                        <div className = 'ballotInfoDiv'>
                            <div className = 'ballotDetailDiv' style={{width: '15%'}}>
                                <h4>Creator</h4><p>{item.creator}
                                </p>
                            </div>
                            <div className = 'ballotDetailDiv' style={{width: '15%'}}>
                                <h4>Ballot Type</h4><p>{item.ballotType}</p>
                            </div>
                            <div className = 'ballotDetailDiv'>
                                <h4>Proposal Address</h4><p>{item.proposalAddr}</p>
                            </div>
                            <div className = 'ballotDetailDiv' style={{width: '10%'}}>
                                <h4>State</h4><p>{item.state}</p>
                            </div>
                             {item.state == 'Ready' || item.state == 'Accepted' || item.state == 'Rejected'
                                ? <Button type='primary' id='ballotDetailBtn' onClick={this.onClickDetailBtn}>+</Button> : ''} 
                        </div>
                        <div className='voteDiv'>
                            <Button id='noVotingBtn'>No</Button>
                            <Button id='yesVotingBtn'>Yes</Button>
                            <span>
                                <h4 style={{float: 'left'}}>30%</h4>
                                <h4 style={{float: 'right'}}>70%</h4>
                                <Progress percent={30} showInfo={false}/>
                            </span>
                        </div>
                        <div className = 'ballotExplainDiv'>
                            <div style={{float: 'right'}}>
                                <p >Started: {item.startTime}</p>
                                <p >Ended: {item.endTime}</p>
                            </div>
                            <p>description</p>
                            <p>description</p>
                            <p>description</p>
                            <div>
                                <p>{item.memo}</p>
                                <Button style={{float: 'right'}} type='primary'>Revoke</Button>
                            </div>
                        </div>
                    </div>
            )
        })

        this.data.ballotOriginItems = list;
        this.getBallotDetailInfo()
        this.setState({ isBallotLoading: true })
    }

    getBallotDetailInfo() {
        let activeList = [], proposalList = [], finalizedList = []
        this.data.ballotOriginItems.map( item => {
            switch(item.props.state) {
                case 'InProgress':
                    activeList.push(item)
                    break;
                case 'Ready':
                    proposalList.push(item)
                    break;
                case 'Accepted':
                case 'Rejected':
                    finalizedList.push(item)
                    break;
                default: break;
            }
        });
        this.data.activeItems = activeList
        this.data.proposalItems = proposalList
        this.data.finalizedItems = finalizedList
    }

    onClickDetailBtn = (e) => {
        console.log('onClickDetailBtn: ', e.target.props, this)
    }

    render() {
        return (
            <div>
                <div className='contentDiv'>
                    <div>
                        <Input.Search
                            placeholder="Search by Type, Proposal, Keywords"
                            onSearch={value => console.log(value)}
                            enterButton
                            style={{width: '70%', margin: '1% 0 1% 1.5%'}}
                        />
                        <Button className='apply_proposal_Btn'>New Proposal</Button>
                    </div>

                    <h1>Active</h1>
                    {this.state.isBallotLoading
                        ? this.data.activeItems
                        :<div>empty</div>
                        }<br></br><br></br>

                    <h1>Proposals</h1>
                    {this.state.isBallotLoading
                        ? this.data.proposalItems
                        :<div>empty</div>
                        }<br></br><br></br>

                    <h1>Finalized</h1>
                    {this.state.isBallotLoading
                        ? this.data.finalizedItems
                        :<div>empty</div>
                        }<br></br><br></br>
                </div>
            </div>
        )
    }
}
export { Voting }