views.Main = views.Main.extend({
    _ensureElement: function() {
        Backbone.View.prototype._ensureElement.apply(this, arguments);
    },
    // Wraps view in HTML document template.
    wrap: function() {
        return this.app.wrap(this);
    }
});
