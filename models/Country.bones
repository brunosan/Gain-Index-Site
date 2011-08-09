model = Backbone.Model.extend({
    url: function() {
        return '/api/Country/' + encodeURIComponent(this.get('id'));
    },
    parse: function(resp) {
        resp.indicators = new models.Indicators(resp.indicators);
        return resp;
    }
});
var request = require('request');

model.prototype.sync = function(method, model, options) {
    if (method != 'read') error('Unsupported method');

    var config = Bones.plugin.config;

    var designDoc = 'byCountry';

    var key = encodeURIComponent('"'+ model.get('id') +'"')

    var uri = 'http://' + config.couchHost +':'+ config.couchPort +'/';
    uri += config.couchPrefix +'_data/_design/' + designDoc + '/_view/default?';
    uri += 'key=' + key  +'&include_docs=true';

    var callback = function(err, resp, body) {
        if (err) return options.error(err);

        var results = JSON.parse(body);
      
        if (results.error) {
            return options.error(results.error);
        } else {
            options.success({
              id: model.get('id'),
              indicators: _(results.rows).pluck('doc')
            });
        }
    };
    return request({uri: uri, method: 'GET'}, callback);
};

