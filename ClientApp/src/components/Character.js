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

  handleDoneLeveling(character) {
    if (character)
      this.setState({ character: character });
    this.setState({ leveling: false });
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

        <Leveler
          id="1"
          character={this.state.character}
          show={this.state.leveling}
          onCanceled = {_ => this.handleDoneLeveling()}
          onChanged = {character => this.handleDoneLeveling(character)}/>
      </div>
    )
  }
}
