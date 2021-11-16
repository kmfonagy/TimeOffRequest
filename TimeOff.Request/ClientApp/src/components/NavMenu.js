import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      newNotifications: [],
      currentUser: null,
      userIsSupervisor: false
    };
  }

  componentDidMount() {
    this.loadNotifications()
    this.userIsSupervisor()
    this.setState({ currentUser: JSON.parse(localStorage.getItem('user')) })
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  logout = () => {
    localStorage.removeItem('user')
    localStorage.clear()
    window.location.reload()
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">TimeOff.Request</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                {
                  JSON.parse(localStorage.getItem('user')).roles === 'Administrator' ?
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/users">Users</NavLink>
                  </NavItem>
                  : null
                }
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/history">Requests</NavLink>
                </NavItem>
                {
                  this.state.userIsSupervisor ?
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/review-requests">Review Requests</NavLink>
                  </NavItem>
                  : null
                }
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/notifications">Notifications <Badge color="danger">{ this.state.newNotifications.length > 0 ? this.state.newNotifications.length : null }</Badge></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/" onClick={ this.logout }>Logout</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }

  async loadNotifications() {
    const response = await fetch('/api/Notification/Unread?userId=' + JSON.parse(localStorage.getItem('user')).id)
    const data = await response.json()
    this.setState({ newNotifications: data })
  }

  async userIsSupervisor() {
    const response = await fetch('/api/User/Supervisor/' + JSON.parse(localStorage.getItem('user')).id)
    const data = await response.json()
    this.setState({ userIsSupervisor: data.length > 0 })
  }
}
