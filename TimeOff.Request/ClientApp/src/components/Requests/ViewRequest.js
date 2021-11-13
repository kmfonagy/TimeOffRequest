import React, { Component } from 'react';
import {
    Input, Button, Row, Form, FormGroup, Label, Table, Spinner, Col, FormText
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

export class ViewRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: null,
            description: '',
            startDate: '',
            endDate: '',
            numberOfDays: 0,
            loading: true,
            checked: false,
            status: null,
            hide: false,
            user: null,
            redirect: false,
            error: false,
            avail: null
        }

        this.onDescriptionChange = this.onInputChange.bind(this, 'description');
        this.onCancel = this.onInputChange.bind(this, 'checked');
        this.onStartChange = this.onInputChange.bind(this, 'startDate');
        this.onEndChange = this.onInputChange.bind(this, 'endDate')
        this.submitRequest = this.submitRequest.bind(this)
    }

    componentDidMount() {
        this.populateRequestData().then(() => this.updateStatus());
    }

    onInputChange(keyName, event) {
        this.setState({
            [keyName]: event.target.value
        }, () => {
            this.dateCalc()
        })
    }

    updateStatus() {
        let status = ''
        let hide = false
        if (this.state.request.approvedById !== null) {
            status = 'Approved'
        } else if (this.state.request.canceled) {
            status = 'Denied'
        } else {
            status = 'Awaiting Approved'
        }

        if (this.state.request.canceled || this.state.request.disabled) {
            hide = true
        }

        this.setState({
            hide: hide,
            status: status
        })
    }

    dateCalc() {
        if (this.state.startDate !== '' && this.state.endDate !== '') {
            let end = Moment(this.state.endDate).format('YYYY-MM-DD');
            let start = Moment(this.state.startDate).format('YYYY-MM-DD');
            let time = Moment(end).diff(start);
            let days = time / (1000 * 60 * 60 * 24);
            if (days > this.state.user.numberOfDaysOff) {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    numberOfDays: days
                })
            }

            if (this.state.request.numberOfDays !== days) {
                let newDays = this.state.request.numberOfDays - days
                let avail = this.state.user.numberOfDaysOff + newDays
                this.setState({avail})
            }
        }
    }

    async submitRequest(event) {
        event.preventDefault();
        let startDate = Moment(this.state.startDate).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS)
        let endDate = Moment(this.state.endDate).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS)
        const values = {
            ...this.state.request,
            description: this.state.description,
            startDate: startDate,
            endDate: endDate,
            numberOfDays: this.state.numberOfDays,
            approvedBy: null,
            approvedById: null
        }

        if (this.state.request.numberOfDays !== this.state.numberOfDays) {
            const user ={
                ...this.state.user,
                numberOfDaysOff: this.state.avail
            }
            await updateUser(user)
        }

        await updateRequest(values).then(() => {
            this.setState({redirect: true})
        });
    }

    renderViewRequest(state) {
        return (
            <div>
                <Table dark>
                    <thead>
                        <tr>
                            <th>Request Number</th>
                            <th>Created Date</th>
                            <th>Approved Date</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td style={{textAlign: 'center'}}>{state.request.id}</td>
                            <td>{Moment(state.request.createdDate).format('LL')}</td>
                            <td>{state.status}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Number of Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Moment(state.request.startDate).format('LL')}</td>
                            <td>{Moment(state.request.endDate).format('LL')}</td>
                            <td style={{textAlign: 'center'}}>{state.request.numberOfDays}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th colSpan='2'>Description</th>
                            <th>Available Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan='2'>{state.request.description}</td>
                            <td style={{textAlign: 'center'}}>{state.user.numberOfDaysOff}</td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                    {state.hide ? (<p>&nbsp;</p>) : (
                        <Form style={{width: 'auto'}} className='mt-2' onSubmit={this.submitRequest}>
                            <FormGroup>
                                { this.state.error && <FormText className='mb-2'><h6 style={{color: 'red'}}>Unable to complete request</h6></FormText> }
                                <Row>
                                    <Col>
                                        <Label for='start'>New Start Date: </Label>
                                        <Input
                                            key='start'
                                            id='start'
                                            name='start'
                                            style={{ width: '150px', textAlign: 'center' }}
                                            type='date'
                                            value={state.startDate}
                                            onChange={this.onStartChange}
                                        />
                                    </Col>
                                    <Col>
                                        <Label for='end'>New End Date: </Label>
                                        <Input
                                            key='end'
                                            id='end'
                                            name='end'
                                            style={{ width: '150px', textAlign: 'center' }}
                                            type='date'
                                            value={state.endDate}
                                            onChange={this.onEndChange}
                                        />
                                    </Col>
                                    <Col>
                                        <Label>Days:</Label><br/>
                                        <Input 
                                            disabled
                                            style={{ width: 50, textAlign: 'center', backgroundColor: 'white' }}
                                            placeholder={state.numberOfDays}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label for='description'>Description: </Label>
                                <Input
                                    type='textarea'
                                    key='description'
                                    id='description'
                                    name='description'
                                    value={state.description}
                                    onChange={this.onDescriptionChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    id='submit'
                                    type='submit'
                                >Submit</Button>
                            </FormGroup>
                        </Form>
                    )}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                { this.state.redirect && <Redirect push to={`/history`} /> }
                <Row key='0' className='mb-2'>
                    <Link to={`/history`}>&laquo; Return to Request History</Link>
                </Row>
                <Row key='2'>
                    {this.state.loading ?
                        <Spinner>Loading...</Spinner> : this.renderViewRequest(this.state)}
                </Row>
            </div>
        )
    }

    async populateRequestData() {
        const id = this.props.match.params.id;
        const user = 2 //localStorage.getItem('user');
        const response1 = await fetch('api/Request/' + id);
        const data1 = await response1.json();
        const response2 = await fetch('api/User/' + user);
        const data2 = await response2.json();

        if (data1 !== null && data2 !== null) {
            this.setState({
                request: data1,
                user: data2,
                loading: false,
                description: data1.description
            })
        }
    }
}

export default ViewRequest;