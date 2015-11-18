const Navigator = require('./coherence-pushstate').Navigator;
const expect = require('chai').expect;

describe('Navigator', () => {
  var navigator, mocks;

  beforeEach(() => {
    mocks = {};
    mocks.dispatcher = {
      dispatch: (intent) => {
        mocks.dispatcher.dispatchedIntents.push(intent);
      },
    };
    mocks.dispatcher.dispatchedIntents = [];

    mocks.window = {};

    navigator = Navigator(mocks.dispatcher);
  });

  it('dispatches navigate intents', () => {
    navigator.navigate('/');
    navigator.navigate('/foo', false);

    expect(mocks.dispatcher.dispatchedIntents[0].path).to.eq('/');
    expect(mocks.dispatcher.dispatchedIntents[1].path).to.eq('/foo');

    expect(mocks.dispatcher.dispatchedIntents[0].pushState).to.be.true;
    expect(mocks.dispatcher.dispatchedIntents[1].pushState).to.be.false;
  });

  it('dispatches redirect intents', () => {
    navigator.redirect('/');
    expect(mocks.dispatcher.dispatchedIntents[0].path).to.eq('/');
    expect(mocks.dispatcher.dispatchedIntents[0].replaceState).to.be.true;
  });
});
