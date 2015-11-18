'use strict';

var Navigator = require('./coherence-pushstate').Navigator;
var expect = require('chai').expect;

describe('Navigator', function () {
  var navigator, mocks;

  beforeEach(function () {
    mocks = {};
    mocks.dispatcher = {
      dispatch: function dispatch(intent) {
        mocks.dispatcher.dispatchedIntents.push(intent);
      }
    };
    mocks.dispatcher.dispatchedIntents = [];

    mocks.window = {};

    navigator = Navigator(mocks.dispatcher);
  });

  it('dispatches navigate intents', function () {
    navigator.navigate('/');
    navigator.navigate('/foo', false);

    expect(mocks.dispatcher.dispatchedIntents[0].path).to.eq('/');
    expect(mocks.dispatcher.dispatchedIntents[1].path).to.eq('/foo');

    expect(mocks.dispatcher.dispatchedIntents[0].pushState).to.be['true'];
    expect(mocks.dispatcher.dispatchedIntents[1].pushState).to.be['false'];
  });

  it('dispatches redirect intents', function () {
    navigator.redirect('/');
    expect(mocks.dispatcher.dispatchedIntents[0].path).to.eq('/');
    expect(mocks.dispatcher.dispatchedIntents[0].replaceState).to.be['true'];
  });
});