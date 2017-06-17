import React from 'react';

import imageLoad from 'image-load';

import Utils from 'utils';
import RunningSprite from 'components/running-sprite';
import Board from 'components/board';


class Accumulator extends React.Component {
  process(props=this.props, forced) {
    let srcs = Object.keys(props.srcs).sort();
    let backs = srcs.map(k => require('assets/images/creator/' + props.srcs[k].back + '.png'));
    let fronts = srcs.map(k => require('assets/images/creator/' + props.srcs[k].front + '.png'));
    let urls = backs.concat(fronts);

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
      delete this.state.images[level];
      this.setState({images: this.state.images});
    };
  }

  gender(gender) {
    return (srcs) => {
      let image = {front: srcs[0], back: srcs[0]};
      if (gender !== this.state.gender) {
        return this.setState({images: {'0': image}, gender});
      }
      this.state.images[0] = image;
      this.setState({images: this.state.images, gender});
    };
  }

  select(level) {
    return (srcs) => {
      let image = {
        back: srcs[0],
        front: srcs[srcs.length - 1],
      };

      this.state.images[level] = image;
      this.setState({images: this.state.images});
    };
  }

  /*
   * General
   */

  isActive(index, front) {
    if (!this.state.images[index]) {
      return front === 'blank';
    }
    return this.state.images[index].front === front;
  }

  /*
   * Render
   */

  getBoard(group, gender, index, rowIndex=0) {
    return <Board>
      <Board.Card
        srcs={['blank']}
        onClick={this.blank(index)}
        active={this.isActive(index, 'blank')}
      />
      {Environment[group][gender].map((e, i) => {
        let front = group + '/' + gender + '/' + e.front;
        return <Board.Card
          key={i}
          srcs={[
            e.back ? group + '/' + gender + '/' + e.back : 'blank',
            this.state.images[0].front,
            group + '/' + gender + '/' + e.front,
          ]}
          rowIndex={rowIndex}
          onClick={this.select(index)}
          active={this.isActive(index, front)}
        />
      })}
    </Board>;
  }

  /*
   * React
   */

  constructor(props) {
    super(props);
    let DEFAULT = 'base/male/color-0';
    this.state = {
      gender: 'male',
      images: {
        0: {
          front: DEFAULT,
          back: DEFAULT,
        },
      },
      sprite: DEFAULT,
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
        {Environment.base.male.map((e, i) => {
          let front = 'base/male/' + e.front;
          return <Board.Card
            key={i}
            srcs={[front]}
            onClick={this.gender('male')}
            images={this.state.images}
            active={this.isActive(0, front)}
          />;
        })}
        <br/>
        {Environment.base.female.map((e, i) => {
          let front = 'base/female/' + e.front;
          return <Board.Card
            key={i}
            srcs={[front]}
            onClick={this.gender('female')}
            images={this.state.images}
            active={this.isActive(0, front)}
          />;
        })}
      </Board>
        {this.getBoard('body', this.state.gender,  1)}
        {this.getBoard('armor', 'unissex',  2)}
        {this.getBoard('hair', this.state.gender,  3)}
        {this.getBoard('accessory', this.state.gender,  4)}
        {this.getBoard('hair-back', this.state.gender,  5, 3)}
        {this.getBoard('hair-front', this.state.gender,  6)}
        {this.getBoard('accessory', 'unissex',  7)}
        {this.getBoard('mantle', 'unissex',  8)}
        {this.getBoard('wing', 'unissex',  9, 3)}
    </div>;
  }
}
