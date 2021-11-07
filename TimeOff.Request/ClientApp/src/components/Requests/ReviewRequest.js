import React, { Component } from 'react';
import {
    Input, Button, Row, Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'moment';

const updateRequest = async values => {
    console.log(values);
    const url = '/api/Request/' + values.id;
    const resp = await fetch(url, {
        meothd: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            ...values
        })
    })
    return resp.json();
}

export class ReviewRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: null,
            status: null,
            admin: false,
            userId: null,
            loading: true
        }

        this.onApprove = this.onApprove.bind(this)
    }

    componentDidMount() {
        this.populateRequestData()
            .then(() => this.updateStatus())
    }

    updateStatus() {
        let status = null
        if (this.state.request.approvedById === null) {
            status = 'Awaiting Approval'
        } else if (this.state.request.canceled === true) {
            status = 'Denied'
        }
        this.setState({ status })
    }

    async onApprove(event) {
        event.preventDefault();
        const values = {
            id: this.state.request.id,
            createdBy: this.state.request.createdById,
            approvedById: this.state.userId,
            description: this.state.request.description,
            createdDate: this.state.request.createdDate,
            approvedDate: new Date(),
            startDate: this.state.request.startDate,
            endDate: this.state.request.endDate,
            numberOfDays: this.state.request.numberOfDays,
            canceled: false,
            archived: false,
            disabled: false
        }
        await updateRequest(values).then(

        )
    }

    renderReviewRequest(state) {
        return (
            <div>
                <Table dark>
                    <thead>
                        <tr>
                            <th>Request</th>
                            <th>User</th>
                            <th>Created Date</th>
                            <th>Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }}>{state.request.id}</td>
                            <td>{state.request.createdBy.name}</td>
                            <td>{Moment(state.request.createdDate).format('LL')}</td>
                            <td>
                                {state.request.approvedById !== null ? (
                                    Moment(state.approvedDate).format('LL')
                                ) : (
                                    state.status
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table dark>
                    <thead>
                        <tr>
                            <td>Start Date</td>
                            <td>End Date</td>
                            <td>Number of Days</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Moment(state.request.createdDate).format('LL')}</td>
                            <td>{Moment(state.request.endDate).format('LL')}</td>
                            <td style={{textAlign: 'center'}}>{state.request.numberOfDays}</td>
                        </tr>
                    </tbody>
                </Table>
                <Table dark>
                    <thead>
                        <tr>
                            <td>Description</td>
                            {state.admin && <td>Disabled</td>}
                            {state.admin && <td>Archived</td>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{state.request.description}</td>
                            {state.admin && <td>
                                <Input type="checkbox" checked={state.disabled} disabled style={{ marginLeft: '2%' }}></Input>
                            </td>}
                            {state.admin && <td>
                                <Input type="checkbox" checked={state.archived} disabled style={{ marginLeft: '2%' }}></Input>
                            </td>}
                        </tr>
                    </tbody>
                </Table>
                <Row>
                    {(state.request.approvedById === null && state.request.canceled === false) && 
                        <Button className="m-2 ml-3">Approve</Button>
                    }
                    {(state.request.approvedById === null && state.request.canceled === false) && 
                        <Button className="m-2">Deny</Button>
                    }
                    {(state.admin === true && state.request.disabled === false) &&
                        <Button className="m-2">Disabled</Button>
                    }
                    {(state.admin === true && state.request.archived === false) &&
                        <Button className="m-2">Archived</Button>
                    }
                </Row>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Row key='0' className='mb-2'>
                    <Link to={`/review-requests`}>&laquo; Return to Review Requests</Link>
                </Row>
                <Row key='1'>
                    {this.state.loading 
                        ? <p><em>Loading Request...</em></p>
                        : this.renderReviewRequest(this.state)
                    }
                </Row>
            </div>
        )
    }

    async populateRequestData() {
        const id = this.props.match.params.id;
        const userId = Number.parseInt(localStorage.getItem('user'), 10);
        const response1 = await fetch('api/User/' + userId)
        const data1 = await response1.json();
        const isAdmin = data1.roles === 'Administrator'

        const response2 = await fetch('api/Request/' + id);
        const data2 = await response2.json();
        if (data2 !== null) {
            this.setState({
                request: data2,
                loading: false,
                admin: isAdmin,
                userId: userId
            })
        }
    }
}