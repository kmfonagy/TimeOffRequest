import React, { Component } from 'react';
import { Table, Button, Row, Input } from 'reactstrap';
import Moment from 'moment';
import Col from 'reactstrap/lib/Col';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

export class Users extends Component {
  static displayName = Users.name;

  constructor(props) {
    super(props);
      this.state = {
          users: [],
          loading: true,
          user: {},
          addUser: false,
          currentUser: null
      };
  }

  componentDidMount() {
    this.populateUserData();
    this.setState({ currentUser: JSON.parse(localStorage.getItem('user')).email },
      () => {
        console.log(this.state.currentUser)
      })
  }

  static renderUsersTable(users) {
    return (
      <Table dark hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Supervisor</th>
            <th>Days Remaining</th>
            <th>Role</th>
            <th>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={ user.id }>
              <td>{ user.id }</td>
              <td>{ user.name }</td>
              <td>{ user.email }</td>
              <td>{ Moment(user.userCreated).format('LL') }</td>
              <td>{ user.supervisor === null ? 'No Supervisor' : user.supervisor.name }</td>
              <td>{ user.numberOfDaysOff }</td>
              <td>{ user.roles }</td>
              <td className="text-center">
                <Input type="checkbox" checked={ user.disabled } readOnly></Input>
              </td>
              <td>
                {
                  user.email === JSON.parse(localStorage.getItem('user')).email ?
                  null :
                  <Link to={{ pathname: '/AddUser', state: { type: 'Edit', user: user }}} className="btn btn-secondary">
                    Edit
                  </Link>
                }
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Users.renderUsersTable(this.state.users);

    return (
      <div>
        <Row>
          <Col>
            <h1 id="tabelLabel" >All Users</h1>
          </Col>
          <Col className="text-right">
            <Link to={{ pathname: '/AddUser', state: { type: 'Add' }}} className="btn btn-secondary" >Add User</Link>
          </Col>
        </Row>
        {contents}
      </div>
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
