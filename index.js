const axios = require('axios');
const cheerio = require('cheerio');
const isUrl = require('validator/lib/isUrl')

module.exports = {
  improve: 'apostrophe-schemas',
  afterConstruct: function (self) {
    self.addFieldAnchorType();
    self.pushAsset('script', 'idField', { when: 'user' });
    self.pushAsset('stylesheet', 'idField', { when: 'user' });
    self.addRoutes();
  },

  beforeConstruct: function(self, options) {},

  construct: function (self, options) {
    require('./lib/schemaField.js')(self, options);
    self.httpify = function(s) {
      if (!/^(f|ht)tps?:\/\//i.test(s)) {
        s = "http://" + s;
      }
      return s;
    },
    self.addRoutes = function() {
      self.route('post', 'get-choices', async function (req, res) {
        try {
          if (!req.body.key) {
            return res.json({ error: true, msg: 'No key supplied' })
          }
          var key = req.body.key;
          var type = req.body.fieldType;
          var baseUrl = '';
          var page;

          if (type === 'join') {
              baseUrl = req.baseUrlWithPrefix;
              var criteria = { _id: key }
              var doc = await self.apos.pages.find(req, criteria, {_url: 1}).toObject();
              page = await axios.get(req.baseUrlWithPrefix + doc._url);
          } else {
            // if invalid url, bail
            if (!isUrl(key)) {
              return res.json([]);
            }
            page = await axios.get(self.httpify(key));
          }

          var $ = cheerio.load(page.data)
          var choices = [
            { label: '', value: '' }
          ];

          $('[id]').each(function() {
            choices.push({
              label: 'ID: ' + $(this).attr('id'),
              value: $(this).attr('id')
            })
          });

          $('[name]').each(function() {
            choices.push({
              label: 'Name: ' + $(this).attr('name'),
              value: $(this).attr('name')
            })
          });

          return res.json(choices);
        } catch (error) {
          return res.json({ error: error })
        }
      });
    }
  }
};
