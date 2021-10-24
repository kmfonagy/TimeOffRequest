import React, { Component } from 'react';
import { 
    Button, Form, FormGroup, Label, Input, Col
}  from 'reactstrap';
import Moment from 'moment';

const submitRequest = async values => {
    console.log("Submit Request")
    console.log(values);
    const url = '/api/Request';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            createdById: values.user.id,
            description: values.description,
            createdDate: new Date(),
            approvedDate: new Date(),
            startDate: values.startDate,
            endDate: values.endDate,
            numberOfDays: values.numberOfDays,
            canceled: false,
            disabled: false,
            archived: false
        })
    });
    return resp.json();
}

const updateUser = async values => {
    console.log("Update User")
    console.log(values);
    const url = '/api/User/' + values.user.id;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: values.user.id,
            name: values.user.name,
            email: values.user.email,
            dateCreated: values.user.dateCreated,
            supervisorId: values.user.supervisorId,
            numberOfDaysOff: values.available,
            roles: values.user.roles,
            passwordResetToken: values.user.passwordResetToken,
            requiresPasswordReset: values.user.requiresPasswordReset,
            lastLogin: values.user.lastLogin,
            disabled: values.user.disabled
        })
    });
    return resp.json();
}

export class NewRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: null,
            startDate: null,
            endDate: null,
            numberOfDays: 0,
            user: [],
            error: '',
            loading: true,
            available: 0
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.populateRequestDate();
        console.log("Component did mount");
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            this.dateCalc()
        })
    }

    // Function to submit updated state to POST functions
    async handleSubmit(event) {
        if (this.state.startDate !== null || this.state.endDate !== null || this.state.description !== null) {
            console.log(this.state)
            event.preventDefault();
            await submitRequest(this.state);
            await updateUser(this.state);
        } else {
            return this.setState({ error: 'Not all required fields entered.' });
        }
    }

    dateCalc = () => {
        if (this.state.startDate !== null &&
            this.state.endDate !== null) {
            
            let end = Moment(this.state.endDate).format('YYYY-MM-DD');
            let start = Moment(this.state.startDate).format('YYYY-MM-DD');
            let time = Moment(end).diff(start);
            let days = time / (1000 * 60 * 60 * 24);
            let available = this.state.user.numberOfDaysOff - days;
            if (available >= 0) {
                return this.setState({
                    numberOfDays: days,
                    available: available,
                    error: ''
                }, () => {this.setState({
                    loading: false
                })})
            } else {
                return this.setState({ error: 'Insufficient Available Days Off' });
            }
        }
    }

    renderAvailableDays(days) {
        return (
            `${days}`
        )
    }

    render() {
        return (
            <Form className='mt-2'>
                {
                    this.state.error &&
                    <div
                        className='LoginError'
                        color='danger'
                    >{this.state.error}</div>
                }
                <FormGroup row>
                    <Label for='startDate' sm={6}>Start Date:</Label>
                    <Col sm={10}>
                        <Input 
                            type='date'
                            name='startDate'
                            id='startDate'
                            onChange={ this.handleChange }
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='endDate' sm={6}>End Date:</Label>
                    <Col sm={10}>
                        <Input 
                            type='date'
                            name='endDate'
                            id='endDate'
                            onChange={ this.handleChange }
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='numberOfDays' sm={12}>
                        Number of Days: {this.state.loading ? <em>Loading...</em> : this.renderAvailableDays(this.state.numberOfDays)}
                    </Label>
                </FormGroup>
                <FormGroup row>
                    <Label for='description' sm={12}>
                        Description:
                    </Label>
                    <Col sm={12}>
                        <Input 
                            type='textarea'
                            name='description'
                            id='description'
                            onChange={ this.handleChange }
                        />
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={10}>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }

    async populateRequestDate() {
        const response = await fetch('api/User/' + 1);
        const data = await response.json();
        if (data !== null) {
            this.setState({
                user: data,
                loading: false
            }, () => {console.log(this.state.user)})
        }
    }
}

export default NewRequest;