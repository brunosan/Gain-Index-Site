var fs = require('fs'),
    path = require('path'),
    _ = require('underscore')._,
    request = require('request'),
    Step = require('step'),
    sqlite3 = require('sqlite3');

var sqliteIndicators = {
    // indicator: [range, offset]
    'gain': [100, 0],
    'gain_delta': [1, -0.5],
    'vulnerability': [1, 0],
    'vulnerability_delta': [1, -0.5],
    'readiness': [1, 0],
    'readiness_delta': [1, -0.5]
};

var sqlitePut = function(db, doc, callback) {
    // We only want certain indicators in sqlite.
    if (sqliteIndicators[doc.name] == undefined) {
        return callback(null);
    }

    var data = doc.values,
        meta = sqliteIndicators[doc.name],
        stmt = 'INSERT INTO data VALUES (?, ?',
        args = [];

    args.push(doc.name);
    args.push(doc.ISO3);

    for (var i = 1995; i <= 2010; i++) {
        stmt += ', ?';
        var v = parseInt((data[i] - meta[1]) / meta[0] * 100) || 0
        args.push(v);
    }
    stmt += ')';

    db.run('DELETE FROM data WHERE name = ? AND ISO3 = ?', [doc.name, doc.ISO3], function(err) {
        if (err) throw err;
        db.run(stmt, args, function(err) {
            callback(err);
        });
    })
}

command = Bones.Command.extend();
command.description = 'listen for changes';
command.prototype.initialize = function(options) {
    var config = options.config,
        errors = [];

    var dbfile = config.files + '/indicators.sqlite', self = this;
    sqlitedb = new sqlite3.Database(dbfile, sqlite3.OPEN_READWRITE, function(err) {
        if (err) throw err;

        sqlitedb.all('SELECT * FROM last_seq', function(err, data) {
            if (err) throw err;
            request.get({
                uri: 'http://' +
                    config.couchHost + ':' +
                    config.couchPort + '/' +
                    'gain_data/_changes?since=' + data[0].id + '&include_docs=true',
            }, function(err, response, body) {
                var body = JSON.parse(body), records = body.results;

                _(records).each(function(record) {
                    sqlitePut(sqlitedb, record.doc, function(err) {
                        if (err) throw err;
                    });
                })

                sqlitedb.run('DELETE FROM last_seq', function(err) {
                    if (err) throw err;
                    sqlitedb.run('INSERT INTO last_seq VALUES (?)', [ body.last_seq ]);
                })
            });
        });
    });
};


