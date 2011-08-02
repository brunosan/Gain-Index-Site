var fs = require('fs');
var path = require('path');
var csv = require('csv'),
    request = require('request');

var put = function(config, db, doc, callback) {
    request.put({
        uri: 'http://' +
            config.couchHost + ':' +
            config.couchPort + '/' +
            config.couchPrefix + '_' + db + '/' +
            encodeURIComponent(doc._id),
        json: doc
    }, function(err, res) {
        //doc._rev = res.headers['etag'].slice(1, -1);
        callback(err, doc);
    });
};

command = Bones.Command.extend();

command.description = 'import data';

command.prototype.initialize = function(options) {
    var config = options.config,
        errors = [];

    // Build a list of files to import by crawling the resources hierarchy.
    // Currently this is a blocking operation.
    var files = [];
    var categories = ['gain', 'indicators', 'readiness', 'vulnerability'];
    categories.forEach(function(v) {
        var contents = fs.readdirSync(__dirname + '/../resources/' + v);
        contents.forEach(function(i) {
            if (i.match(/\.csv$/)) {
                var name = i.slice(0, -4);
                files.push({
                    filename: __dirname + '/../resources/' + v + '/' + i,
                    id: v + '-' + name, 
                    category: v,
                    name: name
                });
            } else {
                // Doing this non-recursively as I expect to see this flattened later.
                var nested = fs.readdirSync(__dirname + '/../resources/' + v + '/' + i);
                nested.forEach(function(j) {
                    if (j.match(/\.csv$/)) {
                        var name = i;
                        var version = j.slice(0, -4);
                        files.push({
                            filename: __dirname + '/../resources/' + v + '/' + i + '/' + j,
                            id: v + '-' + name + '-' + version, 
                            category: v,
                            version: version,
                            name: name
                        });
                    }
                });
            }
        });
    });

    // Once we've build the file list import them asyncronously.
    files.forEach(function(file) {
        csv()
        .fromPath(file.filename, {columns: true})
        .on('data', function(v, i) {
            var record = {};
            record._id = file.id + '-' + v['ISO3'];
            ['category', 'version', 'name'].forEach(function(attr) {
                if (file[attr] != undefined) {
                    record[attr] = file[attr];
                }
            });

            record.values = {};
            for (var k in v) {
                if (k == 'ISO3') {
                    record[k] = v[k].toLowerCase();
                }
                else if (k == 'name') {
                    record['country'] = v[k];
                } else {
                    record.values[k] = parseFloat(v[k]);
                }
            }
            put(config, 'data', record, function(err, doc){
                if (err) {
                    errors.push(err);
                }
            });
        })
        .on('error', function(err) {
            console.log([file, err]);
        });
    });
};
