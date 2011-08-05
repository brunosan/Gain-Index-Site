var fs = require('fs');
var path = require('path');
var csv = require('csv'),
    _ = require('underscore')._,
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


    // constructor for record class that handles
    // the meta-data.
    function Record(data, category, name) {
        this._id = '/api/Indicator/' + category + '-' + name + '-' + data.ISO3;
        this.category = category;
        this.name = name;
        this.country = data.name;
        this.ISO3 = data.ISO3;

        return this;
    }

    /**
     * Helper to reduce the values being imported.
     */
    function reduceValues(memo, value, key) {
        if (/^\d{4}$/.test(key)) {
            memo[key] = parseFloat(value);
        }
        return memo;
    }

    /**
     * Helper to log errors.
     */
    function errorLog(err) {
        console.warn(err);
    }


    /**
     * Wrapper to pass a callback into the csv processing stack.
     */
    function processCSV(filename, process) {
        return function(next) {
            if (!fs.statSync(filename)) {
                return next();
            }
            else {
                csv()
                .fromPath(filename, {columns: true})
                .on('data', process)
                .on('error', errorLog)
                .on('end', next);
            }
        }
    }

    /**
     * Import a standard CSV file.
     */
    function importCSV(source, category, name) {
        return processCSV(source, function(v, i) {
            var record = new Record(v, category, name);
            record.values = _(v).reduce(reduceValues, {});

            put(config, 'data', record, function(err, doc){
                err && errors.push(err);
            });
        });
    }

    /**
     * Import a composite indicator CSV directory
     */
    function importIndicatorDir(source, category, name) {
        return function(next) {
            var actions = [];
            var records = {};

            actions.push(processCSV(source + '/score.csv', function(v, i) {
                var record = new Record(v, category, name);
                record.values = _(v).reduce(reduceValues, {});
                records[record.ISO3] = record;
            }));

            actions.push(processCSV(source + '/input.csv', function(v, i) {
                var record = new Record(v, category, name);
                records[record.ISO3].input = _(v).reduce(reduceValues, {});
            }));

            // TODO: Add another couple of actions here to process the raw
            // and raw0 files to generate the origin property.
            actions.push(function(next) {
                var counter = _.after(_(records).size(), next);

                _(records).each(function(record) {
                    put(config, 'data', record, function(err, doc){
                        err && errors.push(err);
                        counter();
                    });
                });

            });

            _(actions).reduceRight(_.wrap, next)();
        }
    }


    var actions = [];

    // Build a list of files to import by crawling the resources hierarchy.
    // Currently this is a blocking operation.
    var categories = ['gain', 'indicators', 'readiness', 'vulnerability'];
    categories.forEach(function(v) {
        var contents = fs.readdirSync(__dirname + '/../resources/' + v);
        contents.forEach(function(i) {
            var target = __dirname + '/../resources/' + v + '/' + i;
            if (i.match(/\.csv$/)) {
                actions.push(importCSV(target, v, i.slice(0, -4)));
            } else if (fs.statSync(target).isDirectory()) {
                actions.push(importIndicatorDir(target, v, i));
            }
        });
    });

    // Once we've built the file list import them asyncronously.
    _(actions).reduceRight(_.wrap, function() { console.warn('Import completed'); })();
};
