//@ts-check
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
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

  handleNotesChange(event) {
    this.setState({ notes: event.target.value });
  }

  handleRevertNotes() {
    this.setState({ notes: this.getSavedNotes() });
  }

  handleSaveNotes() {
    fetch (
      "api/Character/UpdateNotes/" + this.state.character.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.notes),
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          character: data,
          notes: null,
        });
      });
  }

  getSavedNotes() {
    return this.state.character.notes || "";
  }

  getNotes() {
    if (this.state.notes == null)
      return this.getSavedNotes();
    return this.state.notes;
  }

  render() {
    if (this.state.loading)
      return (<div><p><em>Loading...</em></p></div>);
    if (!this.state.character)
      return (<div><p><em>No character found</em></p></div>);

    let notes = this.getNotes();
    let notesChanged = notes != this.getSavedNotes();

    return (
      <div>
        {this.renderCharacter(this.state.character)}

        <form className="form-notes">
          <label>Notes:</label>
          <textarea
            value={notes}
            maxLength={15000}
            onChange={e=> this.handleNotesChange(e)}/>
          <div className="form-buttons">
            <Button
              disabled={!notesChanged}
              onClick={e => this.handleRevertNotes()}>
              Revert
            </Button>
            <Button
              bsStyle="primary"
              disabled={!notesChanged}
              onClick={e => this.handleSaveNotes()}>
              Save Notes
            </Button>
          </div>
        </form>

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
