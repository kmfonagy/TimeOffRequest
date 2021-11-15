import React, {Component} from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'moment';

export class ReviewTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: props.state.requests,
            userId: props.state.userId
        }
    }

    render() {
        return (
            <div>
                <Table dark hover>
                    <thead>
                        <tr>
                            <th>Request</th>
                            <th>User</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.requests.filter(r => (r.archived === false) && (r.canceled === false) && (r.approvedById === null)).map(r => 
                            <tr key={r.id}>
                                <td style={{ textAlign: 'center'}}>{r.id}</td>
                                <td>{r.createdBy.name}</td>
                                <td>{Moment(r.startDate).format('LL')}</td>
                                <td>{Moment(r.endDate).format('LL')}</td>
                                <td style={{ textAlign: 'center' }}>{r.numberOfDays}</td>
                                <td>
                                    <Link 
                                        id='request-link'
                                        to={`/review/${r.id}`}
                                        style={{color: 'inherit'}}
                                    >View Request</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ReviewTable