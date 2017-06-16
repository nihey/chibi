import React from 'react';
import PropTypes from 'prop-types';

import imageLoad from 'image-load';

require('sprite-js');

export default class RunningSprite extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  }

  static defaultProps = {
    rowIndex: 0,
    columnIndex: 1,
  }

  getUrl(props=this.props) {
    if (props.src.indexOf('base64,') !== -1) {
      return props.src;
    }
    return require('assets/images/creator/' + props.src + '.png');
  }

  componentDidMount() {
    imageLoad(this.getUrl(), (image) => {
      this.sprite = new Sprite({
        canvas: this.canvas,
        image: image,
        rows: 4,
        columns: 3,
        rowIndex: this.props.rowIndex,
        columnIndex: this.props.columnIndex,
        columnFrequency: 1,
      });

      this._interval = setInterval(() => {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sprite.draw(0, 0);
      }, 200);
    });
  }

  componentWillReceiveProps(next) {
    imageLoad(this.getUrl(next), (image) => {
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
