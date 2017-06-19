import EventListener from 'misc/event-listener';

window.Utils = require('utils').default;
window.gEvents = new EventListener();

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Router from 'components/router';

// Route changed by pressing the back button
window.onpopstate = function() {
  window.gEvents.trigger('route-changed', Utils.getRoute());
};

$(document).on('click', 'a', function(e) {
  let a = e.target;
  let target = a.getAttribute('target');
  let href = a.getAttribute('href') || '';
  if (target !== '_blank' && href[0] === '/') {
    e.preventDefault();
    Utils.setRoute(e.target.href);
  }
});

window.onerror = function() {
  // XXX: Could this avoid a user from being stuck in a localStorage
  //      corruption error?
  localStorage.clear();
}

ReactDOM.render(<Router/>, document.getElementById('react-root'));
if (module.hot) {
  module.hot.accept('components/router', () => {
    let Router = require('components/router').default;
    ReactDOM.render(<Router/>, document.getElementById('react-root'));
  });
}
