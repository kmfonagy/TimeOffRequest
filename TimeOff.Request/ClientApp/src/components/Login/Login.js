import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Input, Form, Button, FormGroup, Label, Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

export class Login extends Component {
  static displayName = Login.name;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', user: null, users: [], redirect: false, error: false }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit() {
    this.setState({ error: false })

    const response = await fetch('https://localhost:5001/api/user/')
    const data = await response.json()
    console.log(data)
    let user = data.filter(user => user.email === this.state.email && !user.disabled)
    
    if (user[0].id > 0) {
      localStorage.setItem('user', JSON.stringify(user[0]))
      this.setState({ redirect: true })
    } else {
      this.setState({ error: true })
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }

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
              <p className="text-danger">{ this.state.error ? 'Login or Password are incorect.' : null }</p>
            </Form>
          </CardBody>
        </Card>
      </div>
      )
  }
}
