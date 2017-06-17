import React from 'react';

export default class Router extends React.Component {
  routes = [
    ['sprite', 'p/(.*)'],
  ]

  getView() {
    var route = this.state.route;
    this.routes.some(function(tuple) {
      let [alias, expression] = tuple;
      if (route.match(new RegExp(expression))) {
        route = alias;
        return true;
      }
    }, this);
    return require('views/' + route).default;
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
    return <div>
      <View/>
    </div>;
  }
}
