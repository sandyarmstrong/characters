//@ts-check
import React, { Component } from 'react';
import { Button, Modal, Grid, Row, Col, Label } from 'react-bootstrap';
import { AbilityButton } from './AbilityButton';
import { CharacterDetails } from './CharacterDetails';
import './Leveler.css';

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

  getDisplayCharacter() {
    if (this.state.previewCharacter)
      return this.state.previewCharacter;
    else
      return this.props.character;
  }

  getCanIncrease () {
    return (this.state.strBuff + this.state.dexBuff + this.state.mindBuff) <
      this.props.character.levelsAvailable;
  }

  renderModalBody() {
    let character = this.getDisplayCharacter();
    let canIncrease = this.getCanIncrease();
    return (
      <div>
        {/* <Grid fluid>
          <Row>
            <Col sm={3}>
              <AbilityButton
                ability="STR"
                total={character.strength}
                canEdit={true}
                canIncrease={canIncrease}
                onChange={mod => this.handleAbilityChange("strength", mod)}
                mod={this.state.strBuff}
                />
            </Col>
            <Col sm={3}>
              <AbilityButton
                ability="DEX"
                total={character.dexterity}
                canEdit={true}
                canIncrease={canIncrease}
                onChange={mod => this.handleAbilityChange("dexterity", mod)}
                mod={this.state.dexBuff}
                />
            </Col>
            <Col sm={3}>
              <AbilityButton
                ability="MND"
                total={character.mind}
                canEdit={true}
                canIncrease={canIncrease}
                onChange={mod => this.handleAbilityChange("mind", mod)}
                mod={this.state.mindBuff}
                />
            </Col>
          </Row>
        </Grid> */}
        <div className="ability-button-bar">
          <AbilityButton
            ability="STR"
            total={character.strength}
            canEdit={true}
            canIncrease={canIncrease}
            onChange={mod => this.handleAbilityChange("strength", mod)}
            mod={this.state.strBuff}
            />
          <AbilityButton
            ability="DEX"
            total={character.dexterity}
            canEdit={true}
            canIncrease={canIncrease}
            onChange={mod => this.handleAbilityChange("dexterity", mod)}
            mod={this.state.dexBuff}
            />
          <AbilityButton
            ability="MND"
            total={character.mind}
            canEdit={true}
            canIncrease={canIncrease}
            onChange={mod => this.handleAbilityChange("mind", mod)}
            mod={this.state.mindBuff}
            />
        </div>
        <CharacterDetails character={character}/>
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