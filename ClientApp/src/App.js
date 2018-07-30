//@ts-check
import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Character } from './components/Character';
import { Admin } from './components/Admin';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Character} />
        <Route exact path='/admin' component={Admin} />
      </Layout>
    );
  }
}
