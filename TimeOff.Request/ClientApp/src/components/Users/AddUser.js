import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router';

export class AddUser extends Component {
    static displayName = AddUser.name

    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                email: '',
                supervisorId: null,
                numberOfDaysOff: 0,
                role: '',
                password: '',
                disabled: false
            },

            users: [],
            userAdded: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidMount() {
        this.populateUserData()
    }

    handleChange = (e) => {
        this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } })
    }

    handleInputChange = (e) => {
        this.setState({ user: { ...this.state.user, [e.target.name]: parseFloat(e.target.value) } });
    }

    async handleSubmit(event) {
        event.preventDefault()

        console.log(this.state)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...this.state.user, supervisorId: parseInt(this.state.user.supervisorId) })
        };

        const response = await fetch('https://Localhost:5001/api/user', requestOptions);
        if (response.ok) {
            this.setState({ userAdded: true })
        }
    }

    render() {

        if (this.state.userAdded) {
            return <Redirect to= "/users" />
        }

        return (
            <Form>
                <FormGroup row>
                    <Label for="name" sm={2}>Name</Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            onChange={this.handleChange}
                            placeholder="Name" />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="email" sm={2}>Email</Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="email"
                            id="email"
                            onChange={this.handleChange}
                            placeholder="Email address" />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="password" sm={2}>Password</Label>
                    <Col sm={10}>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            onChange={this.handleChange}
                            placeholder="Password" />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="supervisorId" sm={2}>Select Supervisor</Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            name="supervisorId"
                            id="supervisorId"
                            onChange={this.handleChange}>
                            {this.state.users.map((user) =>
                                <option value={ user.id } key={ user.id } > { user.name } </option>
                            ) }
                        </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="numberOfDaysOff" sm={2}>Number Of Days Off</Label>
                    <Col sm={10}>
                        <Input
                            type="number"
                            name="numberOfDaysOff"
                            id="numberOfDaysOff"
                            value={this.numberofdaysoff}
                            onChange={this.handleInputChange}
                            placeholder="Number of days off" />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="role" sm={2}>Select Role</Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            name="role"
                            id="role"
                            onChange={this.handleChange}>
                            <option>User</option>
                            <option>Administrator</option>
                        </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col sm={{ size: 10 }}>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    id="disabled"
                                    onChange={this.handleChange}
                                    name="disabled" />{' '}
                                Disabled
                            </Label>
                        </FormGroup>
                    </Col>
                </FormGroup>

                <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }

    async populateUserData() {
        const response = await fetch('api/user');
        const data = await response.json();
        if (data.length > 0) {
            this.setState({ users: data, loading: false });
        }
    }
}