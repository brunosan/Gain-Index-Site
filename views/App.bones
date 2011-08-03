view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('body');
    },
    initialize: function() {
        this.render();
    }
});
