//@ts-check
import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';

export class Admin extends Component {
  displayName = Admin.name

  constructor(props) {
    super(props);
    this.state = { characters: [], loading: true};
    this.handleCharactersPromise (fetch ("api/Character/All"))
  }

  handleCharactersPromise (request) {
    request
      .then(response => response.json())
      .then(data => {
        this.setState({ characters: data, loading: false });
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
    )
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
      </div>
    );
  }
}