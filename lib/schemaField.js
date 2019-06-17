const _ = require('lodash');

module.exports = function (self, options) {
  self.addFieldAnchorType = function () {
    let anchorFieldType = _.clone(self.fieldTypes.select);
    anchorFieldType.name = 'anchor';
    anchorFieldType.converters.string = function (req, data, name, object, field, callback) {
      object[name] = self.apos.launder.string(data[name], field.def);
      return setImmediate(callback);
    },

    anchorFieldType.converters.form = 'string';

    self.addFieldType(anchorFieldType)
  };
}