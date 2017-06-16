import React from 'react';

import imageLoad from 'image-load';

import Utils from 'utils';
import RunningSprite from 'components/running-sprite';
import Board from 'components/board';


class Accumulator extends React.Component {
  process(props=this.props, forced) {

    let srcs = Object.keys(props.srcs).sort();
    let urls = srcs.map(k => require('assets/images/creator/' + props.srcs[k] + '.png'));

    if (!forced && Utils.equals(props.srcs, this.srcs)) {
      return;
    }

    imageLoad(urls, (...images) => {
      let context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      images.forEach((image) => {
        context.drawImage(image, 0, 0);
      });

      this.srcs = Utils.copy(props.srcs);
      this.props.onChange(this.canvas.toDataURL());
    });
  }

  componentDidMount() {
    this.process(this.props, true);
  }

  componentWillReceiveProps(next) {
    this.process(next);
  }

  render() {
    return <canvas
      ref={v => this.canvas = v}
      width="96"
      height="128"
    ></canvas>;
  }
}

export default class Index extends React.Component {
  /*
   * Callbacks
   */

  blank(level) {
    return () => {
      delete this.state.images[level]
      this.setState({images: this.state.images});
    };
  }

  select(level, gender) {
    gender = gender || this.state.gender
    return (src) => {
      if (this.state.gender === gender) {
        this.state.images[level] = src;
      } else {
        let images = {};
        images[level] = src
        this.state.images = images;
      }
      this.setState({images: this.state.images, gender});
    };
  }

  /*
   * React
   */

  constructor(props) {
    super(props);
    this.state = {
      gender: 'male',
      images: {0: 'bases/male/color-0'},
      sprite: 'bases/male/color-0',
    };
  }

  render() {
    return <div>
      <div className="running-sprite-container">
        <RunningSprite src={this.state.sprite}/>
        <RunningSprite src={this.state.sprite} rowIndex={1}/>
        <br/>
        <RunningSprite src={this.state.sprite} rowIndex={2}/>
        <RunningSprite src={this.state.sprite} rowIndex={3}/>
        <br/>
        <Accumulator
          srcs={this.state.images}
          onChange={(sprite) => this.setState({sprite})}
        />
      </div>
      <Board>
        <Board.Card src="bases/male/color-0" onClick={this.select(0, 'male')}/>
        <Board.Card src="bases/female/color-0" onClick={this.select(0, 'female')}/>
      </Board>
      <Board>
        <Board.Card src={'blank'} onClick={this.blank(1)}/>
        {Environment.hairs[this.state.gender].map((e, i) => {
          return <Board.Card
            key={i}
            src={'hair/' + this.state.gender + '/' + e}
            onClick={this.select(1)}
          />
        })}
      </Board>
      <Board>
        <Board.Card src={'blank'} onClick={this.blank(2)}/>
        {Environment.hairBacks[this.state.gender].map((e, i) => {
          return <Board.Card
            key={i}
            src={'hair-back/' + this.state.gender + '/' + e}
            onClick={this.select(2)}
            rowIndex={3}
          />
        })}
      </Board>
      <Board>
        <Board.Card src={'blank'} onClick={this.blank(3)}/>
        {Environment.hairFronts[this.state.gender].map((e, i) => {
          return <Board.Card
            key={i}
            src={'hair-front/' + this.state.gender + '/' + e}
            onClick={this.select(3)}
          />
        })}
      </Board>
    </div>;
  }
}
