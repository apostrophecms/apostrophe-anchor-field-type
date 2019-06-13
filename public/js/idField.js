apos.define('apostrophe-schemas', {

  construct: function (self, options) {
    self.addFieldType({
      name: 'id',
      populate: function (data, name, $field, $el, field, callback) {

        if (!field.remoteIdsFields) {
          console.warn('This field requires a joinByOne field to watch');
          console.warn('Set the property `remoteIdsField` to the field name');
          return setImmediate(callback);
        }

        var $form = $field.parents('[data-apos-form]');
        var observerConfig = { attributes: false, childList: true, subtree: false };
        var remotes = {};
        var observer;

        if (_.isString(field.remoteIdsFields)) {
          setupOptions([field.remoteIdsFields]);
        } else {
          setupOptions(field.remoteIdsFields);
        }

        setupObservers(remotes)

        
        function setupOptions(array) {
          array.forEach(function(item) {
            // shorthand, fieldname string
            if (_.isString(item)) {
              remotes[item] = {
                fieldName: item
              };
              if (item[0] === '_') {
                remotes[item].fieldType = 'join';
                remotes[item].urlType = 'relative';
              } else {
                remotes[item].fieldType = 'external';
                remotes[item].urlType = 'absolute';
              }
            } else {
              // longform options
              if (item.fieldName) {
                remotes[item.fieldName] = {
                  ...item
                };
              }
            }
          });
        }

        function setupObservers(remotes) {
          observer = new MutationObserver(function(mutationsList, observer) {
            return getChoices(mutationsList, observer);
          });
          for (var remoteName in remotes) {
            var $remoteField = $form.find('[data-name="'+ remoteName +'"]');
            var $observable;
            if (remotes[remoteName].fieldType === 'join') {
              $observable = $remoteField.find('[data-choices]');
            } else {
              $observable = $remoteField.find(':input');
              $observable.on('keyup', function() {
                getChoices([ { target: $observable.get(0) } ]);
              });
            }
            remotes[remoteName].$observable = $observable;
            observer.observe($observable.get(0), observerConfig);
          }
        }

        function getChoices(mutationsList) {
          var current;
          var key;
          var options;

          mutationsList.forEach(function(mutation) {
            for (var remoteName in remotes) {
              if (mutation.target === remotes[remoteName].$observable.get(0)) {
                current = remotes[remoteName];
              }
            }
          })

          if (current.fieldType === 'join') {
            key = current.$observable.find('[data-chooser-choice]:first').attr('data-chooser-choice');  
          } else {
            key = current.$observable.val();
          }

          if (!key) {
            clearChoices();
            return populateChoices([])
          }

          options = {
            key: key,
            ...current
          };

          delete options.$observable;
          self.api('get-choices', options, function (data) {
            field.choices = data;
            clearChoices();
            populateChoices(data);
            populateValue()
          }, function (err) {
            if (err) {
              console.log(err);
            }
          });
        }

        function populateChoices(choices) {
          _.each(choices, function (choice) {
            var $option = $('<option></option>');
            $option.text(choice.label);
            $option.attr('value', choice.value);
            $field.append($option);
          });
        }

        function clearChoices() {
          $field.html('');
        }

        function populateValue() {
          if (field.choices) {
            value = ((data[name] === undefined) && field.choices[0]) ? field.choices[0].value : data[name];  
          } else {
            value = 'Nothing set';
          }

          $field.val(value);
        }

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