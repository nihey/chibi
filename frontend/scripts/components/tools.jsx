import React from 'react';

import Utils from 'utils';

export default class Tools extends React.Component {

  onSubmit(e) {
    e.preventDefault();
    this.download.click();
  }

  onSave() {
    Utils.ajax({
      method: 'POST',
      url: '/sprite',
      data: {
        name: this.state.name,
        gender: this.props.gender,
        setting: this.props.images,
        image: this.props.sprite,
      },
      success: (response) => {
        this.setState({id: response.id}, this.save);
      },
    });
  }

  onShareLink(e) {
    if (!this.state.id) {
      e.preventDefault();
      return this.onSave();
    }
  }

  restore() {
    let DEFAULT = 'base/male/color-0';
    return JSON.parse(localStorage.__savedToolsState_v0 || JSON.stringify({
      name: Utils.getRandomName(),
    }));
  }

  save() {
    localStorage.__savedToolsState_v0 = JSON.stringify(this.state);
  }

  getLink() {
    if (!this.state.id) {
      return null;
    }

    return <input className="pop-in" value={location.origin + '/p/' + this.state.id} disabled/>
  }

  /*
   * React
   */

  constructor(props) {
    super(props);
    this.state = this.restore();
    this.save();
  }

  componentDidMount() {
    this.firstProps = true;
  }

  componentWillReceiveProps(next) {
    // Prevent the first triggering of this method to remove the state.id
    // because it could be triggered because of the system bootstraping
    if (this.firstProps) {
      this.firstProps = false;
      return;
    }

    // Any other changes will remove the id, thus, requiring another "save"
    // action to generate id
    this.setState({id: null}, this.save);
  }

  render() {
    return <div className="tools">
      <form onSubmit={this.onSubmit.bind(this)}>
        <input
          ref={v => this.name = v}
          defaultValue={this.state.name}
          onChange={() => this.setState({name: this.name.value}, this.save)}
        /><br/>
        <a
          ref={v => this.download = v}
          className="button"
          href={this.props.sprite}
          download={this.state.name}
          onClick={this.onSave.bind(this)}
          style={{width: '70%'}}
        >
          save
        </a>
      </form>
      <br/>
      <h3>share</h3>
      <div className="social">
        <a
          className="button"
          target="_blank"
          href={this.state.id ?
            `http://www.facebook.com/share.php?u=${location.origin}/p/${this.state.id}&title=Chibi Center` :
            `http://www.facebook.com/share.php?u=${location.origin}&title=Chibi Center!`
          }
        >
          <i className="fa fa-facebook"/>
        </a>
        <a
          className="button"
          target="_blank"
          href={this.state.id ?
            `https://twitter.com/intent/tweet?text=Check out -> ${location.origin}/p/${this.state.id}` :
            `https://twitter.com/intent/tweet?text=I'm using ${location.origin} to create sprites!`
          }
        >
          <i className="fa fa-twitter"/>
        </a>
        <a className="button" href="https://github.com/nihey/chibi" target="_blank">
          <i className="fa fa-github"/>
        </a>
        <a
          className="button"
          onClick={this.onShareLink.bind(this)}
          href={this.state.id ? `/p/${this.state.id}` : ''}
          target="_blank"
        >
          <i className="fa fa-link"/>
        </a>
        {this.getLink()}
      </div>
    </div>;
  }
}
