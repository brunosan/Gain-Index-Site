view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('#main');
    },
    initialize: function() {
        this.app = new views.App();
        // The first time around the view comes rendered from the server.
        view.render && this.render();
        view.render = true;
        !Bones.server && this.attach();
    },
    attach: function() {
        return this;
    }
});

view.render = Bones.server;
