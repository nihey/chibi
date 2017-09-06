import React from 'react';
import PropTypes from 'prop-types';

import imageLoad from 'image-load';
import md5 from 'md5';

class Board extends React.Component {
  render() {
    return <section className="board">{ this.props.children }</section>;
  }
}

Board.Card = class Card extends React.Component {
  getThumbnail(props=this.props) {
    return require('assets/images/thumbnails/' + md5(props.srcs.map((src) => {
      return src;
    }).join('|')) + '.png');
  }

  render() {
    return <img
      src={this.getThumbnail()}
      className={"card " + (this.props.active ? 'active' : '')}
      onClick={() => this.props.onClick(this.props.srcs)}
    />;
  }
}

export default Board;
