var fs = require('fs'),
    events = require('events'),
    util = require('util'),
    path = require('path'),
    tilelive = require('tilelive'),
    millstone = require('millstone'),
    carto = require('carto');

require('tilelive-mapnik').registerProtocols(tilelive);

// -------
// Start Map Cache
//
// In-process cache of the Mapnik XML template we generate, and the localized
// MML we use to do so..
var Cache = function(filename) {
    events.EventEmitter.call(this);

    this.available = false;
    this.queued = false;

    this.filename = filename;
    this.base = path.normalize(__dirname + '/../resources/map/');
}
util.inherits(Cache, events.EventEmitter);

Cache.prototype.load = function() {
    var that = this,
        actions = [];

    that.queued = true;

    // First, load and parse the mml.
    actions.push(function(next) {
        fs.readFile(path.join(that.base, that.filename), 'utf8', function(err, data) {
            if (err) return this.err = err;

            that.mml = JSON.parse(data);
            next();
        });
    });

    // Localize our mml.
    actions.push(function(next) {
        millstone.resolve({
            mml: that.mml,
            base: that.base,
            cache: path.normalize(__dirname + '/../files/cache')
        }, function(err, resolved) {
            if (err) return this.err = err;

            that.mml = resolved;
            next();
        });
    });

    // Let carto transform the mml to mapnik xml.
    actions.push(function(next) {
        new carto.Renderer({
            filename: that.filename,
        }).render(that.mml, function(err, output) {
            if (err) {
                that.err = err;
            } else {
                that.xml = output;
            }
            next();
        });
    });

    _(actions).reduceRight(_.wrap, function() {
        that.available = true;
        that.emit('available');
        that.removeAllListeners('available');
    })();
};

// @param options object with a `success` and `error` callback.
Cache.prototype.get = function(options) {
    var that = this;


    if (this.available) {
        return options.success(that.mml, that.xml);
    } else {

        if (!that.queued) that.load();

        this.on('available', function() {
            if (that.err) {
                return options.error(that.err);
            } else {
                options.success(that.mml, that.xml);
            }
        });
    }
};

// There are two types of maps, create a cache for each of them.
var indicatorCache = new Cache('indicator.mml');
var quadrantCache = new Cache('quadrant.mml');

// End map cache
// -----

models.Tileset.prototype.sync = function(method, model, options) {
    if (method != 'read') return options.error('Method not supported: ' + method);


    // Attach the tilelive source to our model.
    var mapCache = indicatorCache;
    if (model.get('indicator').indexOf('gain') == 0) {
        mapCache = quadrantCache;
    }
    mapCache.get({
        success:function(mml, xml) {
            // Setup the basic map "uri" for mapnik.
            var uri = {
                protocol: 'mapnik:',
                slashes: true,

                // This file does not exist; but we pass in literal strings below.
                // This is used as a cache key.
                pathname: path.join('resources/map', model.get('indicator') +'-'+ model.get('year') + '.xml'),
                query: {
                    //updated: map.mml._updated,
                    bufferSize: 0,
                    metatile: 1,
                },
            };

            uri.xml = _.template(xml, {
                year: model.get('year'),
                indicator: model.get('indicator')
            });

            // http://trac.mapnik.org/wiki/OutputFormats?version=8#PNGQuantization
            // reduce colors to 50 so that png encoding is faster and the tiles are smaller
            // if you see color degradation increase c higher, up to 256
            mml.format = "png8:c=50"
            
            uri.mml = mml;

            tilelive.load(uri, function(err, source) {
                if (err) return options.error(err);

                model.source = source;
                options.success();
            });
        },
        error: options.error
    });
}

