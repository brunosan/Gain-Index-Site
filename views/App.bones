var start = _.once(function() {
    var bypass = true,
        _loadUrl = Backbone.History.prototype.loadUrl;

    Backbone.History.prototype.loadUrl = function(e) {
        if (bypass) {
            bypass = false;
            return;
        }
        _loadUrl.call(this, e);
    }

    Bones.start({pushState: true, root: ""});
});

var adminSetup = _.once(function() {
    Bones.user = new models.User;

    // Add bones-admin view.
    Bones.admin = new views['Admin']({
        model: Bones.user,
        auth: views['AdminLogin'],
        dropdowns: [
            views['AdminDropdownUser'],
            views['AdminDropdownFront']
        ]
    });
    Bones.admin.render();
    Bones.user.status();
});


view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('body');
    },
    initialize: function() {
        this.render();
        if (!Bones.server) {
            adminSetup();
        }
    }
});

view.prototype.events = {
    'click a': 'routeClick'
};

// Routes a click event
// --------------------
view.prototype.routeClick = function(ev) {
    start();
    if (_.size(window.currentKeys)) {
        return true;
    }
    var href = $(ev.currentTarget).get(0).getAttribute('href', 2);
    if (href) return this.route($(ev.currentTarget).get(0).getAttribute('href', 2));
    return true;
};

// Routes a path
// -------------
view.prototype.route = function(path, noscroll) {
    var that = this;
    if (path.charAt(0) === '/') {
        var matched = _.any(Backbone.history.handlers, function(handler) {
            if (handler.route.test(path)) {
                Backbone.history.navigate(path, true);
                that.scrollTop();
                return true;
            }
        });
        return !matched;
    }
    return true;
};

// Scroll top FF, IE, Chrome safe
// ------------------------------
view.prototype.scrollTop = function() {
    if ($('body').scrollTop()) {
        $('body').animate({scrollTop: 0});
        return;
    }
    if ($('html').scrollTop()) {
        $('html').animate({scrollTop: 0});
        return;
    }
};
