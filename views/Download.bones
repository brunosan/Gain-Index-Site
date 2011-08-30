view = views.Main.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        views.Main.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'page'}));
        $('.top', this.el).empty().append(templates.Download(this));
        $('.floor', this.el).empty().append(templates.AboutFloor());
        this.pageTitle = 'Download data';
        return this;
    },
});
