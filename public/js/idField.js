apos.define('apostrophe-schemas', {

  construct: function (self, options) {
    self.addFieldType({
      name: 'id',
      populate: function (data, name, $field, $el, field, callback) {
        var selectOptions = [];
        var $elementsWithIds = $('[id]');

        $elementsWithIds.each(function() {
          var $this = $(this);
          selectOptions.push({
            label: $this.attr('id'),
            value: $this.attr('id')
          })
        });
        
        $field.find('option').remove();

        _.each(selectOptions, function (choice) {
          var $option = $('<option></option>');
          $option.text(choice.label);
          $option.attr('value', choice.value);
          $field.append($option);
        });

        var value = ((data[name] === undefined) && field.choices[0]) ? field.choices[0].value : data[name];

        $field.val(value);

        return setImmediate(callback);
      },
      convert: function (data, name, $field, $el, field, callback) {
        data[name] = $field.val();        
        if (field.required && (!(data[name] && data[name].length))) {
          return setImmediate(_.partial(callback, 'required'));
        }
        return setImmediate(callback);
      }
    });
  }
});