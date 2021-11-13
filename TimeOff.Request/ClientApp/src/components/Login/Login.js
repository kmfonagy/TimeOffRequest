import React, { Component } from 'react';
import { Input, Form, Button, FormGroup, Label } from 'reactstrap';

export class Login extends Component {
  static displayName = Login.name;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', user: null }
  }

  handleSubmit = () => {
    let user = {
      id: 2,
      email: this.state.email
    }

    localStorage.setItem('user', JSON.stringify(user))
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  render() {
    return (
      <div style={{ padding: '60px 0' }}>
        <h2 style={ {margin: '0 auto', maxWidth: '320px', marginBottom: '30px' }} >Login</h2>
        <Form onSubmit={ this.handleSubmit } style={ {margin: '0 auto', maxWidth: '320px'} }>
          <FormGroup size="lg" >
            <Label>Email</Label>
            <Input
              autoFocus
              type="email"
              value={ this.state.email }
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </FormGroup>
          <FormGroup size="lg" >
            <Label>Password</Label>
            <Input
              type="password"
              value={ this.state.password }
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </FormGroup>
          <Button block size="lg" type="submit" disabled={ !this.validateForm() }>
            Login
          </Button>
        </Form>
      </div>
      )
  }
}