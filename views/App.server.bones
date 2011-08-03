var time = Date.now();
views['App'] = views['App'].extend({
    _ensureElement: function() {
        Backbone.View.prototype._ensureElement.apply(this, arguments);
    },
    // Wraps view in HTML document template.
    wrap: function() {
        return templates.App({
            version: time,
            view: $(this.el).html()
        });
    }
});
