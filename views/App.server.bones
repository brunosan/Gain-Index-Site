var time = Date.now();
views['App'] = views['App'].extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        $(this.el).empty().append(templates.Layout());
        return this;
    },
    wrap: function() {
        return templates.App({
            version: time,
            body: $(this.el).html()
        })
    }
});
