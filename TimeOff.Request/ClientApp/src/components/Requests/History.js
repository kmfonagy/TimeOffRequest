import React, { Component } from 'react';
import {
    Row, Button, Dropdown, DropdownToggle, DropdownMenu,
    DropdownItem, InputGroup, InputGroupAddon, Input, Spinner
} from 'reactstrap';
import RequestTable from './RequestTable';

export class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            approval: null,
            loading: true,
            lastClicked: 'History',
            open: false,
            afterDate: null,
            beforeDate: null,
            filter: false,
            sorted: [],
        };

        this.curDate = new Date();
        this.filterApproved = this.filterApproved.bind(this)
        this.afterDateChange = this.afterDateChange.bind(this)
        this.beforeDateChange = this.beforeDateChange.bind(this)
        this.filterByDate = this.filterByDate.bind(this)
    }

    componentDidMount() {
        this.populateRequestData();
    }

    setAll = () => {
        this.setState({
            loading: true,
            filter: false,
            lastClicked: "History",
            sorted: this.state.requests
        }, () => {
            this.setState({ loading: false })
        })
    }

    toggle = () => {
        const opening = !this.state.open;
        this.setState({
            open: opening
        })
    }

    filterApproved = (value) => {
        let sorted = []
        if (value === "Approved") {
            for (let i = 0; i < this.state.requests.length; i++) {
                if (this.state.requests[i].approvedById !== null) {
                    sorted.push(this.state.requests[i]);
                }
            }
        }

        if (value === "Awaiting Approval") {
            for (let i = 0; i < this.state.requests.length; i++) {
                if (this.state.requests[i].approvedById === null && this.state.requests[i].canceled === false) {
                    sorted.push(this.state.requests[i]);
                }
            }
        }

        if (value === "Denied") {
            for (let i = 0; i < this.state.requests.length; i++) {
                if (this.state.requests[i].canceled === true) {
                    sorted.push(this.state.requests[i]);
                }
            }
        }

        this.setState({
            loading: true,
            sorted: sorted,
            lastClicked: value,
            filter: true,
        }, () => {
            this.setState({ loading: false })
        })
    }

    afterDateChange = (e) => {
        this.setState({
            afterDate: e.target.value
        })
    }

    beforeDateChange = (e) => {
        this.setState({
            beforeDate: e.target.value
        })
        
    }

    filterByDate = () => {
        let sorted = []
        if (this.state.afterDate === null || this.state.afterDate === '') {
            sorted = this.state.requests.filter(r => r.startDate < this.state.beforeDate)

            this.setState({
                loading: true,
                sorted: sorted,
                lastClicked: "By Date",
                filter: true
            }, () => {
                this.setState({ loading: false })
            })
        } else if (this.state.beforeDate === null || this.state.beforeDate === '') {
            sorted = this.state.requests.filter(r => r.startDate > this.state.afterDate)

            this.setState({
                loading: true,
                sorted: sorted,
                lastClicked: "By Date",
                filter: true
            }, () => {
                this.setState({ loading: false })
            })
        } else {
            sorted = this.state.requests.filter(r => r.startDate < this.state.beforeDate &&
                r.startDate > this.state.afterDate)

            this.setState({
                loading: true,
                sorted: sorted,
                lastClicked: "By Date",
                filter: true
            }, () => {
                this.setState({ loading: false })
            })
        }
    }

    renderReqsTable(state) {
        if (state.requests.filter(r => !r.archived ) !== 0) {
            return (
                <RequestTable state={state} />
            )
        } else {
            return (
                <h6 className="m-3"><em>No available requests</em></h6>
            )
        }
    }

    render() {
        const dropdown = [
            { id: 0, value: "Approved" },
            { id: 1, value: "Awaiting Approval" },
            { id: 2, value: "Denied" }
        ]

        return (
            <div>
                <Row key='1'>
                    <h4 className="m-3">{this.state.lastClicked}</h4>
                    <InputGroup  className="m-2">
                        <Button color="secondary" onClick={this.setAll} className="ml-2" style={{height: '40px'}}>All</Button>
                        <Dropdown group isOpen={this.state.open} size="sm" toggle={this.toggle} className="ml-2 mr-2" style={{height: '40px'}}>
                            <DropdownToggle caret>
                                Approval Status
                            </DropdownToggle>
                            <DropdownMenu container="body">
                                {dropdown.map(d =>
                                    <DropdownItem
                                        key={d.id}
                                        value={d.value}
                                        onClick={this.filterApproved.bind(this, d.value)}
                                    >{d.value}</DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <InputGroupAddon 
                        size='sm' addonType="prepend" className="ml-2" style={{height: '40px'}}>After</InputGroupAddon>
                        <Input
                            key="after"
                            id="afterDate"
                            name="afterDate"
                            value={this.state.afterDate === null ? '' : this.state.afterDate}
                            type="date"
                            onChange={this.afterDateChange}
                            style={{ maxWidth: '180px', textAlign: 'center', height: '40px' }}
                        />
                        <InputGroupAddon addonType="prepend" className="ml-2" 
                        size='sm' style={{height: '40px'}}>Before</InputGroupAddon>
                        <Input
                            key="before"
                            id="beforeDate"
                            name="beforeDate"
                            value={this.state.beforeDate === null ? '' : this.state.beforeDate}
                            type="date"
                            onChange={this.beforeDateChange}
                            style={{ maxWidth: '180px', textAlign: 'center', height: '40px' }}
                        />
                        <Button onClick={this.filterByDate} className="ml-2 mr-2" size='sm' style={{height: '40px'}}>Filter</Button>
                    </InputGroup>
                </Row>
                <Row key="3">
                    {this.state.loading
                        ? <Spinner className="m-3">Loading...</Spinner>
                        : this.renderReqsTable(this.state)}
                </Row>
            </div>
        );
    }

    async populateRequestData() {
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await fetch('api/request/CreatedBy/' + user.id);
        const data = await response.json();
        
        if (data.length > 0) {
            this.setState({
                requests: data.sort((a, b) => b.id < a.id ? 1 : -1),
                sorted: data.sort((a, b) => b.id < a.id ? 1 : -1),
                loading: false
            });
        }
    }
}

export default History;