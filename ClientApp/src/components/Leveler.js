//@ts-check
import React, { Component } from 'react';
import { Badge, Modal } from 'react-bootstrap';
import { CharacterDetails } from './CharacterDetails';

export class Leveler extends Component {
  displayName = Leveler.name

  // props: {id, character}
  constructor(props) {
    super(props);
    this.state = { character: props.character, loading: false };

    // fetch('api/Character/Summary/1')
    //   .then(response => response.json())
    //   .then(data => {
    //     this.setState({ character: data, loading: false });
    //   });

    fetch(
      'api/Character/LevelUp/' + props.id + "?preview=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            type: "Mind",
            modifier: 1,
          },
        ])
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ character: data, loading: false});
      });
  }

  render() {
    return (
      <div>
        <CharacterDetails character={this.state.character}/>
      </div>
    );
  }
}