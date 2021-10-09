import React, { Component } from 'react';
import { Table, Button, Row } from 'reactstrap';
import Moment from 'moment';
import ReqDropdown from './ReqDropdown';

export class RequestTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: props.requests
        }
    }

    render() {
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
                    {this.state.requests.map(req =>
                        <tr>
                            <td>{Moment(req.createdDate).format('LL')}</td>
                            <td>{Moment(req.approvedDate).format('LL')}</td>
                            <td>{Moment(req.startDate).format('LL')}</td>
                            <td>{Moment(req.endDate).format('LL')}</td>
                            <td>{req.numberOfDays}</td>
                            <td>
                                <Button type="checkbox" value={req.disabled}></Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        )
    }
}

export default RequestTable;