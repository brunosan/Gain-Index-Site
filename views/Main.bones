view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('#main');
    },
    initialize: function(options) {
        this.app = new views.App();
        !options.suppressRender && this.render();
        !Bones.server && this.attach();
    },
    attach: function() {
        return this;
    }
});

view.render = Bones.server;
