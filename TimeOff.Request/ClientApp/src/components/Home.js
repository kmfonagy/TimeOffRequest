import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import Spinner from 'reactstrap/lib/Spinner';

export class Home extends Component {
  static displayName = Home.name

  constructor(props) {
    super(props);
      this.state = {
          u: null,
          user: null,
          loading: true
      }
  }

  componentDidMount() {
    let u = JSON.parse(localStorage.getItem('user'))
    this.loadUser(u.id)
  }

  render () {
    if (this.state.loading) {
      return (
        <div style={{ padding: '30px 0' }} className='text-center'>
          <Spinner size='lg' style={{ padding: '30px' }}>Loading...</Spinner>
        </div>
      )
    }

    return (
      <div>
        <Row>
          <Col>
            <p>Name: { this.state.user.name }</p>
            <p>Email: { this.state.user.email }</p>
            <p>Days Remaining: { this.state.user.numberOfDaysOff }</p>
          </Col>
          <Col>
            <p>Supervisor: { this.state.user.supervisor.name }</p>
            <p>Supervisor Email: { this.state.user.supervisor.email }</p>
          </Col>
        </Row>
      </div>
    )
  }

  async loadUser(id) {
    this.setState({ loading: true })
    const response = await fetch('api/user/' + id)
    const data = await response.json()
    this.setState({ user: data, loading: false })
  }
}
