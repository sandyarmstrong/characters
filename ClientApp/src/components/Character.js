//@ts-check
import React, { Component } from 'react';
import { Badge, Col, Grid, Modal, Row, Table } from 'react-bootstrap';

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
  }

  static renderCombatModifier(cm) {
    var mod = "";
    if (cm.remainder > 0)
      mod += " + " + cm.remainder;
    else if (cm.remainder < 0)
      mod += cm.remainder;

    var dice = "";
    if (cm.diceCount > 0)
      dice = cm.diceCount + "d" + cm.diceSize;

    return (
      <span>{dice}{mod}</span>
    );
  }

  static renderBuffList(buffs) {
    var buffsStr = "";
    for (var i = 0; i < buffs.length; i++) {
      const mod = buffs [i].modifier;
      buffsStr += buffs [i].type + (mod > 0 ? "+" : "") + mod;
      if (i < buffs.length - 1)
        buffsStr += ", ";
    }
    return buffsStr;
  }

  renderCharacter(character) {
    if (character == null)
      return (
        <div></div>
      );

    // if (character.levelsAvailable > 0);

    return (
      <div>
        <h1>{character.name} ({character.playerName}) <Badge onClick={e => this.levelUp()}>{character.levelsAvailable}</Badge></h1>

        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td>Level</td>
              <td>{character.level}</td>
            </tr>
            <tr>
              <td>XP</td>
              <td>{character.experience}</td>
            </tr>
            <tr>
              <td>HP</td>
              <td>{character.hitPoints}</td>
            </tr>
            <tr>
              <td>Heroism</td>
              <td>{character.heroism}</td>
            </tr>
            <tr>
              <td>Strength</td>
              <td>{character.strength}</td>
            </tr>
            <tr>
              <td>Dexterity</td>
              <td>{character.dexterity}</td>
            </tr>
            <tr>
              <td>Mind</td>
              <td>{character.mind}</td>
            </tr>
          </tbody>
        </Table>

        <h2>Attacks</h2>
        <Table striped bordered condensed hover>
          <thead>
            <th>Attack</th>
            <th>Type</th>
            <th>CM</th>
            <th>Failure Rate</th>
          </thead>
          <tbody>
            {character.attacks.map(attack =>
              <tr>
                <td>{attack.name}</td>
                <td>{attack.combatModifier.combatType}</td>
                <td>{Character.renderCombatModifier(attack.combatModifier)}</td>
                <td>{attack.combatModifier.failPercentage}%</td>
              </tr>)}
          </tbody>
        </Table>

        <h2>Defense</h2>
        <Table striped bordered condensed hover>
          <thead>
            <th>Type</th>
            <th>Defense</th>
          </thead>
          <tbody>
            {character.defenses.map(defense =>
              <tr>
                <td>{defense.type}</td>
                <td>{defense.modifier}</td>
              </tr>)}
          </tbody>
        </Table>

        <h2>Items</h2>
        <Table striped bordered condensed hover>
          <thead>
            <th>Type</th>
            <th>Name</th>
            <th>Buffs</th>
          </thead>
          <tbody>
            {character.items.map(item =>
              <tr>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{Character.renderBuffList(item.modifiers)}</td>
              </tr>)}
          </tbody>
        </Table>
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
            Stuff
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
