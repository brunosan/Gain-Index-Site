var request = require('request');

models.Country.prototype.sync = function(method, model, options) {
    if (method != 'read') options.error('Unsupported method');

    var config = Bones.plugin.config;

    var designDoc = 'byCountry';

    var key = encodeURIComponent('"'+ model.get('id') +'"')

    var uri = 'http://' + config.couchHost +':'+ config.couchPort +'/';
    uri += config.couchPrefix +'_data/_design/' + designDoc + '/_view/default?';
    uri += 'key=' + key  +'&include_docs=true';

    var callback = function(err, resp, body) {
        if (err) return options.error(err);

        var results = JSON.parse(body);
        if (!results.rows || !results.rows.length) results.error = new Error('Not found');

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

