server = Bones.Server.extend({
    initialize: function(app) {
        _.bindAll(this, 'load', 'tile', 'grid', 'layer');

        this.config = app.config;
        this.config.header = { 'Cache-Control': 'max-age=' + 60 * 60 };

        this.param('tileset', this.load);

        // x.0.0 endpoints.
        this.get('/tiles/:version(1|2).0.0/:tileset/:z/:x/:y.(png|jpg|jpeg)', this.tile);
        this.get('/tiles/:version(1|2).0.0/:tileset/:z/:x/:y.grid.json', this.grid);
        this.get('/tiles/:version(1|2).0.0/:tileset/layer.json', this.layer);
    },

    validTilesetID: function(id) {
        return (/^[\w-]+$/i).test(id)
    },

    // Route middleware. Validate and load an mbtiles file specified in a tile
    // or download route.
    load: function(req, res, next, id) {
        if (!this.validTilesetID(id)) {
            return next(new Error.HTTP('Tileset does not exist', 404));
        }

        var model = new models.Tileset({ id: id });
        model.fetch({
            success: function(model) {
                res.model = model;
                next();
            },
            error: function(model, err) {
                err.status = 404;
                next(err);
            }
        });
    },

    // Tile endpoint
    tile: function(req, res, next) {
        var z = req.param('z'), x = req.param('x'), y = req.param('y');

        // 1.0.0: incoming request TMS => tilesource XYZ
        // 2.0.0: incoming request XYZ => tilesource XYZ
        if (req.param('version') === '1') y = Math.pow(2, z) - 1 - y;

        var headers = _.clone(this.config.header);
        res.model.source.getTile(z, x, y, function(err, tile, options) {
            if (err) {
                err.status = 404;
                next(err);
            } else {
                _.extend(headers, options || {});
                res.send(tile, headers);
            }
        });
    },

    // Grid endpoint.
    grid: function(req, res, next) {
        var z = req.param('z'), x = req.param('x'), y = req.param('y');

        // 1.0.0: incoming request TMS => tilesource XYZ
        // 2.0.0: incoming request XYZ => tilesource XYZ
        if (req.param('version') === '1') y = Math.pow(2, z) - 1 - y;

        var headers = _.clone(this.config.header);
        res.model.source.getGrid(z, x, y, function(err, grid, options) {
            if (err) {
                err.status = 404;
                next(err);
            } else {
                _.extend(headers, options || {});
                res.send(grid, headers);
            }
        });
    },

    // Layer endpoint.
    layer: function(req, res, next) {
        res.send(res.model.tilejson());
    }
});
