//@ts-check
import React, { Component } from 'react';
import './AbilityButton.css'

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
        <div className="ability-label">{this.props.ability}</div>
        <div className="ability-total">{this.props.total}</div>
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