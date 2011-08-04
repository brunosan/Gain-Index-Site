view = views.AdminLogin.augment({
    initialize: function(parent, options) {
        this.model.bind('auth:status', function(model, resp) {
            var path = location.pathname + location.search;
            Backbone.history.navigate(path, true);
        });
        parent.call(this, options);
    }

})
