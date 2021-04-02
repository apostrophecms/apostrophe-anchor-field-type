# apostrophe-anchor-field-type

Improves `apostrophe-schemas` to add an `anchor` field type that displays all `id` and `name` attributes from the target remote URL.

## Configuration
An anchor field depends on other schema fields to tell it what URLs it should look up to find `id`s and `name`s. You must provide a `remoteAnchorsFields` property to tell it what fields to connect to.
### Shorthand
```javascript
  // ... other schema fields
  {
    type: 'anchor',
    name: 'anchor',
    label: 'Anchor ID',
    remoteAnchorsFields: ['_page', 'url'],
  }
```
`remoteAnchorsFields` is an array of field names in the schema.

Shorthand makes the assumption that `_page` is a join (because of the leading _ in its name) and, conversely, that `url` is a string field. These assumptions also mean that:
- Joins are internal pages, using a `joinByOne` field type, and should be treated as such in the context of the current site.
- String could be anything and must be treated as external URLs. They must be fully absolute.

### Explicit singular
```javascript
  // ... other schema fields
  {
    type: 'anchor',
    name: 'anchor',
    label: 'Anchor ID',
    remoteAnchorsFields: {
      fieldName: '_page',
      urlType: 'relative',
      fieldType: 'join'
    },
  }
```
Spells out what is assumed in shorthand syntax.
- `urlType` tells module how to request the remote page.
- `fieldType` tells module what type of apostrophe field to connect to.

### Explicit array
```javascript
  // ... other schema fields
  {
    type: 'anchor',
    name: 'anchor',
    label: 'Anchor ID',
    remoteAnchorsFields: [
      {
        fieldName: '_page',
        urlType: 'relative',
        fieldType: 'join'
      },
      {
        fieldName: 'url',
        urlType: 'absolute',
        fieldType: 'string'
      },
    ],
  }
```

## Changelog

### Unreleased

- Updates axios version due to security patch.