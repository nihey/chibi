import React from 'react';

export default class Loader extends React.Component {
  render() {
    return <div className="loader">
      <i className="fa fa-refresh fa-spin"/>
    </div>;
  }
}
