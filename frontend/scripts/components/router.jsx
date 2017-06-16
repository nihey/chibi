import React from 'react';

export default class Router extends React.Component {
  getView() {
    return require('views/' + this.state.route).default;
  }

  constructor(props) {
    super(props);
    this.state = {
      route: Utils.getRoute(),
    };
  }

  componentDidMount() {
    window.gEvents.on('route-changed', () => {
      this.setState({route: Utils.getRoute()});
    });
  }

  render() {
    let View = this.getView();
    return <View/>;
  }
}
