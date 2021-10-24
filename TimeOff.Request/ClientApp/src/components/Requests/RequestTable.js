import React, { Component } from 'react';
import { Table, Input } from 'reactstrap';
import Moment from 'moment';

export class RequestTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: props.state.requests,
            sorted: props.state.sorted
        }
    }


    render() {
        return (
            <Table dark hover>
                <thead>
                    <tr>
                        <th>Request Number</th>
                        <th>Created Date</th>
                        <th>Approved</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Canceled</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.sorted.filter(r => r.archived === false).map(req =>
                        <tr key={req.id}>
                            <td>{ req.id }</td>
                            <td>{Moment(req.createdDate).format('LL')}</td>
                            {req.approvedById !== null ? (
                                <td>Approved</td>
                            ) : (
                                    <td>Awaiting Approval</td>
                                )}
                            <td>{Moment(req.startDate).format('LL')}</td>
                            <td>{Moment(req.endDate).format('LL')}</td>
                            <td>{req.numberOfDays}</td>
                            <td>
                                <Input type="checkbox" checked={req.canceled} readOnly></Input>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        )
    }
}

export default RequestTable;