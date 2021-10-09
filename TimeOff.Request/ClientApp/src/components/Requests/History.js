import React, { Component } from 'react';
import { Table, Button, Row } from 'reactstrap';
import Moment from 'moment';
import ReqDropdown from './ReqDropdown';
import { Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            loading: true,
            testId: 2
        };

        
    }

    componentDidMount() {
        this.populateRequestData();
    }

    static renderReqsTable(requests) {
        return (
            <Table dark hover>
                <thead>
                    <tr>
                        <th>Created Date</th>
                        <th>Approved Date</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Disabled</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req =>
                        <tr key={req.id}>
                            <td>{ Moment(req.createdDate).format('LL') }</td>
                            <td>{ Moment(req.approvedDate).format('LL') }</td>
                            <td>{ Moment(req.startDate).format('LL') }</td>
                            <td>{ Moment(req.endDate).format('LL') }</td>
                            <td>{ req.numberOfDays }</td>
                            <td>
                                <Button type="checkbox" value={req.disabled}></Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }

    render() {
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
                        <ReqDropdown />
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
            this.setState({ requests: data, loading: false });
        }
    }
}