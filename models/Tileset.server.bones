var fs = require('fs'),
    tilelive = require('tilelive'),
    millstone = require('millstone'),
    carto = require('carto');

require('tilelive-mapnik').registerProtocols(tilelive);

models.Tileset.prototype.sync = function(method, model, success, error) {
    if (method != 'read') return error('Method not supported: ' + method);

    var actions = [],
        base = __dirname + '/../resources/map/',
        map = {};

    // TODO make mml filename attribute on the model.
    var filename = 'gain.mml';

    // TODO improve error handling, ATM we just log to console.
    // TODO cache the xml we generate.

    actions.push(function(next) {
        fs.readFile(base + filename, 'utf8', function(err, data) {
            if (err) return console.warn(err);

            map.mml = JSON.parse(data);
            next();
        });
    });

    actions.push(function(next) {
        millstone.resolve({
            mml: filename,
            base: base,
            cache: __dirname + '/../files/cache'
        }, function(err, resolved) {
            if (err) return console.warn(err);

            map.mml = resolved;
            next();
        });
    });

    actions.push(function(next) {
        new carto.Renderer({
            filename: filename,
        }).render(map.mml, function(err, output) {
            if (err) return console.warn(err);

            map.xml = output;
            next();
        });
    });

    _(actions).reduceRight(_.wrap, function() {
        success(map);
    })();
}
