const _ = require('lodash');

module.exports = function (self, options) {
  self.addFieldAnchorType = function () {
    let idFieldType = _.clone(self.fieldTypes.select);
    idFieldType.name = 'id';
    idFieldType.converters.string = function (req, data, name, object, field, callback) {
      object[name] = self.apos.launder.string(data[name], field.def);
      return setImmediate(callback);
    },

    idFieldType.converters.form = 'string';

    self.addFieldType(idFieldType)
  };
}