import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import './Layout.css';

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
      <div>
        <NavMenu />
        <div className="main-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}
