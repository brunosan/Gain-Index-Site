var couch = require('backbone-couch');

var register = models.User.register;
models.IndicatorSummary.register = function(server) {
    var config = server.plugin.config;
    var options = {
        host: config.couchHost,
        port: config.couchPort,
        name: config.couchPrefix + '_data'
    };
    models.IndicatorSummary.prototype.db = couch(options).db;
    return register.apply(this, arguments);
};

models.IndicatorSummary.prototype.sync = function(method, model, options) {
    if (method != 'read') options.error('Unsupported method');
    this.db.view('_design/byIndicator/_view/default', {
            key: '"' + this.get('id') + '"',
            include_docs: true
        }, function(err, res) {
        if (err) return options.error(err);
        var data = {
            'values': {},
            'input': {},
            'rank': {}
        };
        _.each(Object.keys(data), function(k) {
            _.each(res.rows, function(row) {
                var doc = row.doc;
                if (!doc[k] || !doc['ISO3']) return;
                data[k][doc['ISO3']] = data[k][doc['ISO3']] || {};
                _.each(model.options.years, function(year) {
                    data[k][doc['ISO3']][year] = doc[k][year];
                });
            });
        });
        options.success(data);
    });
};
