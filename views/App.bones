view = Backbone.View.extend({
    id: 'view',
    _ensureElement: function() {
        this.el = $('#view');
    },
    initialize: function() {
        this.render();
    }
});
