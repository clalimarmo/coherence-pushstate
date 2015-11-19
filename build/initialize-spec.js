'use strict';

var initialize = require('./coherence-pushstate').initialize;
var NAVIGATE = require('coherence').NAVIGATE_ACTION_TYPE;
var expect = require('chai').expect;
var sinon = require('sinon');

describe('initialize', function () {
  var mocks;

  beforeEach(function () {
    mocks = {};
    mocks.dispatcher = {
      dispatch: function dispatch(intent) {
        mocks.dispatcher.registeredActionHandlers.forEach(function (handler) {
          handler(intent);
        });
      },
      register: function register(handler) {
        mocks.dispatcher.registeredActionHandlers.push(handler);
      }
    };
    mocks.dispatcher.registeredActionHandlers = [];

    mocks.window = {};
    mocks.window.history = {};
    mocks.window.history.pushState = sinon.spy();
    mocks.window.history.replaceState = sinon.spy();

    mocks.window.location = {};
  });

  it('sets the current history state to window.location.pathname', function () {
    mocks.window.location.pathname = '/dingdong';
    initialize(mocks.dispatcher, mocks.window);
    expect(mocks.window.history.replaceState.args[0][0].path).to.eq('/dingdong');
    expect(mocks.window.history.replaceState.args[0][2]).to.eq('/dingdong');
  });

  it('updates the browser URL on navigate', function () {
    initialize(mocks.dispatcher, mocks.window);
    mocks.dispatcher.dispatch({
      type: NAVIGATE,
      path: '/foo',
      pushState: true
    });
    expect(mocks.window.history.pushState.args[0][0].path).to.eq('/foo');
    expect(mocks.window.history.pushState.args[0][2]).to.eq('/foo');
  });

  it('does not update the browser URL on navigate, if pushState: false', function () {
    initialize(mocks.dispatcher, mocks.window);
    mocks.dispatcher.dispatch({
      type: NAVIGATE,
      path: '/bonk',
      pushState: false
    });
    expect(mocks.window.history.pushState.callCount).to.eq(0);
  });

  it('replaces state on navigate, if replaceState: true', function () {
    initialize(mocks.dispatcher, mocks.window);
    mocks.dispatcher.dispatch({
      type: NAVIGATE,
      path: '/blamo',
      replaceState: true
    });
    expect(mocks.window.history.replaceState.args[1][0].path).to.eq('/blamo');
    expect(mocks.window.history.replaceState.args[1][2]).to.eq('/blamo');
  });
});