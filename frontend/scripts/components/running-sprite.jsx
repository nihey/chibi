import React from 'react';
import PropTypes from 'prop-types';

import imageLoad from 'image-load';

require('sprite-js');

export default class RunningSprite extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  }

  componentDidMount() {
    let url = require('assets/images/creator/' + this.props.src + '.png');
    imageLoad(url, (image) => {
      this.sprite = new Sprite({
        canvas: this.canvas,
        image: image,
        rows: 4,
        columns: 3,
        columnFrequency: 1,
      });

      this._interval = setInterval(() => {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sprite.draw(0, 0);
      }, 200);
    });
  }

  componentWillReceiveProps(next) {
    let url = require('assets/images/creator/' + next.src + '.png');
    imageLoad(url, (image) => {
      this.sprite.image = image;
    });
  }

  componentWillUnmount() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  render() {
    return <canvas
      className="sprite"
      ref={v => this.canvas = v}
      width="32"
      height="32"
    ></canvas>;
  }
}
