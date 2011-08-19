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
var Cache = function() {
    events.EventEmitter.call(this);

    // TODO do we really need this?
    this.available = false;

    // TODO make mml filename attribute on the model.
    this.filename = 'gain.mml';
    this.base = path.normalize(__dirname + '/../resources/map/');
}
util.inherits(Cache, events.EventEmitter);

Cache.prototype.load = function() {
    var that = this,
        actions = [];

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
            if (err) return this.err = err;

            that.xml = output;
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
        this.on('available', function() {
            if (that.err) {
                return options.error(that.err);
            } else {
                options.success(that.mml, that.xml);
            }
        });
    }
};

var mapCache = new Cache();
// End map cache
// -----

models.Tileset.prototype.sync = function(method, model, options) {
    if (method != 'read') return options.error('Method not supported: ' + method);

    // Do the intialization if we're uncached.
    if (!mapCache.available) mapCache.load();

    // Attach the tilelive source to our model.
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
                    bufferSize: 256
                },
            };

            // Merge in the XML and MML from our cache.

            uri.xml = _.template(xml, {
                year: model.get('year'),
                indicator: model.get('indicator')
            });
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

