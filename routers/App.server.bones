routers['App'] = routers['App'].extend({
    newApp: function() {
        return new views.App();
    },
    send: function(view) {
        return this.res.send(view.wrap());
    }
});
