import React, { Component } from 'react';
import { Input, Form, Button, FormGroup, Label, Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

export class Login extends Component {
  static displayName = Login.name;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', user: null, users: [] }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }

    console.log(requestOptions)

    fetch('/api/Authentication', requestOptions)
      .then(response => response.json())
      .then(data => localStorage.setItem('user', JSON.stringify(data)))
      .catch((e) => {
        console.log(e.message)
      })
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  render() {
    return (
      <div style={{ padding: '60px 0' }}>
        <Card style={ {margin: '0 auto', maxWidth: '320px', marginBottom: '30px' }}>
          <CardImg
            alt="Card image cap"
            src='./images/login_image.jpeg'
            top
            width="100%"
          />
          <CardBody>
            <CardTitle tag="h5">
              Login
            </CardTitle>
            <CardSubtitle
              className="mb-2 text-muted"
              tag="h6"
            >
              Login to manage your time off.
            </CardSubtitle>
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
          </CardBody>
        </Card>`
      </div>
      )
  }
}
