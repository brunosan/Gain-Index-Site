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
                if (v.ISO3) {
                    var record = new Record(v, category, name);
                    record.values = _(v).reduce(reduceValues, {});
                    records[record.ISO3] = record;
                }
            }));

            actions.push(function(next) {
                // store just the values for use in the reduce function.
                var values = _(records).pluck('values');

                // build a concrete list of years that have values.
                var years = _(values).chain()
                    .map(function(r) { return _(r).keys(); })
                    .flatten()
                    .uniq()
                    .sort()
                    .value();

                // build a sorted array of values for each year.
                var sorted = _(years).reduce(function(memo, year) {
                    memo[year] = _(values).chain()
                        .pluck(year)
                        .without(null, undefined)
                        .uniq() // multiple countries can share the same rank
                        .sortBy(parseFloat)
                        .value() || [];
                    return memo;
                }, {});

                // Determine the rank for a value both from the front and the back
                // of the sorted value array for each year.
                function reduceRank(memo, value, year) {
                    var index = _(sorted[year]).indexOf(value);
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
    function importTrendDir(source) {
        return function(next) {
            var actions = [];
            var records = {};

            function reduceScores(memo, v, i) {
                if (!_.include(['name', 'ISO3'], i)) {
                    memo[i] = parseFloat(v);
                }
                return memo;
            }

            actions.push(processCSV(source + '/gain.csv', function(v, i) {
                if (v.ISO3) {
                    var record = {};
                    record._id = '/api/Indicator/trend-trend-' + v.ISO3;
                    record.country = v.name;
                    record.ISO3 = v.ISO3;
                    record.category = 'trend';
                    record.name = 'trend';
                    record.gain =  _(v).reduce(reduceScores, {});

                    records[record.ISO3] = record;
                }
            }));

            actions.push(processCSV(source + '/readiness.csv', function(v, i) {
                if (v.ISO3) {
                    records[v.ISO3].readiness = _(v).reduce(reduceScores, {});
                }
            }));

            actions.push(processCSV(source + '/vulnerability.csv', function(v, i) {
                if (v.ISO3) {
                    records[v.ISO3].vulnerability = _(v).reduce(reduceScores, {});
                }
            }));

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

    /**
     * Import a composite indicator CSV directory
     */
    function importIndicatorDir(source, category, name) {
        return function(next) {
            var actions = [];
            var records = {};

            actions.push(processCSV(source + '/score.csv', function(v, i) {
                if (v.ISO3) {
                    var record = new Record(v, category, name);
                    record.values = _(v).reduce(reduceValues, {});
                    records[record.ISO3] = record;
                }
            }));

            actions.push(processCSV(source + '/input.csv', function(v, i) {
                if (v.ISO3) {
                    var record = new Record(v, category, name);
                    records[record.ISO3] = records[record.ISO3] || record;
                    records[record.ISO3].input = _(v).reduce(reduceValues, {});
                }
            }));

            var raw = {};
            actions.push(processCSV(source + '/raw.csv', function(v, i) {
                if (v.ISO3) {
                    var record = new Record(v, category, name);
                    raw[record.ISO3] = _(v).reduce(reduceValues, {});
                }
            }));

            // Import all of the Raw0/Raw01/Raw02/Raw03 files into a 
            // single raw hash we use to check for the presence of a 
            // year's value.
            var rawX = {};
            var processRawX = function(filename) {
                return processCSV(source + '/' + filename, function(v, i) {
                    if (v.ISO3) {
                        var record = new Record(v, category, name);
                        rawX[record.ISO3] = rawX[record.ISO3] || record;
                        _.extend(rawX[record.ISO3], _(v).reduce(reduceValues, {}));
                    }
                });
            }

            actions.push(processRawX('raw0.csv'));
            actions.push(processRawX('raw01.csv'));
            actions.push(processRawX('raw02.csv'));
            actions.push(processRawX('raw02.csv'));

            // interpolated/extrapolated
            actions.push(function(next) {
                var counter = _.after(_(records).size(), next);
                _(records).each(function(record, iso3) {
                    records[iso3].origin = _(record.input).reduce(function(memo, value, year) {
                        if (rawX[iso3] && rawX[iso3][year] !== undefined) {
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

    actions.push(function(next) {
        var couch = require('backbone-couch')({
            host: config.couchHost,
            port: config.couchPort,
            name: config.couchPrefix + '_data',
            basename: 'data' 
        });

        couch.db.dbDel(next);
    });

    
    actions.push(function(next) {
        var dir = [process.cwd(), 'design-docs', 'data'].join('/');

        try {
            if (fs.statSync(dir).isDirectory) {
                var designDocs = _(fs.readdirSync(dir)).map(function(val) {
                    return dir + '/' + val;
                });
            }
        } catch (err) {   }

        var couch = require('backbone-couch')({
            host: config.couchHost,
            port: config.couchPort,
            name: config.couchPrefix + '_data',
            basename: 'data' 
        });

        couch.install(function(err) {
            err && errors.push(err);
            console.log('Created data');
            designDocs && couch.db.putDesignDocs(designDocs);
            next();
        });
    });


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


    actions.push(importTrendDir(__dirname + '/../resources/trends'));



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
    _(actions).reduceRight(_.wrap, function() {
          if (errors.length) {
              console.warn('Import completed, but with '+errors.length+' errors.');
          } else {
              console.warn('Import completed.');
          }
     })();
};
