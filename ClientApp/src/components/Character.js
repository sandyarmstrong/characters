//@ts-check
import React, { Component } from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';
import { Leveler } from './Leveler';

export class Character extends Component {
  displayName = Character.name

  constructor(props) {
    super(props);
    this.state = { character: null, loading: true, leveling: false };

    fetch('api/Character/Summary/1')
      .then(response => response.json())
      .then(data => {
        this.setState({ character: data, loading: false });
      });
  }

  levelUp() {
    this.setState({ leveling: true });
  }

  handleDoneLeveling() {
    this.setState({ leveling: false });
    // TODO: refresh character from Leveler comp? or something?
  }

  renderCharacter(character) {
    if (character == null)
      return (
        <div></div>
      );

    return (
      <div>
        <h1>{character.name} ({character.playerName}) <Badge onClick={e => this.levelUp()}>{character.levelsAvailable}</Badge></h1>

        <CharacterDetails character={character}/>
      </div>
    )
  }

  render() {
    if (this.state.loading)
      return (<div><p><em>Loading...</em></p></div>);
    if (!this.state.character)
      return (<div><p><em>No character found</em></p></div>);

    let charDiv = this.renderCharacter(this.state.character);
    return (
      <div>
        {charDiv}

        <Modal show={this.state.leveling} onHide={e => this.handleDoneLeveling()}>
          <Modal.Header closeButton>
            <Modal.Title>Level Up!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Leveler id="1" character={this.state.character}/>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={e => this.handleDoneLeveling()}>
              Close
            </Button>
            <Button
              bsStyle="primary"
              onClick={e => this.handleDoneLeveling()}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
