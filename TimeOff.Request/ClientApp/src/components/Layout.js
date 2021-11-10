import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Login } from './Login/Login'

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    let user = localStorage.getItem('user')

    if (user === null) {
      return (
        <div>
          <Login />
        </div>
      )
    } else {
      return (
        <div>
          <NavMenu />
          <Container>
            {this.props.children}
          </Container>
        </div>
      );
    }
  }
}
