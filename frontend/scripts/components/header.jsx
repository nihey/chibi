import React from 'react';

export default class Header extends React.Component {
  static defaultProps = {
    'create': true,
    'gallery': true,
  }

  render() {
    return <header>
      {this.props.create && <a className="button" href="/">create</a>}
      {this.props.gallery && <a className="button" href="/gallery/top">gallery</a>}
    </header>;
  }
}
