view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('#main');
    },
    initialize: function() {
        this.app = new views.App();
        // The first time around the view comes rendered from the server.
        view.render && this.render();
        view.render = true;
    }
});

view.render = false;
