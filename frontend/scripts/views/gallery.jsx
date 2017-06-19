import React from 'react';
import $ from 'jquery';

import Header from 'components/header';
import SpriteDetails from 'components/sprite-details';
import Utils from 'utils';

export default class Gallery extends React.Component {
  fetch() {
    let selected = this.state.selected;
    this.setState({loading: true});
    Utils.ajax({
      method: 'GET',
      url: '/sprite',
      data: {
        sort: this.getRoute(),
        offset: this.getSelected().length,
      },
      success: (data) => {
        this.state.loading = false;
        this.state[selected] = this.state[selected].concat(data);
        this.setState(this.state);
      },
    });
  }

  getSelected() {
    return this.state[this.state.selected];
  }

  onScroll(e) {
    let ratio = document.body.scrollTop / document.body.scrollHeight;
    if (ratio >= 0.75 && !this.state.loading) {
      this.fetch();
    }
  }

  getRoute() {
    let split = Utils.getRoute().split('/');
    return split[split.length - 1];
  }

  getRouteButton(where) {
    let isActive = this.getRoute() === where;
    return <a
      className={"button " + (isActive ? 'active' : '')}
      href={"/gallery/" + where}>
      { where }
    </a>
  }

  /*
   * React
   */

  componentDidMount() {
    document.title = 'Gallery';
    this.fetch();
    this.onScroll = this.onScroll.bind(this);
    $(window).on('scroll', this.onScroll);
    this.onScroll();
  }

  componentWillReceiveProps(next) {
    this.setState({selected: this.getRoute() + '_'}, () => {
      if (this.getSelected().length === 0) {
        this.fetch();
      }
    });
  }

  componentWillUnmount() {
    $(window).off('scroll', this.onScroll);
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: 'top_',
      top_: [],
      new_: [],
    }
  }

  render() {
    return <div className="gallery">
      <Header gallery={false}/>
      <div className="gallery-routes">
        { this.getRouteButton('top') }
        { this.getRouteButton('new') }
      </div>
      {this.getSelected().map((data, i) => {
        return <SpriteDetails
          key={i}
          data={data}
          style={{height: 'auto', margin: '40px', display: 'inline-flex'}}
        />;
      })}
    </div>;
  }
}
