import React, { Component } from 'react';
import {
    Input, Button, Row, Form, FormGroup, Label, Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'moment';

const updateRequest = async values => {
    console.log(values.id);
    const url = '/api/Request/' + values.id;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: values.id,
            createdById: values.createdById,
            approvedById: values.approvedById,
            description: values.description,
            createdDate: values.createdDate,
            approvedDate: values.approvedDate,
            startDate: values.startDate,
            endDate: values.endDate,
            numberOfDays: values.numberOfDays,
            canceled: values.checked,
            archived: false,
            disabled: false
        })
    })
    return resp.json();
}

export class ViewRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            createdById: null,
            approvedById: null,
            description: null,
            createdDate: null,
            approvedDate: null,
            startDate: null,
            endDate: null,
            numberOfDays: null,
            canceled: false,
            archived: false,
            disabled: false,
            loading: true,
            checked: false,
            status: null
        }

        this.onDescriptionChange = this.onInputChange.bind(this, 'description');
        this.onCancel = this.onInputChange.bind(this, 'checked');
        this.onStartChange = this.onInputChange.bind(this, 'startDate');
        this.onEndChange = this.onInputChange.bind(this, 'endDate');
    }

    componentDidMount() {
        this.populateRequestData().then(this.updateStatus(this.state));
    }

    updateStatus(req) {
        let status = null;
        if (req.approvedById !== null) {
            status = 'Approved'
        } else if (req.canceled === true) {
            status = 'Denied'
        } else {
            status = 'Awaiting Approval'
        }
        this.setState({ status })
    }

    onInputChange(keyName, event) {
        this.setState({
            [keyName]: event.target.value
        }, () => {
            this.dateCalc()
        })
    }

    dateCalc() {
        let end = Moment(this.state.endDate).format('YYYY-MM-DD');
        let start = Moment(this.state.startDate).format('YYYY-MM-DD');
        let time = Moment(end).diff(start);
        let days = time / (1000 * 60 * 60 * 24);
        this.setState({
            numberOfDays: days
        })
    }

    async submitRequest(event) {
        const values = this.state
        event.preventDefault();
        await updateRequest(values);
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
                            <td style={{textAlign: 'center'}}>{state.id}</td>
                            <td>{Moment(state.createdDate).format('LL')}</td>
                            <td>
                                {state.status}
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
                            <td>{Moment(state.createdDate).format('LL')}</td>
                            <td>{Moment(state.endDate).format('LL')}</td>
                            <td style={{textAlign: 'center'}}>{state.numberOfDays}</td>
                        </tr>
                    </tbody>
                </Table>
                <Table dark>
                    <thead>
                        <tr>
                            <td>Description</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{state.description}</td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                    <Form style={{ width: 'auto' }} className='mt-2' onSubmit={this.submitRequest} >
                        <FormGroup>
                            <Label for='start'>New Start Date: </Label>
                            <Input
                                key='start'
                                id='start'
                                name='start'
                                style={{ width: '150px', textAlign: 'center' }}
                                type='date'
                                value={state.startDate}
                                onChange={this.onStartChange}
                                disabled={state.canceled}
                            />
                            <Label for='end' className='mt-2'>New End Date: </Label>
                            <Input
                                key='end'
                                id='end'
                                name='end'
                                style={{ width: '150px', textAlign: 'center' }}
                                type='date'
                                value={state.endDate}
                                onChange={this.onEndChange}
                                disabled={state.canceled}
                            />
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
                                disabled={state.canceled}
                            />
                        </FormGroup>
                        <FormGroup>
                            {!state.canceled &&
                                <Button
                                    id='submit'
                                    type='submit'
                                >Submit</Button>
                            }
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Row key='0' className='mb-2'>
                    <Link to={`/history`}>&laquo; Return to Request History</Link>
                </Row>
                <Row key='1'>
                    {this.state.loading ?
                        <p><em>Loading Request...</em></p> : this.renderViewRequest(this.state)}
                </Row>
            </div>
        )
    }

    async populateRequestData() {
        const id = this.props.match.params.id;
        const response = await fetch('api/Request/' + id);
        const data = await response.json();
        if (data !== null) {
            this.setState({
                id: data.id,
                createdById: data.createdById,
                approvedById: data.approvedById,
                description: data.description,
                createdDate: data.createdDate,
                approvedDate: data.approvedDate,
                startDate: data.startDate,
                endDate: data.endDate,
                numberOfDays: data.numberOfDays,
                canceled: data.canceled,
                archived: false,
                disabled: false,
                loading: false 
            })
        }
    }
}

export default ViewRequest;