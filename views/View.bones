view = Backbone.View;
view.prototype.events = {
    'click a': 'routeClick'
};

// Routes a click event
// --------------------
view.prototype.routeClick = function(ev) {
    console.log('route');
    return false;
    if (_.size(window.currentKeys)) {
        return true;
    }
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
                Backbone.history.navigate(true);
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
