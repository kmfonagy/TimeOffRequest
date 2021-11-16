import React, { Component } from 'react';
import { Table, Button, FormGroup, Label, Input } from 'reactstrap';
import Spinner from 'reactstrap/lib/Spinner';


export class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = { notifications: [], loading: true, user: {}, readNotification: false };

        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.populateNotificationData();
    }

    async handleChange(e) {
        e.preventDefault()
        this.setState({ loading: true })

        let notification = this.state.notifications.filter(n => n.id - e.target.id === 0)[0]
        let newNotifications = this.state.notifications
        newNotifications.splice(newNotifications.indexOf(notification), 1)

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...notification, 
                read: !notification.read
            })
        };

        const response = await fetch('https://Localhost:5001/api/notification/' + notification.id, requestOptions);
        const data = await response.json();
        newNotifications = newNotifications.concat(data)
        if (response.ok) {
            this.setState({ notifications: newNotifications.sort((a, b) => a.id - b.id) }, () => {
                this.setState({ loading: false })
            })
        }

        window.location.reload()
    }


    renderNotificationTable() {
        if (this.state.loading) {
            return(
                <Spinner>Loading...</Spinner>
            )
        }

        return (
            <Table hover striped>
                <thead>
                    <tr>
                        <th>Request</th>
                        <th>User</th>
                        <th>Notification Description</th>
                        <th>Mark Read</th>
                    </tr>
                </thead>
                <tbody>
                    { this.state.notifications.map(notification =>
                        <tr key={notification.id}>
                            <td>{notification.requestId}</td>
                            <td>{notification.notifyUser.name}</td>
                            <td>{notification.description}</td>
                            <td className="m-auto">
                            <FormGroup className="mb-3 mt-0">
                                <FormGroup check>
                                    <Input
                                        type="checkbox"
                                        id={ notification.id }
                                        defaultChecked={ notification.read }
                                        onClick={ this.handleChange }
                                        name="read" />
                                </FormGroup>
                            </FormGroup>
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
            : this.renderNotificationTable();

        return (
            <div>                
                <h2>All Notifications</h2>
                {contents}
            </div>
        );
    }

    async populateNotificationData() {
        const response = await fetch('api/notification/');
        const data = await response.json();
        if (data.length > 0) {
            this.setState({ notifications: data.filter(n => n.notifyUserId === JSON.parse(localStorage.getItem('user')).id), loading: false });
        }
    }
}