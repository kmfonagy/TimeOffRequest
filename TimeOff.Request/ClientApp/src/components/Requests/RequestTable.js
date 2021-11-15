import React, { Component } from 'react';
import {
    Table, Input
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'moment';

export class RequestTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: props.state.requests,
            sorted: props.state.sorted,
        }
    }

    approvalStatus(req) {
        let status = null
        if (req.approvedById !== null) {
            status = 'Approved'
        } else if (req.canceled === true) {
            status = 'Denied'
        } else {
            status = 'Awaiting Approval'
        }
        return status;
    }

    render() {
        return (
            <div>
                <Table dark hover className="m-3">
                    <thead>
                        <tr>
                            <th>Request</th>
                            <th>Created Date</th>
                            <th>Approved</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Disabled</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.sorted.filter(r => r.archived === false).map(req =>
                            <tr key={req.id}>
                                <td style={{ textAlign: 'center' }}>
                                    <Link
                                        id='request-link'
                                        to={`/request/${req.id}`}
                                        style={{color: 'inherit'}}
                                    >{req.id}</Link>
                                </td>
                                <td>{Moment(req.createdDate).format('LL')}</td>
                                <td>{this.approvalStatus(req)}</td>
                                <td>{Moment(req.startDate).format('LL')}</td>
                                <td>{Moment(req.endDate).format('LL')}</td>
                                <td style={{ textAlign: 'center' }}>{req.numberOfDays}</td>
                                <td>
                                    <Input type="checkbox" checked={req.disabled} readOnly style={{ marginLeft: '2%' }}></Input>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default RequestTable;