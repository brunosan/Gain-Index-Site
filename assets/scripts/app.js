$(function() {
    Bones.start({pushState: true});
    // TODO: find out why route is executed automatically on '/'.
    var path = location.pathname + location.search;
    path != '/' && Backbone.history.navigate(path);
});
