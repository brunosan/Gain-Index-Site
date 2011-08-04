view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('#main');
    },
    initialize: function() {
        this.app = new views.App();
        this.render();
    }
});
