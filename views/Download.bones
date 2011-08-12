view = views.Main.extend({
    className: 'download-page',
    initialize: function() {
        _.bindAll(this, 'render');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Download(this));


        return this;
    },
});
