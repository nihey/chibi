import Config from 'config';

let Utils = {
  getRandomName() {
    let names = Config.names
    let first = names.first[Math.floor(Math.random() * names.first.length)];
    let middle = names.sur[Math.floor(Math.random() * names.sur.length)];
    let last = names.sur[Math.floor(Math.random() * names.sur.length)];
    return `${first} ${middle} ${last}`.replace(/ /g, '_');
  },

  equals: function(a={}, b={}) {
    // TODO: Not generic, to be refactored
    if (['string', 'number', 'boolean', 'undefined'].indexOf(typeof a) !== -1) {
      return a === b;
    }

    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    return Object.keys(a).every((k) => Utils.equals(a[k], b[k]));
  },

  copy: function(data) {
    return JSON.parse(JSON.stringify(data));
  },

  getRoute: function() {
    return location.pathname.replace(/^\//g, '') || 'index';
  },

  setRoute: function(path) {
    window.history.pushState({path}, '', path);
    window.gEvents.trigger('route-changed', Utils.getRoute());
  },

  setParams: function(query) {
    let qs = Object.keys(query).map(function(key) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
    }).join('&');
    Utils.setRoute('/page?' + qs);
  },

  getParams: function() {
    // From: https://stackoverflow.com/a/1099670
    let qs = location.search;
    qs = qs.split('+').join(' ');
    var params = {};
    var tokens;
    var re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  },
};

export default Utils;
