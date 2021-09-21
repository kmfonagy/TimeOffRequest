import React, { Component } from 'react';
import { Table, Button, Row } from 'reactstrap';
import Moment from 'moment';
import AddUser from './AddUser';
import Col from 'reactstrap/lib/Col';

export class Users extends Component {
  static displayName = Users.name;

  constructor(props) {
    super(props);
    this.state = { users: [], loading: true, user: { }, addUser: false };
  }

  componentDidMount() {
    this.populateUserData();
  }

  static renderUsersTable(users) {
    return (
      <Table dark hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Supervisor</th>
            <th>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={ user.id }>
              <td>{ user.name }</td>
              <td>{ Moment(user.userCreated).format('LL') }</td>
              <td>{ user.supervisor ? user.supervisor.name : 'none' }</td>
              <td>
                <Button type="checkbox" value={ user.disabled }></Button>
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
            <h1 id="tabelLabel" >Users</h1>
          </Col>
          <Col>
            <h1 id="tabelLabel" >Add User</h1>
          </Col>
        </Row>
        <p>All users</p>
        {contents}
      </div>
    );
  }

  async populateUserData() {
    const response = await fetch('user');
    const data = await response.json();
    console.log(data)
    if (data.length > 0) {
        this.setState({ users: data, loading: false });
    }
  }
}
