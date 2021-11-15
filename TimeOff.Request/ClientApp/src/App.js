import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Users } from './components/Users/Users';
import { AddUser } from './components/Users/AddUser';
import { Requests } from './components/Requests/Requests';
import { ViewRequest } from './components/Requests/ViewRequest';
import { ReviewRequests } from './components/Requests/ReviewRequests';
import { Login } from './components/Login/Login'
import { Notifications } from './components/Notifications';
import { ReviewRequest } from './components/Requests/ReviewRequest';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;
    
    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/counter' component={Counter} />
                <Route path='/fetch-data' component={FetchData} />
                <Route path='/login' component={Login} />
                <Route path='/users' component={Users} />
                <Route path='/history' component={Requests} />
                <Route path='/request/:id' component={ViewRequest} />
                <Route path='/notifications' component={Notifications} />
                <Route path='/review-requests' component={ReviewRequests} />
                <Route path='/review/:id' component={ReviewRequest} />
                <Route path='/adduser' component={AddUser} />
            </Layout>
        );
    }
}
