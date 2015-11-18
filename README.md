# coherence-pushstate

`window.history` hooks for Coherence navigate actions

## Usage

```javascript
var coherencePushState = require('coherence-pushstate');
var dispatcher = require('flux').Dispatcher();

// register action handlers to update browser URL
coherencePushState.initialize(dispatcher);

// convenient action creator, for navigating:
var navigator = coherencePushState.Navigator(dispatcher);

// React component for regular-looking html links, that use your Coherence
// Controller routing:
var CoherenceLink = React.createClass({
  render: function() {
    return (
      <a onClick={this.onClick} href={this.props.href}>{this.props.children}</a>
    );
  },
  onClick: function(event) {
    event.preventDefault();
    navigator.navigate(event.target.href);
  },
});
```

### Navigator methods

- __navigator.navigate(path, pushState)__
  - Dispatches a navigate action. If you've called `initialize`, will update
    the browser's URL, unless pushState is `false`.

equivalent to:

```javascript
dispatcher.dispatch({
  type: Coherence.NAVIGATE_ACTION_TYPE,
  path: path,
  pushState: (pushState === undefined ? true : pushState),
});
```

- __navigator.redirect(path)__
  - Dispatches a navigate action, with `replaceState: true`. If you've called
    `initialize`, will update the browser's URL via
    `window.history.replaceState`.

equivalent to:

```javascript
dispatcher.dispatch({
  type: Coherence.NAVIGATE_ACTION_TYPE,
  path: path,
  replaceState: true,
});
```
