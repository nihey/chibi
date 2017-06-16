import React from 'react';

import RunningSprite from 'components/running-sprite';
import Board from 'components/board';

export default class Index extends React.Component {
  /*
   * Callbacks
   */

  select(level, gender) {
    gender = gender || this.state.gender
    return (src) => {
      this.setState({image: src, gender});
    };
  }

  /*
   * React
   */

  constructor(props) {
    super(props);
    this.state = {
      gender: 'male',
      image: 'bases/male/color-0',
    };
  }

  render() {
    return <div>
      <div className="running-sprite-container">
        <RunningSprite src={this.state.image}/>
      </div>
      <Board>
        <Board.Card src="bases/male/color-0" onClick={this.select(0, 'male')}/>
        <Board.Card src="bases/female/color-0" onClick={this.select(0, 'female')}/>
      </Board>
      <Board>
        {Environment.hairs[this.state.gender].map((e, i) => {
          return <Board.Card
            key={i}
            src={'hair/' + this.state.gender + '/' + e}
            onClick={this.select(1)}
          />
        })}
      </Board>
      <Board>
        {Environment.hairBacks[this.state.gender].map((e, i) => {
          return <Board.Card
            key={i}
            src={'hair-back/' + this.state.gender + '/' + e}
            onClick={this.select(1)}
            rowIndex={3}
          />
        })}
      </Board>
      <Board>
        {Environment.hairFronts[this.state.gender].map((e, i) => {
          return <Board.Card
            key={i}
            src={'hair-front/' + this.state.gender + '/' + e}
            onClick={this.select(1)}
          />
        })}
      </Board>
    </div>;
  }
}
