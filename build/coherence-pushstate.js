'use strict';

var NAVIGATE = require('coherence').NAVIGATE_ACTION_TYPE;

var Navigator = function Navigator(dispatcher) {
  var self = {};

  self.navigate = function (path, pushState) {
    if (pushState === undefined) {
      pushState = true;
    }
    dispatcher.dispatch({
      type: NAVIGATE,
      pushState: pushState,
      path: path
    });
  };

  self.redirect = function (path) {
    dispatcher.dispatch({
      type: NAVIGATE,
      replaceState: true,
      path: path
    });
  };

  return self;
};

module.exports = {
  Navigator: Navigator,
  initialize: initialize
};

function initialize(dispatcher, _window) {
  var navigator = Navigator(dispatcher);

  dispatcher.register(function (intent) {
    if (intent.type === NAVIGATE) {
      var state = {
        path: intent.path
      };
      if (intent.replaceState) {
        return _window.history.replaceState(state, '', intent.path);
      }
      if (intent.pushState) {
        return _window.history.pushState(state, '', intent.path);
      }
    }
  });

  _window.onpopstate = function (event) {
    if (event.state && event.state.path) {
      navigator.navigate(event.state.path, false);
    }
  };

  navigator.redirect(_window.location.pathname);
}