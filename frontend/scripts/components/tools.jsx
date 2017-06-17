import React from 'react';

import Utils from 'utils';

export default class Tools extends React.Component {

  onDownload(e) {
    e.preventDefault();
    this.download.click();
  }

  constructor(props) {
    super(props);
    this.state = {
      name: Utils.getRandomName(),
    };
  }

  render() {
    return <form className="tools" onSubmit={this.onDownload.bind(this)}>
      <input
        ref={v => this.name = v}
        defaultValue={this.state.name}
        onChange={() => this.setState({name: this.name.value})}
      /><br/>
      <a
        ref={v => this.download = v}
        className="button"
        href={this.props.sprite}
        download={this.state.name}
      >
        download
      </a>
    </form>;
  }
}
