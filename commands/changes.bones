var couch_sqlite = require('couch-sqlite');

command = Bones.Command.extend();
command.description = 'set up CouchDB > Sqlite changes feed';
command.prototype.initialize = function(options) {
    var schema = 'NAME VARCHAR, ISO3 VARCHAR';
    for (i = options.config.startYear; i <= options.config.endYear; i++) {
        schema += ", '" + i + "_raw' REAL";
        schema += ", '" + i + "' INTEGER";
    }

    var sqliteIndicators = {
        'gain': [0, 1],
        'gain_delta': [30, 1.66],
        'vulnerability': [-0.8, -130],
        'vulnerability_delta': [-0.5, -100],
        'readiness': [0, 100],
        'readiness_delta': [0.5, 100]
    };

    couch_sqlite({
        sqlite: options.config.files + '/indicators.sqlite',
        table: 'data',
        schema: schema,
        couchUri: 'http://' + options.config.couchHost + ':' + options.config.couchPort + '/' + options.config.couchPrefix + '_data' 
    }).map(function(doc) {
        if (doc._id.indexOf('/api/Indicator') !== 0 || !sqliteIndicators[doc.name]) {
            return false;
        }
        var values = {};
        for (var i = options.config.startYear; i <= options.config.endYear; i++) {
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
    }).run();
};
