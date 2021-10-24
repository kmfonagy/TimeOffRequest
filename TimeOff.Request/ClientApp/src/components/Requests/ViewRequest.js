import React, { Component } from 'react';
import {
    Input, Button, Row, Form, FormGroup, Label, Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Moment from 'moment';

const updateRequest = async values => {
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
            canceled: values.canceled,
            archived: false,
            disabled: false
        })
    })
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
        }

        this.onDescriptionChange = this.onInputChange.bind(this, 'description');
        this.onCancel = this.onInputChange.bind(this, 'canceled');
        this.onStartChange = this.onInputChange.bind(this, 'startDate');
        this.onEndChange = this.onInputChange.bind(this, 'endDate')
    }

    componentDidMount() {
        this.populateRequestData();
    }

    onInputChange(keyName, event) {
        this.setState({
            [keyName]: event.target.value
        }, () => {this.dateCalc()})
    }

    dateCalc() {
        let days = (this.state.endDate - this.state.startDate) / (1000 * 3600 * 24);
        this.setState({
            numberOfDays: days
        })
    }

    async submitRequest(event) {
        console.log(this.state);
        event.preventDefault();
        await updateRequest(this.state);
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
                                {state.approvedById !== null ? (
                                    Moment(state.approvedDate).format('LL')
                                ) : (
                                    'Awaiting Approval'
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
                            <td>Canceled</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{state.description}</td>
                            <td>
                                <Input type="checkbox" checked={state.canceled} disabled style={{ marginLeft: '2%' }}></Input>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                    {state.canceled === false ? (
                        <Form style={{width: 'auto'}} className='mt-2' onSubmit={this.submitRequest}>
                            <FormGroup>
                                <Label for='start'>New Start Date: </Label>
                                <Input 
                                    key='start'
                                    id='start'
                                    name='start'
                                    style={{width: '150px', textAlign: 'center'}}
                                    type='date'
                                    value={state.startDate}
                                    onChange={this.onStartChange}
                                />
                                <Label for='end' className='mt-2'>New End Date: </Label>
                                <Input 
                                    key='end'
                                    id='end'
                                    name='end'
                                    style={{width: '150px', textAlign: 'center'}}
                                    type='date'
                                    value={state.endDate}
                                    onChange={this.onEndChange}
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
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for='canceled'>Canceled: </Label>
                                <Input 
                                    type='checkbox'
                                    id='canceled'
                                    key='canceled'
                                    name='canceled'
                                    value={state.canceled}
                                    style={{marginLeft: '10px'}}
                                    onChange={this.onCancel}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    id='submit'
                                    type='submit'
                                >Submit</Button>
                                <Button 
                                    className='ml-2'
                                    component={Link}
                                    to='/history'
                                >Cancel</Button>
                            </FormGroup>
                        </Form>
                    ) : (<p>&nbsp;</p>)}
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