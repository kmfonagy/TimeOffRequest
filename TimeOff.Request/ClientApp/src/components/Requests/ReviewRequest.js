import React, { Component } from 'react';
import {
    Input, Button, Row, Table, Form, FormGroup, Spinner
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import Moment from 'moment';

const updateRequest = async values => {
    const url = '/api/Request/' + values.id;
    const resp = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            ...values
        })
    })
    return resp.json();
}

const updateUser = async values => {
    const url = '/api/User/' + values.id;
    const resp = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            ...values
        })
    })
    return resp.json()
}

export class ReviewRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: null,
            status: null,
            admin: false,
            userId: null,
            loading: true,
            disabled: false,
            archived: false,
            approved: null,
            approvedDate: null,
            canceled: false,
            show: false,
            redirect: false,
            error: false,
            requestor: null,
            sorted: []
        }

        this.onApprove = this.onApprove.bind(this)
        this.onDeny = this.onDeny.bind(this)
        this.onDisable = this.onDisable.bind(this)
        this.onArchive = this.onArchive.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        this.populateRequestData().then(() => this.updateStatus())
    }

    updateStatus() {
        let status = null
        let show = false
        let approved = this.state.request.approvedById
        let canceled = this.state.request.canceled
        let archived = this.state.request.archived
        let disabled = this.state.request.disabled
        let approvedDate = this.state.request.approvedDate
        let sorted = this.state.active.filter(r => r.createdById !== this.state.request.createdById)
        
        if (this.state.request.approvedById === null) {
            status = 'Awaiting Approval'
        } else if (this.state.request.canceled === true) {
            status = 'Denied'
        }

        if (this.state.request.approvedById === null && !this.state.request.canceled){
            show = true
        } else if (!this.state.request.disabled) {
            show = true
        } else if (!this.state.request.archived) {
            show = true
        }

        this.setState({ status, show, approved, canceled, archived, disabled, approvedDate, sorted })
    }

    onApprove() {
        this.setState({
            approved: this.state.userId,
            approvedDate: Moment(new Date()).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS),
            archive: false,
            canceled: false,
            disabled: false,
            status: 'Approved'
        })
    }

    onDeny() {
        this.setState({
            approved: null,
            approvedDate: this.state.request.createdDate,
            archive: false,
            canceled: true,
            disabled: false,
            status: 'Denied'
        })
    }

    onDisable() {
        this.setState({
            disabled: true,
        })
    }

    onArchive() {
        this.setState({
            archived: true,
        })
    }

    async onSubmit(event) {
        event.preventDefault();
        const values = {
            ...this.state.request,
            approvedById: this.state.approved,
            disabled: this.state.disabled,
            archived: this.state.archived,
            approvedDate: this.state.approvedDate,
            canceled: this.state.canceled
        }

        if (this.state.canceled) {
            let avail = this.state.requestor.numberOfDaysOff
            let req = this.state.request.numberOfDays
            let days = avail + req
            const user = {
                ...this.state.requestor,
                numberOfDaysOff: days
            }

            await updateUser(user).then((resp) => {
                if (resp.numberOfDaysOff !== days) {
                    this.setState({
                        error: true
                    })
                    return
                }
            });
        }

        await updateRequest(values).then((resp) => {
            if (resp.id === values.id) {
                this.redirect()
            } else {
                this.setState({
                    error: true
                })
            }
        })
    }

    redirect() {
        this.setState({redirect: true})
    }

    renderReviewRequest(state) {
        return (
            <div>
                <Table>
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
                <Table>
                    <thead>
                        <tr>
                            <td>Start Date</td>
                            <td>End Date</td>
                            <td>Number of Days</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Moment(state.request.startDate).format('LL')}</td>
                            <td>{Moment(state.request.endDate).format('LL')}</td>
                            <td style={{textAlign: 'center'}}>{state.request.numberOfDays}</td>
                        </tr>
                    </tbody>
                </Table>
                <Table>
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
                <Form style={{width: 'auto'}} className='ml-1' onSubmit={this.onSubmit}>
                    <FormGroup>
                        {(state.request.approvedById === null && !state.request.canceled) &&
                            <Button
                                className="m-2"
                                onClick={this.onApprove}
                            >Approve</Button>
                        }
                        {(state.request.approvedById === null && !state.request.canceled) &&
                            <Button
                                className="m-2"
                                onClick={this.onDeny}
                            >Deny</Button>
                        }
                        {(state.admin && !state.request.disabled) &&
                            <Button
                                className="m-2"
                                onClick={this.onDisable}
                            >Disabled</Button>
                        }
                        {(state.admin && !state.request.archived) &&
                            <Button
                                className="m-2"
                                onClick={this.onArchive}
                            >Archived</Button>
                        }
                        {state.show &&
                            <Button
                                className='m-2'
                                id='submit'
                                type='submit'
                            >Submit</Button>
                        }
                    </FormGroup>
                </Form>
                
            </div>
        )
    }

    returnActiveRequest(state) {
        const approved = state.sorted.filter(r => r.approvedById === state.userId)
        if (approved.length > 0) {
            return (
                <div>
                    <h6 className="pl-2">Active Approved Requests</h6>
                    <Table>
                        <thead>
                            <tr>
                                <td>User</td>
                                <td>Start Date</td>
                                <td>End Date</td>
                            </tr>
                        </thead>
                        <tbody>
                            {approved.map(r =>
                                <tr key={r.id}>
                                    <td>{r.createdBy.name}</td>
                                    <td>{Moment(r.startDate).format('LL')}</td>
                                    <td>{Moment(r.endDate).format('LL')}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )
        } else {
            return (
                <div><p><em>No Active Approved Requests</em></p></div>
            )
        }
    }

    render() {
        return (
            <div>
                { this.state.redirect ? (<Redirect push to={`/review-requests`} />) : null }
                { this.error && <Row key='0'><p style={{color: 'red'}}>Unable to complete request</p></Row>}
                <Row key='1' className='mb-2'>
                    <Link to={`/review-requests`}>&laquo; Return to Review Requests</Link>
                </Row>
                <Row key='2'>
                    {this.state.loading 
                        ? <Spinner>Loading...</Spinner>
                        : this.renderReviewRequest(this.state)
                    }
                </Row>
                <Row key='3' style={{marginTop: 4}}>
                    <div>
                        {!this.state.loading && this.returnActiveRequest(this.state)
                        }
                    </div>
                </Row>
            </div>
        )
    }

    async populateRequestData() {
        const id = this.props.match.params.id;
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response1 = await fetch('api/User/' + userId)
        const data1 = await response1.json();
        const isAdmin = data1.roles === 'Administrator'
        const response2 = await fetch('api/Request/' + id);
        const data2 = await response2.json();
        const response3 = await fetch('api/User/' + data2.createdById)
        const data3 = await response3.json()
        const response4 = await fetch('api/Request');
        const data4 = await response4.json();
        const curDate = Moment(new Date()).format('LL')
        
        if (data2 !== null) {
            this.setState({
                request: data2,
                loading: false,
                admin: isAdmin,
                userId: userId,
                date: data2.approvedDate,
                requestor: data3,
                active: data4.filter(r => (r.createdBy.supervisorId === userId) && (Moment(r.endDate).format('LL') <= curDate && !r.archived)),
            })
        }
    }
}