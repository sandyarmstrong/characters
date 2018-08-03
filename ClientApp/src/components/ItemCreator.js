//@ts-check
import React, { Component } from 'react';
import {BuffType, CombatType, ItemType } from '../types';

export class BuffTypeSelect extends Component {
  onChange(e) {
    this.props.onChange(e.target.value == "None" ? null : e.target.value);
  }

  render() {
    return (
      <select
        onChange={e => this.onChange(e)}>
        <option
          selected={!this.props.value}
          value="None">None
        </option>
        {BuffType.map(type =>
          <option
            selected={this.props.value == type}
            key={type}
            value={type}>
            {type}
          </option>
        )}
      </select>
    );
  }
}

export class ItemCreator extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      combatType: this.props.isWeapon ? CombatType[0] : null,
      type: this.props.isWeapon ? "Weapon" : ItemType[0],
      name: "",
      buffType: null,
      modifier: 0,
    };
  }

  onBuffTypeChange(buffType) {
    this.setState({ buffType: buffType });
  }

  onNameChange(e) {
    this.setState({ name: e.target.value })
  }

  onCombatTypeChange(e) {
    this.setState({ combatType: e.target.value })
  }

  onTypeChanged(e) {
    this.setState({ type: e.target.value })
  }

  onModifierChange(e) {
    this.setState({ modifier: e.target.value })
  }

  onSubmit(e) {
    this.props.onSubmit({
      combatType: this.state.combatType,
      type: this.state.type,
      name: this.state.name,
      modifiers: (this.state.buffType && (this.state.modifier != 0)) ? [
        {
          type: this.state.buffType,
          modifier: this.state.modifier,
        }
      ] : [],
    });

    this.setState(this.getInitialState());
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.onSubmit(e)}>
        { this.props.isWeapon ?
          <select onChange={e => this.onCombatTypeChange(e)}>
            {CombatType.map(type =>
              <option
                selected={this.state.combatType == type}
                key={type}
                value={type}>
                {type}
              </option>
            )}
          </select> :
          <select onChange={e => this.onTypeChanged(e)}>
            {ItemType.map(type =>
              <option
                selected={this.state.type == type}
                key={type}
                value={type}>
                {type}
              </option>
            )}
          </select> 
          }
          <input
            type="text"
            value={this.state.name}
            onChange={e => this.onNameChange(e)}
            placeholder="name"/>
          <BuffTypeSelect
            value={this.state.buffType}
            onChange={e => this.onBuffTypeChange(e)}/>
          <input
            type="number"
            value={this.state.modifier}
            onChange={e => this.onModifierChange(e)}
            placeholder="modifier"
            disabled={!this.state.buffType}/>
          <input
            type="submit"
            value={"Create New " + (this.props.isWeapon ? "Weapon" : "Item")}/>
        </form>
      </div>
    );
  }
}