//@ts-check
import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';
import { ItemCreator } from './ItemCreator';
import { Util } from '../util';

export class Admin extends Component {
  displayName = Admin.name

  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      weapons: [],
      items: [],
      loading: true};

    this.handleCharactersPromise (Util.getJson ("api/Character/All"));
    this.handleStashPromise (Util.getJson ("api/Stash/All"));
  }

  handleCharactersPromise (request) {
    request
      .then(data => {
        this.setState({ characters: data, loading: false });
      });
  }

  handleStashPromise (request) {
    request
      .then(data => {
        this.setState({
          weapons: data.filter (item => item.type == "Weapon"),
          items: data.filter (item => item.type != "Weapon"),
          loading: false });
      });
  }

  resetAll() {
    this.handleCharactersPromise(Util.postJson (
      "api/Character/Reset"));
    this.handleStashPromise(Util.postJson (
      "api/Stash/Reset"));
  }

  grantLevels(ids) {
    this.handleCharactersPromise(Util.postJson (
      "api/Character/GrantLevels",
      ids));
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
    this.handleStashPromise(Util.postJson (
      "api/Stash/CreateWeapon",
      weapon));
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
    this.handleStashPromise(Util.postJson (
      "api/Stash/CreateItem",
      item));
  }

  giveRandomWeapon() {
    let randomCharacter = this.state.characters[Util.getRandomInt(this.state.characters.length)];
    Util.postJson (
      "api/Character/AddWeapon/" + randomCharacter.id,
      this.state.weapons[Util.getRandomInt(this.state.weapons.length)]);
  }

  giveRandomItem() {
    let randomCharacter = this.state.characters[Util.getRandomInt(this.state.characters.length)];
    Util.postJson (
      "api/Character/AddItem/" + randomCharacter.id,
      this.state.items[Util.getRandomInt(this.state.items.length)]);
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
          onClick={() => this.giveRandomWeapon()}>
          Give Random Weapon to Random User
        </Button>

        <Button
          onClick={() => this.giveRandomItem()}>
          Give Random Item to Random User
        </Button>

        <Button
          onClick={() => this.resetAll()}>
          Reset All Data
        </Button>
      </div>
    );
  }
}