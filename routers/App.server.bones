routers['App'] = routers['App'].extend({
    send: function(view) {
        return this.res.send(view.wrap());
    }
});
