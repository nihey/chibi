import React from 'react';

import Header from 'components/header';
import SpriteDetails from 'components/sprite-details';
import Utils from 'utils';

export default class SpriteDetailsView extends React.Component {
  update(props=this.props) {
    Utils.ajax({
      method: 'GET',
      url: '/sprite',
      data: {id: Utils.getRoute().split('/')[1]},
      success: (data) => {
        document.title = data.name;
        this.setState({data});
      },
      error: () => Utils.setRoute('/'),
    });
  }

  /*
   * React
   */

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
      <Header/>
      <SpriteDetails data={this.state.data}/>
    </div>;
  }
}
