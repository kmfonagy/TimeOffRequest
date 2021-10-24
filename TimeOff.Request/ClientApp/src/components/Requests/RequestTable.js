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

    render() {
        return (
            <div>
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
                                <td style={{ textAlign: 'center' }}>
                                    <Link
                                        id='request-link'
                                        to={`/request/${req.id}`}
                                        style={{color: 'inherit'}}
                                    >{req.id}</Link>
                                </td>
                                <td>{Moment(req.createdDate).format('LL')}</td>
                                {req.approvedById !== null ? (
                                    <td>Approved</td>
                                ) : (
                                        <td>Awaiting Approval</td>
                                    )}
                                <td>{Moment(req.startDate).format('LL')}</td>
                                <td>{Moment(req.endDate).format('LL')}</td>
                                <td style={{ textAlign: 'center' }}>{req.numberOfDays}</td>
                                <td>
                                    <Input type="checkbox" checked={req.canceled} readOnly style={{ marginLeft: '2%' }}></Input>
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