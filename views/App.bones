view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('#view');
    },
    initialize: function() {
        this.render();
    }
});
