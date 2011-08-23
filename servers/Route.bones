server = servers.Route.augment({
    initializeAssets: function(parent, app) {
        parent.call(this, app);
        this.get('/assets/bones/wax.js', this.assets.wax);
        this.get('/assets/bones/chrono.js', this.assets.chrono);
    }
});
server.prototype.assets.wax = new mirror([
    require.resolve('wax/ext/modestmaps.min'),
    require.resolve('wax/dist/wax.mm')
], { type: '.js' });
server.prototype.assets.chrono = new mirror([
    require.resolve('chrono/lib/chrono')
], { type: '.js' });

server.prototype.assets.all = new mirror([
    server.prototype.assets.vendor,
    server.prototype.assets.wax,
    server.prototype.assets.chrono,
    server.prototype.assets.core,
    server.prototype.assets.routers,
    server.prototype.assets.models,
    server.prototype.assets.views,
    server.prototype.assets.templates
], { type: '.js' });
