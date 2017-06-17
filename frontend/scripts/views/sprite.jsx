import React from 'react';

import RunningSprite from 'components/running-sprite';
import Utils from 'utils';

export default class SpriteView extends React.Component {
  onEdit() {
    localStorage.__savedIndexState_v0 = JSON.stringify({
      gender: this.state.data.gender,
      images: this.state.data.setting,
      sprite: this.state.data.image,
    });
    localStorage.__savedToolsState_v0 = JSON.stringify({
      id: this.state.data.id,
      name: this.state.data.name,
    });
    Utils.setRoute('/');
  }

  update(props=this.props) {
    Utils.ajax({
      method: 'GET',
      url: '/sprite',
      data: {id: Utils.getRoute().split('/')[1]},
      success: (data) => {
        this.setState({data});
      },
      error: () => Utils.setRoute('/'),
    });
  }

  componentDidMount() {
    this.update();
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.state.data) {
      return <div/>;
    }

    return <div className="flex-center">
      <h1>{ this.state.data.name }</h1>
      <div>
        <RunningSprite src={this.state.data.image}/>
        <RunningSprite src={this.state.data.image} rowIndex={1}/>
        <br/>
        <RunningSprite src={this.state.data.image} rowIndex={2}/>
        <RunningSprite src={this.state.data.image} rowIndex={3}/>
        <br/>
      </div>
      <img src={this.state.data.image}/>
      <a
        className="button"
        href={this.state.data.image}
        download={this.state.data.name}
        style={{width: '96px', marginTop: '10px'}}
      >
        download
      </a>
      <button style={{width: '96px', marginTop: '10px'}} onClick={this.onEdit.bind(this)}>
        edit
      </button>
    </div>;
  }
}
