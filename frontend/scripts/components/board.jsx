import React from 'react';
import PropTypes from 'prop-types';

import imageLoad from 'image-load';

class Board extends React.Component {
  render() {
    return <section className="board">{ this.props.children }</section>;
  }
}

Board.Card = class Card extends React.Component {
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
        columnFrequency: 0,
      });

      this.sprite.draw(0, 0);
    });
  }

  componentWillReceiveProps(next) {
    if (!this.sprite) {
      return;
    }

    imageLoad(this.getUrl(next), (image) => {
      this.sprite.image = image;
      this.sprite.draw(0, 0);
    });
  }

  render() {
    return <canvas
      className="card"
      onClick={() => this.props.onClick(this.props.src)}
      ref={v => this.canvas = v}
      width="32"
      height="32"
    ></canvas>;
  }
}

export default Board;
