import React from 'react';

import imageLoad from 'image-load';

import Utils from 'utils';
import RunningSprite from 'components/running-sprite';
import Board from 'components/board';


class Accumulator extends React.Component {
  process(props=this.props, forced) {
    let srcs = Object.keys(props.srcs).sort();
    let urls = srcs.map(k => require('assets/images/creator/' + props.srcs[k].src + '.png'));

    if (!forced && Utils.equals(props.srcs, this.srcs)) {
      return;
    }

    imageLoad(urls, (...images) => {
      let context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      srcs.forEach((k, i) => {
        let src = props.srcs[k];
        if (src.type === 'quarter-mixed') {
          context.drawImage(images[i], 0, 0, 96, 32, 0, 0, 96, 32);
        }
      });

      srcs.forEach((k, i) => {
        let src = props.srcs[k];
        if (src.type === 'quarter-mixed') {
          context.drawImage(images[i], 0, 32, 96, 96, 0, 32, 96, 96);
          return;
        }
        context.drawImage(images[i], 0, 0);
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

  select(level, type="fixed", gender) {
    gender = gender || this.state.gender
    return (src) => {
      // In most cases, the src we want to get is the last one
      if (Array.isArray(src)) {
        src = src[src.length - 1];
      }

      if (this.state.gender === gender) {
        this.state.images[level] = {src, type};
      } else {
        let images = {};
        images[level] = {src, type}
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
      images: {0: {src: 'bases/male/color-0'}},
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
        <Board.Card src="bases/male/color-0" onClick={this.select(0, 'fixed', 'male')}/>
        <Board.Card src="bases/female/color-0" onClick={this.select(0, 'fixed', 'female')}/>
      </Board>
        {['body', 'hair', 'accessory', 'hair-back', 'hair-front'].map((g, i) => {
          return <Board key={i}>
            <Board.Card src={'blank'} onClick={this.blank(i + 1)}/>
            {Environment[g][this.state.gender].map((e, j) => {
              let rowIndex = 0;
              if (g === 'hair-back') {
                rowIndex = 3;
              }

              return <Board.Card
                key={i + '-' + j}
                src={[
                  `bases/${this.state.gender}/color-0`,
                  g + '/' + this.state.gender + '/' + e,
                ]}
                rowIndex={rowIndex}
                onClick={this.select(i + 1, g === 'hair-back' ? 'quarter-mixed' : 'fixed')}
              />
            })}
          </Board>;
        })}
        <Board>
          <Board.Card src={'blank'} onClick={this.blank(20)}/>
          {Environment.accessory.unissex.map((e, i) => {
            return <Board.Card
              key={i}
              src={[
                `bases/${this.state.gender}/color-0`,
                'accessory/unissex/' + e
              ]}
              onClick={this.select(20)}
            />
          })}
        </Board>;
        <Board>
          <Board.Card src={'blank'} onClick={this.blank(21)}/>
          {Environment.mantle.unissex.map((e, i) => {
            return <Board.Card
              key={i}
              src={'mantle/unissex/' + e}
              onClick={this.select(21)}
            />
          })}
        </Board>;
        <Board>
          <Board.Card src={'blank'} onClick={this.blank(22)}/>
          {Environment.wing.unissex.map((e, i) => {
            return <Board.Card
              key={i}
              src={[
                `bases/${this.state.gender}/color-0`,
                'wing/unissex/' + e
              ]}
              onClick={this.select(22, 'quarter-mixed')}
              rowIndex={3}
            />
          })}
        </Board>;
    </div>;
  }
}
