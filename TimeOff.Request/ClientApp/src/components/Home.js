import React, { Component } from 'react'
import { Row, Col, Table, Input } from 'reactstrap'
import Spinner from 'reactstrap/lib/Spinner'
import Moment from 'moment'
import { Link } from 'react-router-dom'
import moment from 'moment'

export class Home extends Component {
  static displayName = Home.name

  constructor(props) {
    super(props);
      this.state = {
          u: null,
          user: null,
          loading: true,
          userRequests: [],
          completedRequests: [],
          userOutOfOffice: [],
          isSupervisor: false
      }
  }

  approvalStatus(req) {
    let status = null
    if (req.approvedById !== null) {
        status = 'Approved'
    } else if (req.canceled === true) {
        status = 'Denied'
    } else {
        status = 'Awaiting Approval'
    }
    return status;
  }

  componentDidMount() {
    let u = JSON.parse(localStorage.getItem('user'))
    this.loadUser(u.id)
    this.loadUserRequests(u.id)
    this.loadCompletedUserRequests(u.id)
    this.loadEmployeesOutOfOffice(u.id)
  }

  static renderLatestCreatedTable(userRequests) {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>Request Number</th>
            <th>Created Date</th>
            <th>Approved</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days</th>
            <th>Disabled</th>
          </tr>
        </thead>

        <tbody>
          { userRequests.filter(r => r.archived === false).map(req =>
            <tr key={req.id}>
              <td style={{ textAlign: 'center' }}>
                <Link
                  id='request-link'
                  to={`/request/${req.id}`}
                  style={{color: 'inherit'}}
                >{req.id}</Link>
              </td>
              <td>{Moment(req.createdDate).format('LL')}</td>
              {req.approvedById !== null
              ? (<td>Approved</td>)
              : req.canceled
              ? (<td>Denied</td>)
              : (<td>Awaiting Approval</td>)}
              <td>{Moment(req.startDate).format('LL')}</td>
              <td>{Moment(req.endDate).format('LL')}</td>
              <td style={{ textAlign: 'center' }}>{req.numberOfDays}</td>
              <td>
                <Input type="checkbox" checked={req.disabled} readOnly style={{ marginLeft: '2%' }}></Input>
              </td>
            </tr>
          )}
        </tbody>
    </Table>
    );
  }

  static renderLastCompletedTable(userRequests) {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>Request Number</th>
            <th>Created Date</th>
            <th>Approved</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days</th>
            <th>Disabled</th>
          </tr>
        </thead>

        <tbody>
          { userRequests.filter(r => r.archived === false).map(req =>
            <tr key={req.id}>
              <td style={{ textAlign: 'center' }}>
                <Link
                  id='request-link'
                  to={`/request/${req.id}`}
                  style={{color: 'inherit'}}
                >{req.id}</Link>
              </td>
              <td>{Moment(req.createdDate).format('LL')}</td>
              {req.approvedById !== null
                ? (<td>Approved</td>)
                : req.canceled
                  ? (<td>Denied</td>)
                  : (<td>Awaiting Approval</td>)}
              <td>{Moment(req.startDate).format('LL')}</td>
              <td>{Moment(req.endDate).format('LL')}</td>
              <td style={{ textAlign: 'center' }}>{req.numberOfDays}</td>
              <td>
                <Input type="checkbox" checked={req.disabled} readOnly style={{ marginLeft: '2%' }}></Input>
              </td>
            </tr>
          )}
        </tbody>
    </Table>
    );
  }

  static renderOutOfOffice(usersRequests) {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>Request Number</th>
            <th>Employee</th>
            <th>Approved</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days</th>
            <th>Disabled</th>
          </tr>
        </thead>

        <tbody>
          { usersRequests.filter(r => r.archived === false).map(req =>
            <tr key={req.id}>
              <td style={{ textAlign: 'center' }}>
                <Link
                  id='request-link'
                  to={`/request/${req.id}`}
                  style={{color: 'inherit'}}
                >{req.id}</Link>
              </td>
              <td>{ req.createdBy.name }</td>
              {req.approvedById !== null
                ? (<td>Approved</td>)
                : req.canceled
                  ? (<td>Denied</td>)
                  : (<td>Awaiting Approval</td>)}
              <td>{Moment(req.startDate).format('LL')}</td>
              <td>{Moment(req.endDate).format('LL')}</td>
              <td style={{ textAlign: 'center' }}>{req.numberOfDays}</td>
              <td>
                <Input type="checkbox" checked={req.disabled} readOnly style={{ marginLeft: '2%' }}></Input>
              </td>
            </tr>
          )}
        </tbody>
    </Table>
    );
  }

  render () {
    if (this.state.loading) {
      return (
        <div style={{ padding: '30px 0' }} className='text-center'>
          <Spinner size='lg' style={{ padding: '30px' }}>Loading...</Spinner>
        </div>
      )
    }

    let latestCreated = this.state.loading
      ? <p><em>Loading...</em></p>
      : Home.renderLatestCreatedTable(this.state.userRequests);

    let lastCompleted = this.state.loading
      ? <p><em>Loading...</em></p>
      : Home.renderLastCompletedTable(this.state.completedRequests);

      let employeesOutOfOffice = this.state.loading
        ? <p><em>Loading...</em></p>
        : Home.renderOutOfOffice(this.state.userOutOfOffice);

    return (
      <div>
        <Row className="mb-3">
          <Col>
            <p>Name: { this.state.user.name }</p>
            <p>Email: { this.state.user.email }</p>
            <p>Days Remaining: { this.state.user.numberOfDaysOff }</p>
          </Col>
          <Col>
            <p>Supervisor: { this.state.user.supervisor === null ? 'No supervisor' :  this.state.user.supervisor.name }</p>
            <p>Supervisor Email: { this.state.user.supervisor === null ? 'No supervisor' :  this.state.user.supervisor.email }</p>
          </Col>
        </Row>
        <Row>
          <h5>Recent Requests</h5>
          { latestCreated }
        </Row>
        <Row>
          <h5>Recently Completed</h5>
          { lastCompleted }
        </Row>
        {
          this.state.isSupervisor ?
          <Row>
            <h5>Employees Out Of Office</h5>
            { employeesOutOfOffice }
          </Row>
          : null
        }
      </div>
    )
  }

  async loadUser(id) {
    this.setState({ loading: true })
    const response = await fetch('api/user/' + id)
    const data = await response.json()
    this.setState({ user: data, loading: false })
  }

  async loadUserRequests(id) {
    this.setState({ loading: true })
    const response = await fetch('api/request/createdBy/' + id)
    const data = await response.json()
    this.setState({ userRequests: data.sort((a, b) => b.id - a.id).slice(0, 3), loading: false })
  }

  async loadCompletedUserRequests(id) {
    this.setState({ loading: true })
    const response = await fetch('api/request/createdBy/' + id)
    const data = await response.json()
    this.setState({ completedRequests: data.filter((a) => moment().diff(a.endDate, 'days') > 0).slice(0, 5), loading: false })
  }

  async loadEmployeesOutOfOffice(id) {
    this.setState({ loading: true })
    let response = await fetch('api/user/supervisor/' + id)
    const users = await response.json()
    if (response.ok && users.length > 0) {
      this.setState({ isSupervisor: true })
      response = await fetch('api/request')
      let data = await response.json()
      if (response.ok) {
        data = data.filter(r => moment().diff(r.startDate, 'days') >= 0 && moment().diff(r.endDate, 'days') <= 0)
        users.map(u => {
          let d = data.filter(r => r.createdById - u.id === 0)
          if (d.length > 0) {
            this.setState({ userOutOfOffice: this.state.userOutOfOffice.concat(d) })
          }
        })
      }
    }
  }
}
