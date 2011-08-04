var time = Date.now();
views['App'] = views['App'].extend({
    _ensureElement: function() {
        Backbone.View.prototype._ensureElement.apply(this, arguments);
    },
    // Wraps view in HTML document template.
    wrap: function(view) {
        return templates.App({
            version: time,
            main: $(view.el).html()
        });
    }
});
