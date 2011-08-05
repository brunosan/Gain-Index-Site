$(function() {
    // Start backbone with root = '', we'll need to start all routes with /
    // anyway to stay compatible with connect.
    Bones.start({pushState: true, root: ''});
    var path = location.pathname + location.search;
    path != '/' && Backbone.history.navigate(path, true);
});
