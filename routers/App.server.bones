routers['App'] = routers['App'].extend({
    send: function(out) {
        this.res.send(out);
    }
});
