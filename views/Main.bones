view = Backbone.View.extend({
    id: 'main',
    initialize: function(options) {
        this.app = new views.App();
    },
    attach: function() {
        return this;
    }
});

view.render = Bones.server;
