import React, { Component } from 'react';
import {
    Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu,
    DropdownItem, InputGroup, InputGroupText, InputGroupAddon, Input
} from 'reactstrap';
import Moment from 'moment';
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
            testId: 2
        };

        this.curDate = new Date();
        this.filterApproved = this.filterApproved.bind(this)
        this.afterDateChange = this.afterDateChange.bind(this)
        this.beforeDateChange = this.beforeDateChange.bind(this)
        this.filterByDate = this.filterByDate.bind(this)
    }

    componentDidMount() {
        this.populateRequestData();
        console.log("Component did mount")
    }

    setAll = () => {
        this.setState({
            filter: false,
            lastClicked: "History"
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

        if (value === "Unapproved") {
            for (let i = 0; i < this.state.requests.length; i++) {
                if (this.state.requests[i].approvedById === null) {
                    sorted.push(this.state.requests[i]);
                }
            }
        }

        this.setState({
            sorted: sorted,
            lastClicked: value,
            filter: true,
        })

        console.log(sorted + '\n' + this.state.sorted + "\n" + this.state.filter)
    }

    afterDateChange = (e) => {
        console.log(e.target.value);
        this.setState({
            afterDate: e.target.value
        })
        console.log(this.state.afterDate)
    }

    beforeDateChange = (e) => {
        this.setState({
            beforeDate: e.target.value
        })
        
    }

    filterByDate = () => {
        let sorted = []
        if (this.state.afterDate === null) {
            sorted = this.state.requests.filter(r => r.createdDate < this.state.beforeDate)

            this.setState({
                sorted: sorted,
                lastClicked: "By Date",
                filter: true
            })
        } else if (this.state.beforeDate === null) {
            sorted = this.state.requests.filter(r => r.createdDate > this.state.afterDate)

            this.setState({
                sorted: sorted,
                lastClicked: "By Date",
                filter: true
            })
        } else {
            sorted = this.state.requests.filter(r => r.createdDate < this.state.beforeDate &&
                r.createdDate > this.afterDate)

            this.setState({
                sorted: sorted,
                lastClicked: "By Date",
                filter: true
            })
        }
    }

    renderReqsTable(state) {
        return (
            <RequestTable state={state} />
        )
    }

    render() {
        const dropdown = [
            { id: 0, value: "Approved" },
            { id: 0, value: "Unapproved" }
        ]

        const contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderReqsTable(this.state);

        return (
            <div>
                <Row key='1'>
                    <h4>{this.state.lastClicked}</h4>
                    <Button color="secondary" onClick={this.setAll}>All</Button>
                    <Dropdown group isOpen={this.state.open} size="sm" toggle={this.toggle}>
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
                    <InputGroup>
                        <InputGroupAddon addonType="prepend" >After</InputGroupAddon>
                        <Input
                            key="after"
                            id="afterDate"
                            name="afterDate"
                            value={this.state.afterDate}
                            type="date"
                            onChange={this.afterDateChange}
                        />
                        <InputGroupAddon addonType="prepend">Before</InputGroupAddon>
                        <Input
                            key="before"
                            id="beforeDate"
                            name="beforeDate"
                            value={this.state.beforeDate}
                            type="date"
                            onChange={this.beforeDateChange}
                        />
                        <Button>Filter</Button>
                    </InputGroup>
                </Row>
                <Row key="2">
                    {contents}
                </Row>
            </div>
        );
    }

    async populateRequestData() {
        const response = await fetch('api/request/CreatedBy/' + this.state.testId);
        const data = await response.json();
        console.log(data)
        if (data.length > 0) {
            this.setState({
                requests: data.sort((a, b) => b.createdDate > a.createdDate ? 1 : -1),
                loading: false
            });
        }
    }
}

export default History;