var fs = require('fs'),
    path = require('path'),
    tilelive = require('tilelive'),
    millstone = require('millstone'),
    carto = require('carto');

require('tilelive-mapnik').registerProtocols(tilelive);

models.Tileset.prototype.sync = function(method, model, options) {
    if (method != 'read') return options.error('Method not supported: ' + method);

    var actions = [],
        base = path.normalize(__dirname + '/../resources/map/'),
        map = {};

    // TODO make mml filename attribute on the model.
    var filename = 'gain.mml';

    // TODO cache the xml we generate.

    // First, load and parse the mml.
    actions.push(function(next) {
        fs.readFile(path.join(base, filename), 'utf8', function(err, data) {
            if (err) return options.error(err);

            map.mml = JSON.parse(data);
            next();
        });
    });

    // Localize our mml.
    actions.push(function(next) {
        millstone.resolve({
            mml: map.mml,
            base: base,
            cache: path.normalize(__dirname + '/../files/cache')
        }, function(err, resolved) {
            if (err) return options.error(err);

            map.mml = resolved;
            next();
        });
    });

    // Let carto transform the mml to mapnik xml.
    actions.push(function(next) {
        new carto.Renderer({
            filename: filename,
        }).render(map.mml, function(err, output) {
            if (err) return options.error(err);

            map.xml = output;
            next();
        });
    });

    // Attach the tilelive source to our model.
    actions.push(function(next) {
        var uri = {
            protocol: 'mapnik:',
            slashes: true,

            // This file does not exist; but we pass in literal strings below.
            // This is used as a cache key.
            pathname: path.join(model.get('indicator'), model.get('year') + '.xml'),
            query: {
                updated: map.mml._updated,
                bufferSize: 256
            },
            xml: map.xml,
            mml: map.mml // Do we need this?
        };

        tilelive.load(uri, function(err, source) {
            if (err) return options.error(err);

            model.source = source;
            next();
        });
    });

    _(actions).reduceRight(_.wrap, function() {
        options.success(map);
    })();
}
