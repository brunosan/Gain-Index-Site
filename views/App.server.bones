var time = Date.now();
views['App'] = views['App'].extend({
    _ensureElement: function() {
        Backbone.View.prototype._ensureElement.apply(this, arguments);
    },
    initialize: function() {
        // Can't wrap entire HTML document into el: break out body.
        $(this.el).empty().append(templates.Body());
    },
    // Wraps view in HTML document template.
    wrap: function() {
        return templates.App({
            version: time,
            body: $(this.el).html()
        })
    }
});
