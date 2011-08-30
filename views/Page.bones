view = views.Document.extend({
    render: function(options) {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'page'}));
        var renderer = this.model.renderer()
        $('.top', this.el).empty().append(templates.Page(renderer));
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.AboutFloor());
        this.pageTitle = renderer.render('name');
        return this;
    }
});
