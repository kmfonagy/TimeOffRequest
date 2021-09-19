import React, { Component } from 'react';
import { Table } from 'reactstrap'

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
      <Table className='table table-striped' aria-labelledby="tabelLabel" dark>
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
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.userCreated}</td>
              <td>{user.supervisor ? user.supervisor.name : 'none'}</td>
              <td>{user.disabled}</td>
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
        <h1 id="tabelLabel" >Users</h1>
        <p>All users</p>
        {contents}
      </div>
    );
  }

  async populateUserData() {
    const response = await fetch('user');
    const data = await response.json();
    if (data.length > 0) {
        this.setState({ users: data, loading: false });
        console.log(this.users)
    }
  }
}
