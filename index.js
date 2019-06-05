module.exports = {
  improve: 'apostrophe-schemas',
  afterConstruct: function (self) {
    self.addFieldAnchorType();
    self.pushAsset('script', 'idField', { when: 'user' });
  },

  beforeConstruct: function(self, options) {},

  construct: function (self, options) {
    require('./lib/schemaField.js')(self, options);
  }
};
