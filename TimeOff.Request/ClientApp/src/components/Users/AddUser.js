import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input, Row } from 'reactstrap';
import { Redirect } from 'react-router';

export class AddUser extends Component {
    static displayName = AddUser.name

    constructor(props) {
        super(props);
        this.state = {
            user: props.location.state.type === 'Add' ?
                {
                    name: '',
                    email: '',
                    supervisorId: null,
                    numberOfDaysOff: 0,
                    roles: '',
                    password: '',
                    disabled: false,
                    validSupervisor: true
                } : 
                props.location.state.user,
            users: [],
            userAdded: false,
            type: props.location.state.type
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
    }

    componentDidMount() {
        this.populateUserData()
    }

    handleChange = (e) => {
        if (e.target.name === 'disabled') {
            this.setState({ user: {...this.state.user, disabled: !this.state.user.disabled}})
        } else if (e.target.name === 'supervisorId') {
            let supervisor = this.state.users.filter(u => {
                return (u.id - e.target.value) === 0
            })[0]
            if ((this.state.user.id - e.target.value) === 0) {
                this.setState({ validSupervisor: false })
                this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } })
            } 
            else if (supervisor != null) {
                this.setState({ validSupervisor: this.state.user.id !== supervisor.supervisorId })
                this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } })
            } else {
                this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } })
            }
        } else {
            this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } })
        }
    }

    async handleSubmit(event) {
        event.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...this.state.user, 
                supervisorId: parseInt(this.state.user.supervisorId),
                numberOfDaysOff: parseFloat(this.state.user.numberOfDaysOff)
            })
        };

        const response = await fetch('https://Localhost:5001/api/user', requestOptions);
        if (response.ok) {
            this.setState({ userAdded: true })
        }
    }

    async handleEdit(event) {
        event.preventDefault()

        console.log(this.state.user)

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...this.state.user, 
                supervisorId: parseInt(this.state.user.supervisorId),
                numberOfDaysOff: parseFloat(this.state.user.numberOfDaysOff)
            })
        };

        const response = await fetch('https://Localhost:5001/api/user/' + this.state.user.id, requestOptions);
        if (response.ok) {
            this.setState({ userAdded: true })
        }
    }

    handleCancel(event) {
        this.setState({ userAdded: true })
    }

    render() {

        if (this.state.userAdded) {
            return <Redirect to= "/users" />
        }

        return (
            <Form>
                <h1>{ this.state.type } User</h1>
                <FormGroup row>
                    <Label for="name" sm={2}>Name</Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            onChange={ this.handleChange }
                            placeholder="Name"
                            value={ this.state.user.name } />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="email" sm={2}>Email</Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="email"
                            id="email"
                            onChange={ this.handleChange }
                            placeholder="Email address"
                            value={ this.state.user.email } />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="password" sm={2}>Password</Label>
                    <Col sm={10}>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            onChange={ this.handleChange }
                            placeholder="Password"
                            value={ this.state.user.password } />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="supervisorId" sm={2}>Supervisor</Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            value={ this.state.user.supervisorId === null ? 'Select Supervisor' : this.state.user.supervisorId }
                            name="supervisorId"
                            id="supervisorId"
                            invalid={ !this.state.validSupervisor }
                            onChange={ this.handleChange }>
                            <option>Select Supervisor</option>
                            { this.state.users.map((user) =>
                                <option value={ user.id } key={ user.id } > { user.name } </option>
                            )}
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
                            value={ this.state.user.numberOfDaysOff }
                            onChange={this.handleChange}
                            placeholder="Number of days off" />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="role" sm={2}>Role</Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            value={ this.state.user.roles === null ? 'Select Role' : this.state.user.roles }
                            name="roles"
                            id="roles"
                            onChange={ this.handleChange }>
                            <option>Select Role</option>
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
                                    defaultChecked={ this.state.user.disabled }
                                    onClick={this.handleChange}
                                    name="disabled" />
                                Disabled
                            </Label>
                        </FormGroup>
                    </Col>
                </FormGroup>

                <FormGroup check row>
                    <Row className="m-auto">
                        <Col>
                            <Button onClick={ this.state.type === 'Edit' ? this.handleEdit : this.handleSubmit } disabled={ !this.state.validSupervisor } className="m-1">{ this.state.type === 'Edit' ? 'Update User' : 'Submit'}</Button>
                            <Button onClick={ this.handleCancel } className="m-1">Cancel</Button>
                        </Col>
                    </Row>
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