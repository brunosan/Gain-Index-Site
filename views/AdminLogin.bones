view = views.AdminLogin.augment({
    initialize: function(parent, options) {
        var authenticated = Bones.user.authenticated;
        this.model.bind('auth:status', function(model, resp) {
            // Only reload page if authentication status changes.
            // TODO: Why does B.h.navigate() not always result in an actual
            // execution of the route?
            if (authenticated != model.authenticated) {
                authenticated = model.authenticated;
                var path = location.pathname + location.search;
                views.App.route(path);
            }
        });
        parent.call(this, options);
    }

})
