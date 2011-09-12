var couch_sqlite = require('couch-sqlite');

command = Bones.Command.extend();
command.description = 'listen for changes';
command.prototype.initialize = function(options) {
    var schema = 'NAME VARCHAR, ISO3 VARCHAR';
    for (i = 1995; i <= 2010; i++) {
        schema += ", '" + i + "_raw' REAL";
        schema += ", '" + i + "' INTEGER";
    }

    // [offset, multiplier]
    var sqliteIndicators = {
        'gain': [0, 1],
        'gain_delta': [30, 1.66],
        'vulnerability': [-1, -100],
        'vulnerability_delta': [-0.5, -100],
        'readiness': [0, 100],
        'readiness_delta': [0.5, 100]
    };

    couch_sqlite({
        sqlite: options.config.files + '/indicators.sqlite',
        table: 'data',
        schema: schema,
        map: function(doc) {
            if (doc._id.indexOf('/api/Indicator') !== 0 || !sqliteIndicators[doc.name]) {
                return false;
            }
            var values = {};
            for (var i = 1995; i <= 2010; i++) {
                if (!doc.values[i]) {
                    values[i +'_raw'] = 0;
                    values[i] = 0;
                }
                else {
                    values[i +'_raw'] = doc.values[i];
                    values[i] = parseInt((doc.values[i] + sqliteIndicators[doc.name][0]) * sqliteIndicators[doc.name][1]) || 0;
                }
            }
            values.name = doc.name;
            values.ISO3 = doc.ISO3;
            return values;
        },
        couchHost: options.config.couchHost,
        couchPort: options.config.couchPort,
        couchDb: options.config.couchPrefix + '_data'
    });
};


