const initialize = require('./coherence-pushstate').initialize;
const NAVIGATE = require('coherence').NAVIGATE_ACTION_TYPE;
const expect = require('chai').expect;
const sinon = require('sinon');

describe('initialize', () => {
  var mocks;

  beforeEach(() => {
    mocks = {};
    mocks.dispatcher = {
      dispatch: (intent) => {
        mocks.dispatcher.registeredActionHandlers.forEach((handler) => {
          handler(intent);
        });
      },
      register: (handler) => {
        mocks.dispatcher.registeredActionHandlers.push(handler);
      },
    };
    mocks.dispatcher.registeredActionHandlers = [];

    mocks.window = {};
    mocks.window.history = {};
    mocks.window.history.pushState = sinon.spy();
    mocks.window.history.replaceState = sinon.spy();

    initialize(mocks.dispatcher, mocks.window);
  });

  it('updates the browser URL on navigate', () => {
    mocks.dispatcher.dispatch({
      type: NAVIGATE,
      path: '/foo',
      pushState: true,
    });
    expect(mocks.window.history.pushState.args[0][0].path).to.eq('/foo');
    expect(mocks.window.history.pushState.args[0][2]).to.eq('/foo');
  });

  it('does not update the browser URL on navigate, if pushState: false', () => {
    mocks.dispatcher.dispatch({
      type: NAVIGATE,
      path: '/bonk',
      pushState: false,
    });
    expect(mocks.window.history.pushState.callCount).to.eq(0);
  });

  it('replaces state on navigate, if replaceState: true', () => {
    mocks.dispatcher.dispatch({
      type: NAVIGATE,
      path: '/blamo',
      replaceState: true,
    });
    expect(mocks.window.history.replaceState.args[0][0].path).to.eq('/blamo');
    expect(mocks.window.history.replaceState.args[0][2]).to.eq('/blamo');
  });
});
