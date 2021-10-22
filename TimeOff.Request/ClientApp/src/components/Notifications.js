import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'reactstrap';


export class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = { notifications: [], loading: true, user: {}, readNotification: false };
    }

    componentDidMount() {
        this.populateNotificationData();
        console.log("Notification Component Mounted");
    }

    static handleClick(notification) {
        if (!notification.yeet) {
            notification.yeet = true;
            alert("Marked read.")
        } else {
            notification.yet = false;
            alert("Marked unread.")
        }
    }


    static renderNotificationTable(notifications) {
        return (
            <Table dark hover striped>
                <thead>
                    <tr>
                        <th>Request Id</th>
                        <th>User</th>
                        <th>Notification Description</th>
                        <th>Mark Read</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map(notification =>
                        <tr key={notification.id}>
                            <td>{notification.requestId}</td>
                            <td>{notification.notifyUser.name}</td>
                            <td>{notification.description}</td>
                            <td>
                                <Button onClick={() => Notifications.handleClick(notification)} type="checkbox" value={notification.read}></Button>
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
            : Notifications.renderNotificationTable(this.state.notifications);

        return (
            <div>
                <Row>
                    <Col>
                        <h1 id="tableLabel">Request</h1>
                    </Col>
                    <h1 id="tableLabel">Description</h1>
                    <Col>
                    </Col>
                </Row>
                <p>All Notifications</p>
                {contents}
            </div>
        );
    }

    async populateNotificationData() {
        const response = await fetch('api/notification');
        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
            this.setState({ notifications: data, loading: false });
        }
    }
}