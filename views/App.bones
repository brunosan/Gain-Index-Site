// Starts routing on client
// ------------------------
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

// Sets up user and administrative elements on client
// --------------------------------------------------
var adminSetup = _.once(function() {
    Bones.user = new models.User;

    // Add bones-admin view.
    Bones.admin = new views['Admin']({
        model: Bones.user,
        auth: views['AdminLogin'],
        dropdowns: [
            views['AdminDropdownUser'],
            views['AdminDropdownExtra']
        ]
    });
    Bones.admin.render();
    Bones.user.status();
});

// Sets up key tracking on client
// ------------------------------
// TODO: should we use Bones.currentKeys?
var keyTracking = _.once(function() {
    $(function() {
        // Global tracking of pressed keys.
        $(document).keydown(function(ev) {
            window.currentKeys = window.currentKeys || {};
            window.currentKeys[ev.keyCode] = ev;
        });
        $(document).keyup(function(ev) {
            window.currentKeys = window.currentKeys || {};
            if (window.currentKeys[ev.keyCode]) {
                delete window.currentKeys[ev.keyCode];
            }
        });

    });
});

// Topmost view
// ------------
view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('body');
    },
    initialize: function() {
        this.render();
        if (!Bones.server) {
            this.activeLinks();
            adminSetup();
            keyTracking();
        }
    }
});

// Registers event handler for all click events
// --------------------------------------------
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
view.prototype.route = function(path) {
    var view = this;
    if (path.charAt(0) === '/') {
        var matched = _.any(Backbone.history.handlers, function(handler) {
            if (handler.route.test(path)) {
                Backbone.history.navigate(path, true);
                view.scrollTop();
                view.activeLinks()
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

// Adds 'active' class to links in active path
// -------------------------------------------
// TODO: IE debug.
view.prototype.activeLinks = function() {
    $('a.active').removeClass('active');
    var activePath = window.location.pathname;

    $('a').each(function(i, a) {
        var href = $(a).attr('href');
        if (activePath == '/') {
            activePath == href && $(a).addClass('active');
        } else {
            (activePath.indexOf(href) != -1) && (href != '/') && $(a).addClass('active');
        }
    });
};
