//@ts-check
import React, { Component } from 'react';
import { StatCard } from './AbilityButton';
import { CharacterDetails } from './CharacterDetails';
import { Leveler } from './Leveler';
import './Character.css';

export class Character extends Component {
  displayName = Character.name

  constructor(props) {
    super(props);
    this.state = { character: null, loading: true, leveling: false };

    var id = 1;
    if (props.match && props.match.params && props.match.params.id)
      id = props.match.params.id;

    fetch('api/Character/Summary/' + id)
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

  renderAvailableLevelsButton(character) {
    return (
      <button
        className="levels-badge"
        onClick={e => this.levelUp()}>
        {character.levelsAvailable}
      </button>
    )
  }

  renderCharacter(character) {
    if (character == null)
      return (
        <div></div>
      );

    return (
      <div>
        <h1>{character.name} ({character.playerName}) {this.renderAvailableLevelsButton(character)}</h1>

        <div className="stat-bar stat-ability">
          <StatCard
            stat="STR"
            total={character.strength}/>
          <StatCard
            stat="DEX"
            total={character.dexterity}/>
          <StatCard
            stat="MND"
            total={character.mind}/>
        </div>

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
