//@ts-check
import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';

export class Admin extends Component {
  displayName = Admin.name

  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      weapons: [],
      items: [],
      loading: true};

    this.handleCharactersPromise (fetch ("api/Character/All"));
    this.handleWeaponsPromise (fetch ("api/Stash/Weapons"));
    this.handleItemsPromise (fetch ("api/Stash/Items"));
  }

  handleCharactersPromise (request) {
    request
      .then(response => response.json())
      .then(data => {
        this.setState({ characters: data, loading: false });
      });
  }

  handleWeaponsPromise (request) {
    request
      .then(response => response.json())
      .then(data => {
        this.setState({ weapons: data, loading: false });
      });
  }

  handleItemsPromise (request) {
    request
      .then(response => response.json())
      .then(data => {
        this.setState({ items: data, loading: false });
      });
  }

  resetAll() {
    this.handleCharactersPromise(fetch (
      "api/Character/Reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }));
  }

  grantLevels(ids) {
    this.handleCharactersPromise(fetch (
      "api/Character/GrantLevels",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      }));
  }

  grantClicked() {
    this.grantLevels(this.state.characters.map (character => character.id));
  }

  renderCharacterRow(character) {
    let url = "/character/" + character.id;
    return (
      <tr>
        <td><a href={url}>{character.name}</a></td>
        <td>{character.playerName}</td>
        <td>{character.level}</td>
        <td>{character.levelsAvailable}</td>
      </tr>
    );
  }

  renderWeaponRow(weapon) {
    return (
      <tr>
        <td>{weapon.type}</td>
        <td>{weapon.name}</td>
        <td>{CharacterDetails.renderBuffList([weapon.buff])}</td>
      </tr>
    );
  }

  createWeapon() {

  }

  renderItemRow(item) {
    return (
      <tr>
        <td>{item.type}</td>
        <td>{item.name}</td>
        <td>{CharacterDetails.renderBuffList(item.modifiers)}</td>
      </tr>
    );
  }

  createItem() {

  }

  render() {
    return (
      <div>
        <h1>Characters</h1>

        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Character Name</th>
              <th>Player Name</th>
              <th>Level</th>
              <th>Levels Available</th>
            </tr>
          </thead>
          <tbody>
            {this.state.characters.map(character =>
              this.renderCharacterRow(character))}
          </tbody>
        </Table>
        <Button
          onClick={() => this.resetAll()}>
          Reset All Data
        </Button>
        <Button
          onClick={() => this.grantClicked()}>
          Grant One Level To All Characters
        </Button>

        <h1>Weapons</h1>

          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Buffs</th>
              </tr>
            </thead>
            <tbody>
              {this.state.weapons.map(weapon =>
                this.renderWeaponRow(weapon))}
            </tbody>
          </Table>
          <Button
            onClick={() => this.createWeapon()}>
            Create New Weapon
          </Button>

        <h1>Items</h1>

          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Buffs</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map(item =>
                this.renderItemRow(item))}
            </tbody>
          </Table>
          <Button
            onClick={() => this.createItem()}>
            Create New Item
          </Button>
      </div>
    );
  }
}