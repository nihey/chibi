import React from 'react';

export default class Header extends React.Component {
  render() {
    return <header>
      <a className="button" href="/">new</a>
      <a className="button" href="/gallery">gallery</a>
    </header>;
  }
}
