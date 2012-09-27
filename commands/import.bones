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

/**
* Initalize a JSV based validation environment for records.
*
* @return
*     object containing pre-registered schemas to validate against.
*/
function getSchemas() {

    var JSV = require('JSV').JSV;
    var env = JSV.createEnvironment('json-schema-draft-03');

    env.setOption('defaultSchemaURI', 'http://json-schema.org/hyper-schema#');
    env.setOption('latestJSONSchemaSchemaURI', 'http://json-schema.org/schema#');
    env.setOption('latestJSONSchemaHyperSchemaURI', 'http://json-schema.org/hyper-schema#');
    env.setOption('latestJSONSchemaLinksURI', 'http://json-schema.org/links#');

    var schemas = {};

    /**
    * This is a base schema that all our data needs to match against,
    * at the very least.
    *
    * This schema is re-used by all the other schemas.
    */
    schemas.base = env.createSchema({
        "type": "object",
        "properties": {
            "ISO3": {
                "type": "string",
                "required": true,
                "minLength": 3,
                "maxLength": 3,
                "enum": _(models.Country.meta).pluck("ISO3") // make sure it's a valid iso code.
            },
            "category": {
                "type": "string",
                "required": true,
                "enum": [ "gain", "readiness", "vulnerability", "indicators", "trend" ]
            },
            "name": {
                "type": "string",
                "required": true,
                "minLength": 3
            }
        }
    }, undefined, 'urn:indicatorBase#');

    /**
    * Schema for csv directories stored in resources/indicators.
    *
    * Input and origin are available for the objects imported here.
    */
    schemas.input = env.createSchema({
        "extends": {"$ref": "urn:indicatorBase#"},
        "properties": {
            "values": {
                "type": "object",
                "required": true,
                "additionalProperties": false,
                "patternProperties": { "^[0-9]{4}$": { "type": "number" } }
            },
            "input": {
                "type": "object",
                "required": true,
                "additionalProperties": false,
                "patternProperties": { "^[0-9]{4}$": { "type": "number" } }
            },
           "origin": {
                "type": "object",
                "additionalProperties": false,
                "patternProperties": {
                    "^[0-9]{4}$": {
                        "type": "string",
                        "enum": [ "raw", "assumed", "calculated"]
                    }
                }
            }
        }
    }, undefined, 'urn:indicatorInput#');

    /**
    * Schema for csv directories stored in resources/indicators.
    *
    * This is a special case for indicators which only have input.
    */
    schemas.inputOnly = env.createSchema({
        "extends": {"$ref": "urn:indicatorBase#"},
        "properties": {
             "input": {
                "type": "object",
                "required": true,
                "additionalProperties": false,
                "patternProperties": { "^[0-9]{4}$": { "type": "number" } }
            }
        }
    }, undefined, 'urn:indicatorInputOnly#');

    /**
    * Schema for singular csv files loaded from resources/{gain,vulnerability,readiness}
    *
    * These are calculated records for the components/sectors, and have ranks calculated
    * for them.
    */
    schemas.gvr = env.createSchema({
        "extends": {"$ref": "urn:indicatorBase#"},
        "properties": {
            "values": {
                "type": "object",
                "required": true,
                "additionalProperties": false,
                "patternProperties": { "^[0-9]{4}$": { "type": "number" } }
            },
            "rank": {
                "type": "object",
                "required": true,
                "additionalProperties": false,
                "patternProperties": {
                    "^[0-9]{4}$": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "asc": { "type": "integer", "minimum": 1, "required" : true  },
                            "desc": { "type": "integer", "minimum": 1, "required": true  }
                        }
                    }
                }
            }
        }
    }, undefined, 'urn:indicatorGVR#');

    /**
    * Schema type for the trend property descriptor.
    */
    env.createSchema({
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "Value": { "type": ["null", "number"], "required": true },
            "Sign": { "type": ["null", "integer"], "required": true, "minimum": -1, "maximum": 1 }
        }
    }, undefined, 'urn:trendPropType#');

    /**
    * Schema for the trend information, loaded from resources/trends.
    *
    * These are not yearly values, and follow a different pattern.
    */
    schemas.trend = env.createSchema({
        "extends": {"$ref": "urn:indicatorBase#"},
        "properties": {
            "gain": { "extends": { "$ref": "urn:trendPropType#" }, "required": true },
            "readiness": { "extends": { "$ref": "urn:trendPropType#" }, "required": true },
            "vulnerability": { "extends": { "$ref": "urn:trendPropType#" }, "required": true },
        }
    }, undefined, 'urn:indicatorTrend#');

    return schemas;
}


command = Bones.Command.extend();

command.description = 'import data';

command.prototype.initialize = function(options) {
    var config = options.config,
        errors = [];


    // Only register the schemas when the command is actually run.
    var schemas = getSchemas();

    // constructor for record class that handles
    // the meta-data.
    function Record(data, category, name) {
        console.log(name);
        this._id = '/api/Indicator/' + category + '-' + name + '-' + data.ISO3;
        this.category = category;
        this.name = name;
        this.country = data.Name;
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
    * Generate a save and validate callback for the action stack.
    */
    function validateAndSave(source, records, schema) {
        return function(next) {
            var dirName = path.resolve(source).replace(process.cwd() + '/', '');

            if (_(records).size()) {
                var invalid = [];

                var counter = _.after(_(records).size(), next);
                _(records).each(function(record, key) {
                    var valErrors = schemas[schema].validate(record).errors;

                    if (!valErrors.length) {
                        put(config, 'data', record, function(err, doc){
                            err && errors.push(err);
                            counter();
                        });
                    } else {
                        invalid.push(record.country + '(' + key + ')');
                        counter();
                    }
                });

                if (invalid.length) {
                    errors.push([
                        invalid.length,
                        "invalid records in",
                        dirName,
                        "including",
                        _(invalid).first(5).join(", "),
                        invalid.length > 5 ? 'and others.' : ''
                    ].join(" "));
                }
            } else {
                errors.push("No records could be imported from " + dirName);
                next();
            }
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

            actions.push(validateAndSave(source, records, 'gvr'));

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
                if (i && !_.include(['Name', 'ISO3'], i)) {
                    var parsed = parseFloat(v);
                    memo[i] = (!_.isNaN(parsed)) ? parsed : null;
                }
                return memo;
            }

            actions.push(processCSV(source + '/gain.csv', function(v, i) {
                if (v.ISO3) {
                    var record = {};
                    record._id = '/api/Indicator/trend-trend-' + v.ISO3;
                    record.country = v.Name;
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

            actions.push(validateAndSave(source, records, 'trend'));

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
                            memo[year] = 'calculated';
                        }

                        return memo;
                    }, {});
                    counter();
                });

            });

            var inputOnly = _(['gdp', 'pop', 'reporting', 'nurses_mw', 'physicians'])
                .include(path.basename(source))

            actions.push(validateAndSave(source, records, inputOnly ? 'inputOnly' : 'input'));

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
              _(errors).each(function(e) {
                  console.warn(e);
              })
          } else {
              console.warn('Import completed.');
          }
    })();


};
