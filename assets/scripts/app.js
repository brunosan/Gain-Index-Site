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

    // Start backbone with root = '', we'll need to start all routes with /
    // anyway to stay compatible with connect.
    Bones.start({pushState: true, root: ''});
    var path = location.pathname + location.search;
    path != '/' && Backbone.history.navigate(path, true);
});
