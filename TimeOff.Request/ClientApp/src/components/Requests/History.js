import React, { Component } from 'react';
import { Table, Button, Row } from 'reactstrap';
import Moment from 'moment';
import RequestTable from './RequestTable';
import { Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            allReq: [],
            loading: true,
            lastClicked: 'All',
            open: false,
            testId: 2
        };

        this.curDate = new Date();
    }

    componentDidMount() {
        this.populateRequestData();
    }

    toggle = () => {
        this.setState({
            open: !open
        })
    }

    setLastClicked = (value) => {
        if (value === 'All') {
            this.setState({
                requests: this.state.allReq,
                lastClicked: value
            })
        }
        else if (value === 'Timeframe') {
            let sorted = this.state.allReq.sort((a, b) => b.startDate > a.startDate ? 1 : -1);
            this.setState({
                requests: sorted,
                lastClicked: value
            })
        }
        else if (value === 'Approval') {
            // need to identify how we want to sort this

        }
        else if (value === 'Status') {
            let sorted = this.state.allReq.filter(req => req.endDate < this.curDate);
            this.setState({
                requests: sorted,
                lastClicked: value
            })
        }
    } 

    static renderReqsTable(requests) {
        return (
            <RequestTable requests={requests} />
        );
    }

    render() {
        const dropdown = [
            { id: 1, name: 'All Requests', value: 'All' },
            { id: 2, name: 'By Timeframe', value: 'Timeframe' },
            { id: 3, name: 'By Approval', value: 'Approval' },
            { id: 4, name: 'Completion Status', value: 'Status' }
        ]
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : History.renderReqsTable(this.state.requests);

        return (
            <div>
                <Row>
                    <Col>
                        <h1 id="tabelLabel" >Request History</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <Dropdown group isOpen={this.state.open} size="sm" toggle={this.toggle}>
                                <DropdownToggle caret>
                                    {this.state.lastClicked}
                                </DropdownToggle>
                                <DropdownMenu container="body">
                                    {dropdown.map((id, name, value) =>
                                        <DropdownItem
                                            key={id}
                                            value={value}
                                            onClick={this.setLastClicked.bind(this, value)}
                                        >{name}</DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
                {contents}
            </div>
        );
    }

    async populateRequestData() {
        const response = await fetch('api/request/CreatedBy/' + this.state.testId);
        const data = await response.json();
        console.log(data)
        if (data.length > 0) {
            this.setState({
                requests: data,
                allReq: data,
                loading: false
            });
        }
    }
}