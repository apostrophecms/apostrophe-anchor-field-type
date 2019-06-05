# apostrophe-anchors
Current status: WIP

An `improve` module that adds an ID wrapper around `apostrophe-widgets`, useful for navigating to widgets via anchors.

## Options

### Disable anchor fields for particular widget
Pass `anchors: false` as part of your widget configuration.
```javascript
  // app.js
  // .. other configuration
  'artwork-widgets':{
    extend: 'apostrophe-pieces-widgets',
    anchors: false
  },
```

### Custom attribute in the markup
This would be useful if doing custom front-end behavior. The default attribute is `id`.

```javascript
  // app.js
  // .. other configuration
  'apostrophe-anchors-widgets': {
    anchorsAttribute: 'data-override'
  }
```
The above will wrap your widget in `<div class="apos-area-widget-wrapper ui-draggable" data-apos-widget-wrapper="image" data-override="MY-VALUE">`

## TODOs
[] publish to npm