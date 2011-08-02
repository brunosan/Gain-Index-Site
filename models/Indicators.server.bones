var request = require('request');

models.Indicators.prototype.sync = function(method, model, options) {
    if (method != 'read') error('Unsupported method');

    var config = Bones.plugin.config;

    var uri = 'http://' + config.couchHost +':'+ config.couchPort +'/';
    uri += config.couchPrefix +'_data/_design/byCountry/_view/default?';
    uri += 'key=' + encodeURIComponent('"'+ model.country +'"') +'&include_docs=true';

    var callback = function(err, resp, body) {
        if (err) return options.error(err);

        var results = JSON.parse(body);
      
        if (results.error) {
            return options.error(results.error);
        } else {
            var ret = [];
            results.rows.forEach(function(v) {
                ret.push(v.doc);
            });
            options.success(ret);
        }
    };
    return request({uri: uri, method: 'GET'}, callback);
};

