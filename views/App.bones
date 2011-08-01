view = Backbone.View.extend({
    initialize: function(options) {
        Backbone.View.prototype.initialize.call(this, arguments);
        this.render();
    },
    render: function() {
        return this;
    }
});
