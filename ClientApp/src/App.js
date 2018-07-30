//@ts-check
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Character } from './components/Character';
import { Admin } from './components/Admin';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' render={() => <Redirect to="/admin"/>} />
        <Route path='/admin' component={Admin} />
        <Route path='/character/:id' component={Character} />
      </Layout>
    );
  }
}
