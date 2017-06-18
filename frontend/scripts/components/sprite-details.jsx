import React from 'react';

import RunningSprite from 'components/running-sprite';
import Utils from 'utils';

export default class SpriteDetails extends React.Component {
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

  onVote(vote) {
    return () => {
      Utils.ajax({
        method: 'POST',
        url: '/sprite-vote',
        data: {
          id: Utils.getRoute().split('/')[1],
          vote,
        },
        success: (data) => {
          this.state.data.vote = vote;
          this.state.data.votes = data.votes;
          this.setState({data: this.state.data});
        },
      });
    }
  }

  /*
   * Misc
   */

  getVoteProps(vote) {
    let votedThis = vote === this.state.data.vote;

    return {
      className: "arrow-button " + (votedThis ? 'active' : ''),
      onClick: this.onVote(votedThis ? 0 : vote),
    };
  }

  /*
   * React
   */

  constructor(props) {
    super(props);
    this.state = {data: props.data};
  }

  componentWillReceiveProps(next) {
    this.setState({data: next.data});
  }

  render() {
    if (!this.state.data) {
      return <div/>;
    }

    return <div className="flex-center">
      <h1>{ this.state.data.name }</h1>
      <div className="upvote-section">
        <button style={{marginBottom: '-13px'}} {...this.getVoteProps(1)}>
          <i className="fa fa-chevron-up"/>
        </button>
        <h2>{ this.state.data.votes }</h2>
        <button style={{marginTop: '-13px'}} {...this.getVoteProps(-1)}>
          <i className="fa fa-chevron-down"/>
        </button>
      </div>
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
