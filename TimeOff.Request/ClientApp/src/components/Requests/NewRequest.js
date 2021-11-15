import React, { Component } from 'react';
import { 
<<<<<<< HEAD
    Button, Form, FormGroup, Label, Input, Col, Row, FormText
=======
    Button, Form, FormGroup, Label, Input, Col, FormText
>>>>>>> Release_2021_11_19
}  from 'reactstrap';
import Moment from 'moment';

const submitRequest = async values => {
    const url = '/api/Request';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...values
        })
    });
    return resp.json();
}

const updateUser = async values => {
<<<<<<< HEAD
    const url = '/api/User/' + values.id;
=======
    const url = '/api/User/' + values.user.id;
>>>>>>> Release_2021_11_19
    const resp = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...values
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
            available: 0,
<<<<<<< HEAD
=======
            redirect: false,
>>>>>>> Release_2021_11_19
            lastReq: 0
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.populateRequestDate();
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
        if (this.state.startDate !== null || this.state.endDate !== null 
            || this.state.description !== null) {
            event.preventDefault();
<<<<<<< HEAD
            const req = this.createNewRequest()
            const user = this.updateUserDays()
            
            await updateUser(user)
            await submitRequest(req).then((response) => {
                if (response.id > this.state.lastReq) {
                    this.props.onNewRequest()
=======
            await updateUser(this.state);
            await submitRequest(this.state).then(response => {
                if (response.id > this.state.lastReq) {
                    this.CheckPass()
>>>>>>> Release_2021_11_19
                } else {
                    return this.setState({ error: 'Unable to submit request.' })
                }
            })
<<<<<<< HEAD
=======
            

>>>>>>> Release_2021_11_19
        } else {
            return this.setState({ error: 'Not all required fields entered.' });
        }
    }

<<<<<<< HEAD
    createNewRequest() {
        const req = {
            id: 0,
            createdById: this.state.user.id,
            approvedById: null,
            description: this.state.description,
            createdDate: Moment(new Date()).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS),
            approvedDate: Moment(new Date()).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS),
            startDate: Moment(this.state.startDate).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS),
            endDate: Moment(this.state.endDate).format(Moment.HTML5_FMT.DATETIME_LOCAL_MS),
            numberOfDays: this.state.numberOfDays,
            canceled: false,
            disabled: false,
            archived: false
        }

        return req
    }

    updateUserDays() {
        const user = {
            ...this.state.user,
            numberOfDaysOff: this.state.available
        }

        return user
=======
    CheckPass() {
        console.log('CheckPass true')
        this.props.onNewRequest()
>>>>>>> Release_2021_11_19
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

    render() {
        // if (this.state.redirect) {
        //     return <Redirect to="/history" />
        // }
        return (
            <Form className='ml-1 mt-3'  onSubmit={this.handleSubmit}>
                {
                    this.state.error &&
<<<<<<< HEAD
                    <h6
                        className='mt-2'
                        style={{color: 'red'}}
                    >{this.state.error}</h6>
=======
                    <FormText
                        invalid
                    >{this.state.error}</FormText>
>>>>>>> Release_2021_11_19
                }
                <FormGroup>
                    <Row>
                        <h4 className="ml-3 mb-3">Submit a New Request</h4>
                    </Row>
                    <Row>
                        <Col>
                            <Label for='startDate'>Start Date:</Label>
                            <Input 
                                style={{textAlign: 'center'}}
                                type='date'
                                name='startDate'
                                id='startDate'
                                onChange={ this.handleChange }
                            />
                        </Col>
                        <Col>
                            <Label for='endDate'>End Date:</Label>
                            <Input 
                                style={{textAlign: 'center'}}
                                type='date'
                                name='endDate'
                                id='endDate'
                                onChange={ this.handleChange }
                            />
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Row>
                        <Col>
                            <Label for='availableDays' style={{width: 160}}>
                                Available Days: {this.state.user.numberOfDaysOff}
                            </Label>
                        </Col>
                        <Col>
                            <Label for='numberOfDays' style={{width: 160}}>
                                Number of Days: {this.state.numberOfDays}
                            </Label>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Label for='description'>
                        Description:
                    </Label>
                    <Input
                        type='textarea'
                        name='description'
                        id='description'
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Button
                        id='submit'
                        type='submit'
                    >Submit</Button>
                </FormGroup>
            </Form>
        )
    }

    async populateRequestDate() {
<<<<<<< HEAD
        const userId = JSON.parse(localStorage.getItem('user')).id
        const response1 = await fetch('api/User/' + userId);
        const data1 = await response1.json();
        const response2 = await fetch('api/Request/')
        const data2 = await response2.json()
        
        if (data1 !== null && data2 !== null) {
            this.setState({
                user: data1,
                loading: false,
                lastReq: data2.length
=======
        const response = await fetch('api/User/' + JSON.parse(localStorage.getItem('user')).id);
        const data = await response.json();
        const userRequests = await fetch('api/Request/CreatedBy/' + 1)
        const requests = await userRequests.json()
        if (data !== null) {
            this.setState({
                user: data,
                loading: false,
                lastReq: requests[requests.length - 1].id
>>>>>>> Release_2021_11_19
            })
        }
    }
}

export default NewRequest;