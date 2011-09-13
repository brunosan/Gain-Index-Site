view = views.Document.extend({
    render: function(options) {
        // Approach the cabinet.
        $(this.el).empty().append(templates.Cabinet({klass: 'page'}));
        var renderer = this.model.renderer()
        $('.top', this.el).empty().append(templates.Page(renderer));

        // download page has an additional dynamic block associated with it.
        if (this.options.download && this.model.id == 'download') {
            var dl = $('#downloadlink', this.el);
            dl.length && $(dl).empty().append(
                templates.Download({model: this.options.download})
            );
        }
        // Some things fall on the floor.
        $('.floor', this.el).empty().append(templates.AboutFloor());
        this.pageTitle = renderer.render('name');
        return this;
    }
});
