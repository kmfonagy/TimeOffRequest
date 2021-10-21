import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Users } from './components/Users/Users';
import { Requests } from './components/Requests/Requests';
import { Login } from './components/Login/Login'

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/users' component={Users} />
        <Route path='/history' component={Requests} />
      </Layout>
    );
  }
}
