import React, { Component } from 'react';
import { Table, Button, Row } from 'reactstrap';
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
          addUser: false
      };
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
            <th>Email</th>
            <th>Created</th>
            <th>Supervisor</th>
            <th>Number Of Days Off</th>
            <th>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={ user.id }>
              <td>{ user.name }</td>
<<<<<<< HEAD
              <td>{ user.email }</td>
              <td>{ Moment(user.userCreated).format('LL') }</td>
              <td>{ user.email }</td>
              <td>{ Moment(user.userCreated).format('LL') }</td>
              <td>
                <Button type="checkbox" checked={ user.disabled }></Button>
              </td>
              <td>
                <Button>Edit</Button>
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
          <Col>
            <Link to="/AddUser" className="btn btn-secondary">Add User</Link>
          </Col>
        </Row>
        {contents}
      </div>
    );
  }

  async populateUserData() {
    const response = await fetch('api/user');
    const data = await response.json();
    console.log(data)
    if (data.length > 0) {
        this.setState({ users: data, loading: false });
    }
  }
}
