//@ts-check
import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';
import { ItemCreator } from './ItemCreator';

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
    this.handleStashPromise (fetch ("api/Stash/All"));
  }

  handleCharactersPromise (request) {
    request
      .then(response => response.json())
      .then(data => {
        this.setState({ characters: data, loading: false });
      });
  }

  handleStashPromise (request) {
    request
      .then(response => response.json())
      .then(data => {
        this.setState({
          weapons: data.filter (item => item.type == "Weapon"),
          items: data.filter (item => item.type != "Weapon"),
          loading: false });
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
    this.handleStashPromise(fetch (
      "api/Stash/Reset",
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
        <td>{weapon.combatType}</td>
        <td>{weapon.name}</td>
        <td>{CharacterDetails.renderBuffList(weapon.modifiers)}</td>
      </tr>
    );
  }

  createWeapon(weapon) {
    this.handleStashPromise(fetch (
      "api/Stash/CreateWeapon",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weapon),
      }));
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

  createItem(item) {
    this.handleStashPromise(fetch (
      "api/Stash/CreateItem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }));
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

          <ItemCreator
            isWeapon={true}
            onSubmit={w => this.createWeapon(w)}/>

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

          <ItemCreator
            isWeapon={false}
            onSubmit={i => this.createItem(i)}/>

        <hr />

        <Button
          onClick={() => this.resetAll()}>
          Reset All Data
        </Button>
      </div>
    );
  }
}