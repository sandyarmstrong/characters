//@ts-check
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { StatCard } from './AbilityButton';

export class CharacterDetails extends Component {
  displayName = CharacterDetails.name

  constructor(props) {
    super(props);
  }

  render() {
    return this.renderCharacter(this.props.character);
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

  getDefenseTypeAbbreviation(defenseType) {
    switch(defenseType) {
      case "Melee":
        return "MD";
      case "Ranged":
        return "RD";
      case "Spell":
        return "SPD";
    }
  }

  renderCharacter(character) {
    if (character == null)
      return (
        <div></div>
      );

    return (
      <div>
        <div className="stat-bar stat-basic">
          <StatCard
            stat="LVL"
            total={character.level}/>
          <StatCard
            stat="HP"
            total={character.hitPoints}/>
          <StatCard
            stat="XP"
            total={character.experience}/>
        </div>

        <div className="stat-bar stat-defense">
          {character.defenses.map(defense =>
            <StatCard
              stat={this.getDefenseTypeAbbreviation(defense.type)}
              total={defense.modifier}/>)}
        </div>

        <h2>Attacks</h2>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Attack</th>
              <th>Type</th>
              <th>CM</th>
              <th>Fail</th>
            </tr>
          </thead>
          <tbody>
            {character.attacks.map(attack =>
              <tr>
                <td>{attack.name}</td>
                <td>{attack.combatModifier.combatType}</td>
                <td>{CharacterDetails.renderCombatModifier(attack.combatModifier)}</td>
                <td>{attack.combatModifier.failPercentage}%</td>
              </tr>)}
          </tbody>
        </Table>

        <h2>Items</h2>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Buffs</th>
            </tr>
          </thead>
          <tbody>
            {character.items.map(item =>
              <tr>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{CharacterDetails.renderBuffList(item.modifiers)}</td>
              </tr>)}
          </tbody>
        </Table>
      </div>
    )
  }
}