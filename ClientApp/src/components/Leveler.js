//@ts-check
import React, { Component } from 'react';
import { Button, Grid, Row, Col, Label } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';

export class Leveler extends Component {
  displayName = Leveler.name

  // props: {id, character}
  constructor(props) {
    super(props);
    this.state = {
      character: props.character,
      loading: false,
      needsUpdate: false,
      strBuff: 0,
      dexBuff: 0,
      mindBuff: 0,
    };
  }

  handleAbilityChange(ability, mod) {
    switch (ability) {
      case "strength":
        this.setState ((prevState, props) => ({
          strBuff: prevState.strBuff + mod,
          needsUpdate: true,
        }));
        break;
      case "dexterity":
      this.setState ((prevState, props) => ({
        dexBuff: prevState.dexBuff + mod,
        needsUpdate: true,
      }));
        break;
      case "mind":
      this.setState ((prevState, props) => ({
        mindBuff: prevState.mindBuff + mod,
        needsUpdate: true,
      }));
        break;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!(this.state.needsUpdate))
      return;

    this.setState ({ loading: true, needsUpdate: false });

    fetch(
      'api/Character/LevelUp/' + this.props.id + "?preview=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            type: "Strength",
            modifier: this.state.strBuff,
          },
          {
            type: "Dexterity",
            modifier: this.state.dexBuff,
          },
          {
            type: "Mind",
            modifier: this.state.mindBuff,
          },
        ])
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ character: data, loading: false});
      });
  }

  getBuffButtonStyle(ability) {
    var buff;
    switch (ability) {
      case "strength":
        buff = this.state.strBuff;
        break;
      case "dexterity":
        buff = this.state.dexBuff;
        break;
      case "mind":
        buff = this.state.mindBuff;
        break;
    }
    return buff > 0 ? "success" : "default";
  }

  renderAbilityButton(ability) {
    var label, buff;
    switch (ability) {
      case "strength":
        label = "Strength";
        buff = this.state.strBuff;
        break;
      case "dexterity":
        label = "Dexterity";
        buff = this.state.dexBuff;
        break;
      case "mind":
        label = "Mind";
        buff = this.state.mindBuff;
        break;
    }

    return (
      <div>
        <h2>
          <Label
            bsStyle={this.getBuffButtonStyle(ability)}>
            {label}
          </Label>
        </h2>
        <Button
          disabled={buff == 0}
          onClick={_ => this.handleAbilityChange(ability, -1)}
          bsSize="small">
          -
        </Button>
        <Label>
          +{buff}
        </Label>
        <Button
          disabled={this.state.character.levelsAvailable > 0 ? false : true}
          onClick={_ => this.handleAbilityChange(ability, 1)}
          bsSize="small">
          +
            </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <p>Levels Available: {this.state.character.levelsAvailable} / {this.props.character.levelsAvailable}</p>
        <Grid fluid>
          <Row>
            <Col sm={4}>
              {this.renderAbilityButton("strength")}
            </Col>
            <Col sm={4}>
              {this.renderAbilityButton("dexterity")}
            </Col>
            <Col sm={4}>
              {this.renderAbilityButton("mind")}
            </Col>
          </Row>
        </Grid>
        <CharacterDetails character={this.state.character}/>
      </div>
    );
  }
}