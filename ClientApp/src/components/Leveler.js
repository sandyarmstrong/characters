//@ts-check
import React, { Component } from 'react';
import { Button, Modal, Grid, Row, Col, Label } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';

export class Leveler extends Component {
  displayName = Leveler.name

  // props: {id, character}
  constructor(props) {
    super(props);
    this.state = {
      previewCharacter: null,
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
    this.updateCharacter(true);
  }

  updateCharacter(preview) {
    return fetch(
      "api/Character/LevelUp/" + this.props.id + "?preview=" + preview,
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
        this.setState({
          previewCharacter: data,
          loading: false});
        return data;
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

  getDisplayCharacter() {
    if (this.state.previewCharacter)
      return this.state.previewCharacter;
    else
      return this.props.character;
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
        <h4>
          <Label
            bsStyle={this.getBuffButtonStyle(ability)}>
            {label}
          </Label>
        </h4>
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
          disabled={this.getDisplayCharacter().levelsAvailable > 0 ? false : true}
          onClick={_ => this.handleAbilityChange(ability, 1)}
          bsSize="small">
          +
        </Button>
      </div>
    );
  }

  renderModalBody() {
    return (
      <div>
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
        <CharacterDetails character={this.getDisplayCharacter()}/>
      </div>
    );
  }

  resetState() {
    this.setState({
      strBuff: 0,
      dexBuff: 0,
      mindBuff: 0,
      previewCharacter: null,
      loading: false,
      needsUpdate: false,
    });
  }

  onCanceled() {
    this.resetState();
    this.props.onCanceled();
  }

  onSubmit() {
    this.updateCharacter(false)
      .then(character => {
        this.props.onChanged(character);
        this.resetState();
      })
  }

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={e => this.props.onCanceled()}>
          <Modal.Header>
            <Modal.Title>
              Level Up! 
              ({this.getDisplayCharacter().levelsAvailable} / {this.props.character.levelsAvailable} available)
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderModalBody()}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={e => this.onCanceled()}>
              Close
            </Button>
            <Button
              bsStyle="primary"
              disabled={this.props.character.levelsAvailable == 0}
              onClick={e => this.onSubmit()}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}