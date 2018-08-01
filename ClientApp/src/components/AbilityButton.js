//@ts-check
import React, { Component } from 'react';
import './AbilityButton.css'

export class Stat extends Component {
  render() {
    return (
      <div className="stat">
        <div className="stat-label">{this.props.stat}</div>
        <div className="stat-total">{this.props.total}</div>
      </div>
    );
  }
}

export class StatCard extends Component {
  render() {
    return (
      <div className="stat-card">
        <Stat
          stat={this.props.stat}
          total={this.props.total}/>
      </div>
    );
  }
}

export class AbilityButton extends Component {
  render() {
    var cName = "ability";
    if (!this.props.canEdit)
      cName += " read-only";

    return (
      <div className={cName}>
        { this.props.canEdit ?
          <button
            disabled={!this.props.canIncrease}
            onClick={_ => this.props.onChange(1)}
            className="button-plus">
            +
          </button> :
          "" }
        <Stat
          stat={this.props.ability}
          total={this.props.total}/>
        { this.props.canEdit ?
          <div className="ability-mod">+{this.props.mod}</div> :
          "" }  
        { this.props.canEdit ?
          <button
            disabled={this.props.mod == 0}
            onClick={_ => this.props.onChange(-1)}
            className="button-minus">
            -
          </button> :
          "" }
      </div>
    );
  }
}