let Utils = {
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
