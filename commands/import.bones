var fs = require('fs');
var path = require('path');
var csv = require('csv'),
    exec = require('child_process').exec,
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

/**
 * Formats UNIX time to YYYY-MM-DD HH:MM
 *
 * @param {Integer} UNIX time in milliseconds.
 * @return {String} a formatted time string.
 */
function formatDate(ms) {
    function pad(n) { return n < 10 ? '0' + n : n; }
    var d = new Date(ms);
    var date = [
        d.getFullYear(),
        pad(d.getDate()),
        pad(d.getMonth()),
        pad(d.getHours()) + 'h' + pad(d.getMinutes())
    ];
    return date.join('-');
}

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
     * Helper to reduce the raw values being imported.
     */
    function reduceValues(memo, value, key) {
        if (/^\d{4}$/.test(key)) {
            var fl = parseFloat(('' + value).replace(/,/g, ''));
            if (!_.isNull(fl) && !_.isNaN(fl)) {
                memo[key] = fl;
            }
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
        var filename = path.resolve(filename);
        return function(next) {
            fs.stat(filename, function(err, stats) {
                if (err) return next();

                csv()
                    .fromPath(filename, {columns: true})
                    .on('data', process)
                    .on('error', errorLog)
                    .on('end', next);
            });
        }
    }

    /**
     * Import a standard CSV file.
     */
    function importCSV(source, category, name) {
        return function(next) {
            var actions = [];
            var records = {};

            actions.push(processCSV(source, function(v, i) {
                var record = new Record(v, category, name);
                record.values = _(v).reduce(reduceValues, {});
                records[record.ISO3] = record;
            }));

            actions.push(function(next) {
                // store just the values for use in the reduce function.
                var values = _(records).pluck('values');

                var years = _(values).chain()
                    .map(function(r) { return _(r).keys(); })
                    .flatten()
                    .uniq()
                    .sort()
                    .value();

                var sorted = _(years).reduce(function(memo, year) {
                    memo[year] = _(values).chain()
                        .pluck(year)
                        .without(null, undefined)
                        .uniq()
                        .sort()
                        .value() || [];
                    return memo;
                }, {});

                function reduceRank(memo, value, year) {
                    var index = _(sorted[year]).indexOf(value, true);
                    if (~index) {
                        var rank = {};
                        rank.asc = index + 1;
                        rank.desc = _(sorted[year]).size() - index;
                        memo[year] = rank;
                    }
                    return memo;
                }

                _(records).each(function(record, key) {
                    records[key].rank = _(record.values).reduce(reduceRank, {});
                });
                next();
            });

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
        };
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
                records[record.ISO3] = records[record.ISO3] || record;
                records[record.ISO3].input = _(v).reduce(reduceValues, {});
            }));

            var raw = {};
            actions.push(processCSV(source + '/raw.csv', function(v, i) {
                var record = new Record(v, category, name);
                raw[record.ISO3] = _(v).reduce(reduceValues, {});
            }));

            var raw0 = {};
            actions.push(processCSV(source + '/raw0.csv', function(v, i) {
                var record = new Record(v, category, name);
                raw0[record.ISO3] = _(v).reduce(reduceValues, {});
            }));


            // interpolated/extrapolated
            actions.push(function(next) {
                var counter = _.after(_(records).size(), next);
                _(records).each(function(record, iso3) {
                    records[iso3].origin = _(record.input).reduce(function(memo, value, year) {
                        if (raw0[iso3] && raw0[iso3][year] === value) {
                            memo[year] = 'raw';
                        } else if (raw[iso3] && raw[iso3][year] === value) {
                            memo[year] = 'assumed';
                        } else if (raw[iso3]) {
                            var years = _(raw[iso3]).keys();

                            var laterYears = _(years).any(function(y) {
                                return y > year;
                            });

                            var earlierYears = _(years).any(function(y) {
                                return y < year;
                            });

                            if (earlierYears && laterYears) {
                                memo[year] = 'interpolated';
                            } else if (earlierYears || laterYears) {
                                memo[year] = 'extrapolated';
                            }

                        }

                        return memo;
                    }, {});
                    counter();
                });

            });

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

    // Zip up and register the file created as ready for download.
    actions.push(function(next) {
        var ts = Date.now();
        var filename = 'resources-' + formatDate(ts) + '.zip';
        var child = exec('zip -r assets/files/' + filename + ' resources -i \*.csv',
            {cwd: path.resolve(__dirname + '/../') },
            function(err, stdout, stderr) {
                if (err !== null) {
                    console.log('exec error: ' + err);
                    next();
                }
                else {
                    console.log('Zip file created');
                    fs.stat(__dirname + '/../assets/files/' + filename, function(err, stats) {
                        (new models.Download({id: 'data'})).save({ 
                            filename: filename, 
                            timestamp: ts, 
                            size: stats.size
                        }, { success: next });
                    });
                }
            });
    });

    // Once we've built the file list import them asyncronously.
    _(actions).reduceRight(_.wrap, function() { console.warn('Import completed'); })();
};
