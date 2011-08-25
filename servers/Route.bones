server = servers.Route.augment({
    initialize: function(parent, app) {
        parent.call(this, app);
        this.use(new servers['Tile'](app));
    },
    initializeAssets: function(parent, app) {
        parent.call(this, app);
        this.get('/assets/bones/wax.js', this.assets.wax);
    }
});
server.prototype.assets.wax = new mirror([
    require.resolve('wax/ext/modestmaps.min'),
    require.resolve('wax/dist/wax.mm')
], { type: '.js' });

var vendor = servers.Route.prototype.assets.vendor;
vendor.push(require.resolve('chrono/lib/chrono'));
vendor.push(require.resolve('d3/d3.js'));

server.prototype.assets.all = new mirror([
    server.prototype.assets.vendor,
    server.prototype.assets.wax,
    server.prototype.assets.core,
    server.prototype.assets.routers,
    server.prototype.assets.models,
    server.prototype.assets.views,
    server.prototype.assets.templates
], { type: '.js' });
