import React from 'react';
import PropTypes from 'prop-types';

import imageLoad from 'image-load';

class Board extends React.Component {
  render() {
    return <section className="board">{ this.props.children }</section>;
  }
}

Board.Card = class Card extends React.Component {
  static defaultProps = {
    rowIndex: 0,
    columnIndex: 1,
  }

  getUrls(props=this.props) {
    return props.srcs.map((src) => {
      if (src.indexOf('base64,') !== -1) {
        return src;
      }
      return require('assets/images/creator/' + src + '.png');
    });
  }

  componentDidMount() {
    this.sprites = [];
    imageLoad(this.getUrls(), (...images) => {
      images.forEach((image, i) => {
        if (!this.canvas) {
          return;
        }

        let sprite = new Sprite({
          canvas: this.canvas,
          image: image,
          rows: 4,
          columns: 3,
          rowIndex: this.props.rowIndex,
          columnIndex: this.props.columnIndex,
          columnFrequency: 0,
        });

        sprite.draw(0, 0);
        this.sprites.push(sprite);
      });
    });
  }

  componentWillReceiveProps(next) {
    if (!this.sprites || this.sprites.length === 0) {
      return;
    }

    imageLoad(this.getUrls(next), (...images) => {
      this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
      images.forEach((image, i) => {
        if (i === 0) {
          image.style.opacity = 0;
        }

        this.sprites[i].image = image;
        this.sprites[i].draw(0, 0);
      });
    });
  }

  render() {
    return <canvas
      className={"card " + (this.props.active ? 'active' : '')}
      onClick={() => this.props.onClick(this.props.srcs)}
      ref={v => this.canvas = v}
      width="32"
      height="32"
    ></canvas>;
  }
}

export default Board;
